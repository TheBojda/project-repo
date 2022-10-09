import { Router, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import slugify from 'slugify'
import * as crypto from "crypto";
import multer from 'multer';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import md5 from 'md5';

import { verifyCaptcha } from './services/recaptcha_service'
import { verifyUser } from './services/firebase_service'
import {
    createDraft, getDrafts, getDraft, setDraftState, updateDraft, getUserRole, createProject, updateProject,
    getProjectDataBySlug, getProjects, createDraftForProject, getDraftIdBySlug, deleteDraftById, search, collectHashtags
} from './services/db_service'

const api = Router();

const jsonParser = bodyParser.json()

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
})

async function auth(req: Request, res: Response, next: NextFunction) {
    const user = await verifyUser(req.body.userToken)
    if (!user || !user.email || !user.email_verified) {
        res.status(401).send({ success: false, error: 'Invalid user or user token!' })
        return
    }
    req.body.currentUser = user;
    next()
}

async function verify_captcha(req: Request, res: Response, next: NextFunction) {
    const captchaResult = await verifyCaptcha(req.body.captchaToken)
    if (!captchaResult.success) {
        res.status(401).send({ success: false, error: 'Invalid captcha response!' })
        return
    }
    next()
}

api.get('/version', async (req: Request, res: Response) => {
    res.send({ 'version': 1.0 })
})

api.post('/submitDraft', jsonParser, verify_captcha, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    if (req.body.draftId) {
        await updateDraft(req.body.draftId, JSON.stringify(req.body.content), user.email)
    } else {
        await createDraft(JSON.stringify(req.body.content), user.email)
    }
    res.send({ success: true })
})

api.post('/getDrafts', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const role = await getUserRole(user.email)
    const drafts = await getDrafts(role == 'admin' ? null : user.email)
    res.send({ role: role, drafts: drafts })
})

api.post('/getProjects', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const projects = await getProjects(user.email)
    res.send({ projects: projects })
})

api.post('/createDraftForProject', jsonParser, verify_captcha, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const slug = req.body.slug

    let id = await getDraftIdBySlug(slug, user.email)
    if (id) {
        res.send({ id: id })
        return
    }

    await createDraftForProject(slug, user.email)
    id = await getDraftIdBySlug(slug, user.email)
    res.send({ id: id })
})

api.post('/getDraft', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const draft = await getDraft(req.body.id)

    if (draft.email_hash != md5(user.email)) {
        res.status(401).send({ success: false, error: 'Unauthorized: not your draft!' })
        return
    }

    res.send(draft)
})

api.post('/setDraftState', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const role = await getUserRole(user.email)

    if (role != 'admin') {
        res.status(401).send({ success: false, error: 'Only admins can set drafts state!' })
        return
    }

    if (req.body.state == 'accepted') {
        const draft = await getDraft(req.body.id)
        if (draft.slug) {
            await updateProject(draft.slug, JSON.stringify(draft.content), draft.email_hash, draft.content.title + ' ' + draft.content.description, draft.content.category,
                (draft.content.coords && draft.content.coords.lat && draft.content.coords.lng) ? draft.content.coords : { lat: 0, lng: 0 })
        } else {
            const slug = slugify(draft.content.title, { lower: true }) + '-' + Date.now().toString(16)
            await createProject(slug, JSON.stringify(draft.content), draft.email_hash, draft.content.title + ' ' + draft.content.description, draft.content.category,
                (draft.content.coords && draft.content.coords.lat && draft.content.coords.lng) ? draft.content.coords : { lat: 0, lng: 0 })
        }
        await collectHashtags(draft.content.description)
        await deleteDraftById(req.body.id)
    } else {
        await setDraftState(req.body.id, req.body.state)
    }

    res.send({ success: true })
})

api.post('/getProject', jsonParser, async (req: Request, res: Response) => {
    const project = await getProjectDataBySlug(req.body.slug)
    res.send(project)
})

api.post('/uploadImage', upload.single('image'), verify_captcha, auth, async (req: Request, res: Response) => {
    const file = (req as any).file
    if (!file) {
        res.send({ success: false, error: 'No image!' })
        return;
    }

    const convertedFile = await sharp(file.buffer).jpeg({
        quality: 75
    }).toBuffer();

    const hash = crypto.createHash('sha256').update(convertedFile).digest('hex');
    fs.writeFileSync(path.join(__dirname, `../../public/images/${hash}.jpg`), convertedFile);
    res.send({ hash: hash })
})

api.post('/search', jsonParser, verify_captcha, async (req: Request, res: Response) => {
    const result = await search(req.body.expression, req.body.category, req.body.offset ? req.body.offset : 0, req.body.coords)
    res.send(result)
})

export default api;
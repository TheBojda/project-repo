import { Router, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import slugify from 'slugify'
import * as crypto from "crypto";
import multer from 'multer';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

import { verifyCaptcha } from './services/recaptcha_service'
import { verifyUser } from './services/firebase_service'
import { createDraft, getDrafts, getDraft, setDraftState, updateDraftSlug, updateDraft, getUserRole, createProject, updateProject } from './services/db_service'

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

api.post('/getDraft', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const draft = await getDraft(req.body.id)

    if (draft.email != user.email) {
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

    await setDraftState(req.body.id, req.body.state)

    if (req.body.state == 'accepted') {
        const draft = await getDraft(req.body.id)
        if (draft.slug) {
            updateProject(draft.slug, JSON.stringify(draft.content), draft.email, draft.content.description, draft.content.categories.join(' '),
                (draft.content.coords && draft.content.coords.lat && draft.content.coords.lng) ? draft.content.coords : { lat: 0, lng: 0 })
        } else {
            const slug = slugify(draft.content.title, { lower: true }) + '-' + Date.now().toString(16)
            createProject(slug, JSON.stringify(draft.content), draft.email, draft.content.description, draft.content.categories.join(' '),
                (draft.content.coords && draft.content.coords.lat && draft.content.coords.lng) ? draft.content.coords : { lat: 0, lng: 0 })
            updateDraftSlug(req.body.id, slug)
        }
    }

    res.send({ success: true })
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

export default api;
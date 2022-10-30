import { Router, Request, Response } from 'express';
import md5 from 'md5';
import slugify from 'slugify'

import { jsonParser, verify_captcha, auth } from '../../utils/server_utils';
import { updateDraft, createDraft, getDrafts, getDraftIdBySlug, createDraftForProject, getDraft, setDraftState, deleteDraftById } from '../services/draft_service'
import { updateProject, createProject } from '../services/project_service'
import { getUserRole } from '../services/user_service'
import { collectHashtags } from '../services/search_service'

export const dratfAPI = Router();

dratfAPI.post('/submitDraft', jsonParser, verify_captcha, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    if (req.body.draftId) {
        await updateDraft(req.body.draftId, JSON.stringify(req.body.content), user.email)
    } else {
        await createDraft(JSON.stringify(req.body.content), user.email)
    }
    res.send({ success: true })
})

dratfAPI.post('/getDrafts', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const role = await getUserRole(user.email)
    const drafts = await getDrafts(role == 'admin' ? null : user.email)
    res.send({ role: role, drafts: drafts })
})

dratfAPI.post('/createDraftForProject', jsonParser, verify_captcha, auth, async (req: Request, res: Response) => {
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

dratfAPI.post('/getDraft', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const draft = await getDraft(req.body.id)

    if (draft.email_hash != md5(user.email)) {
        res.status(401).send({ success: false, error: 'Unauthorized: not your draft!' })
        return
    }

    res.send(draft)
})

dratfAPI.post('/setDraftState', jsonParser, auth, async (req: Request, res: Response) => {
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

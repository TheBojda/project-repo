import { Router, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { verifyCaptcha } from './services/recaptcha_service'
import { verifyUser } from './services/firebase_service'
import { createDraft, getDrafts, getDraft, getUserRole } from './services/db_service'

const api = Router();

const jsonParser = bodyParser.json()

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
    await createDraft(JSON.stringify(req.body.content), user.email, null)
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

export default api;
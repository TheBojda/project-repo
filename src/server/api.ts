import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { verifyCaptcha } from './services/recaptcha_service'
import { verifyUser } from './services/firebase_service'
import { createDraft } from './services/db_service'

const api = Router();

const jsonParser = bodyParser.json()

api.get('/version', async (req: Request, res: Response) => {
    res.send({ 'version': 1.0 })
})

api.post('/submitDraft', jsonParser, async (req: Request, res: Response) => {
    console.log('submitDraft')

    const captchaResult = await verifyCaptcha(req.body.captchaToken)
    if (!captchaResult.success) {
        res.send({ success: false, error: 'Invalid captcha response!' })
        return
    }

    const user = await verifyUser(req.body.userToken)
    if (!user) {
        res.send({ success: false, error: 'Invalid user token!' })
        return
    }

    await createDraft(JSON.stringify(req.body.content), user.email || null, null)

    res.send({ success: true })
})

export default api;


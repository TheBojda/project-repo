import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { verifyCaptcha } from '../server/services/recaptcha_service';
import { verifyUser } from '../server/services/firebase_service'

export const jsonParser = bodyParser.json()

export async function verify_captcha(req: Request, res: Response, next: NextFunction) {
    const captchaResult = await verifyCaptcha(req.body.captchaToken)
    if (!captchaResult.success) {
        res.status(401).send({ success: false, error: 'Invalid captcha response!' })
        return
    }
    next()
}

export async function auth(req: Request, res: Response, next: NextFunction) {
    const user = await verifyUser(req.body.userToken)
    if (!user || !user.email || !user.email_verified) {
        res.status(401).send({ success: false, error: 'Invalid user or user token!' })
        return
    }
    req.body.currentUser = user;
    next()
}
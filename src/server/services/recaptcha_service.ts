import fetch from 'isomorphic-fetch';

export async function verifyCaptcha(token: string) {
    return await (await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`, {
        method: 'POST'
    })).json()
}
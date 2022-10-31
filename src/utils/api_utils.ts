import config from '../config.json'

export async function callApi(url: string, payload: any) {
    return await (
        await fetch(config.api_url + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
    ).json();
}

export async function uploadImage(file, userToken: string, captchaToken: string) {
    let body = new FormData()
    body.append('image', file)
    body.append('userToken', userToken)
    body.append('captchaToken', captchaToken)

    return await (
        await fetch(config.api_url + '/api/uploadImage', {
            method: "POST",
            body: body,
        })
    ).json();
}
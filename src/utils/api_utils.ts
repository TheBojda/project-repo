export async function callApi(url: string, payload: any) {
    return await (
        await fetch(url, {
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
        await fetch('/api/uploadImage', {
            method: "POST",
            body: body,
        })
    ).json();
}
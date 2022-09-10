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
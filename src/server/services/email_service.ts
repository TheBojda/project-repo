import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const REGION = "eu-west-1";

const sesClient = new SESClient({ region: REGION });

export async function sendEmail(fromAddress: string, toAddress: string, subject: string, content: string) {
    return await sesClient.send(new SendEmailCommand({
        Source: fromAddress,
        Destination: {
            ToAddresses: [
                toAddress
            ]
        },
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: content,
                },
            }
        }
    }))
}
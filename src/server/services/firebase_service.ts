
import * as fs from 'fs';
import * as path from 'path';
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'

import '../../utils/env_utils'

const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../' + process.env.SERVICE_ACCOUNT_FILE_PATH as string)).toString())

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export async function verifyUser(userToken: string) {
    try {
        return await getAuth().verifyIdToken(userToken)
    } catch (error) {
        console.log(error)
    }
    return null
}
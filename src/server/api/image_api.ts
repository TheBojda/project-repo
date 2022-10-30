import { Router, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import * as crypto from "crypto";
import * as fs from 'fs';
import * as path from 'path';

import { verify_captcha, auth } from '../../utils/server_utils';

export const imageAPI = Router();

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
})

imageAPI.post('/uploadImage', upload.single('image'), verify_captcha, auth, async (req: Request, res: Response) => {
    const file = (req as any).file
    if (!file) {
        res.send({ success: false, error: 'No image!' })
        return;
    }

    const convertedFile = await sharp(file.buffer).jpeg({
        quality: 75
    }).toBuffer();

    const hash = crypto.createHash('sha256').update(convertedFile).digest('hex');
    fs.writeFileSync(path.join(__dirname, `../../public/images/${hash}.jpg`), convertedFile);
    res.send({ hash: hash })
})
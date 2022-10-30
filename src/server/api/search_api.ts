import { Router, Request, Response } from 'express';

import { jsonParser, verify_captcha } from '../../utils/server_utils';
import { search } from '../services/search_service'

export const searchAPI = Router();

searchAPI.post('/search', jsonParser, verify_captcha, async (req: Request, res: Response) => {
    const result = await search(req.body.expression, req.body.category, req.body.offset ? req.body.offset : 0, req.body.coords)
    res.send(result)
})
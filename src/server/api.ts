import { Router, Request, Response } from 'express';

import { dratfAPI } from './api/draft_api';
import { projectAPI } from './api/project_api';
import { imageAPI } from './api/image_api';
import { searchAPI } from './api/search_api';

export const api = Router();

api.use(dratfAPI)
api.use(projectAPI)
api.use(imageAPI)
api.use(searchAPI)

api.get('/version', async (req: Request, res: Response) => {
    res.send({ 'version': 1.0 })
})
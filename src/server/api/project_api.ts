import { Router, Request, Response } from 'express';

import { jsonParser, auth } from '../../utils/server_utils';
import { getProjects, getProjectDataBySlug } from '../services/project_service'

export const projectAPI = Router();

projectAPI.post('/getProjects', jsonParser, auth, async (req: Request, res: Response) => {
    const user = req.body.currentUser
    const projects = await getProjects(user.email)
    res.send({ projects: projects })
})

projectAPI.post('/getProject', jsonParser, async (req: Request, res: Response) => {
    const project = await getProjectDataBySlug(req.body.slug)
    res.send(project)
})
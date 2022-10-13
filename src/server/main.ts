import express, { Express, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer'

import { getProjectDataBySlug, getHashtags } from './services/db_service'
import api from './api'

import App from '../components/App.vue'

import { init_env } from '../utils/env_utils'
import { title } from 'process';
init_env()

const app: Express = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));

app.use(express.static('dist/client'))
app.use(express.static('public'))

if (process.env.DEV_MODE)
    app.use(express.static('.'))

app.use('/api', api)

function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
}

async function renderContent(req: Request, res: Response, context: any) {
    const app = createSSRApp(App);
    const app_content = await renderToString(app, { path: req.originalUrl, ...context })
    res.render('template', {
        app_content: app_content,
        title: context.content.title,
        meta: {
            description: truncate(context.content.description.replace(/\s/g, ' '), 160),
            url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
            image_url: context.content.image ? `${req.protocol}://${req.hostname}${context.content.image}` : null
        }
    })
}

async function renderIndex(req: Request, res: Response) {
    res.render('template', { title: "Project repo" });
}

app.get('/', renderIndex);
app.get('/project_editor', renderIndex);
app.get('/drafts', renderIndex);
app.get('/preview', renderIndex);

app.get('/project/:slug', async (req: Request, res: Response) => {
    const slug = req.params.slug
    const projectData = await getProjectDataBySlug(slug)
    renderContent(req, res, projectData);
});

app.get('/project/:slug/json', async (req: Request, res: Response) => {
    const slug = req.params.slug
    const projectData = await getProjectDataBySlug(slug)
    res.send(projectData)
});

app.get('/hashtags', async (req: Request, res: Response) => {
    const hashtags = await getHashtags()
    res.send(hashtags)
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


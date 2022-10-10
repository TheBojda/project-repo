import express, { Express, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'node-html-parser';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer'

import { getProjectDataBySlug, getHashtags } from './services/db_service'
import api from './api'

import App from '../components/App.vue'

import { init_env } from '../utils/env_utils'
init_env()

const app: Express = express();
const port = 3000;

const index_template = parse(fs.readFileSync(path.join(__dirname, '../template.html')).toString())
index_template.querySelector('body')?.appendChild(parse('<script src="/index.js"></script>'))
index_template.querySelector('head')?.appendChild(parse('<link rel="stylesheet" href="/index.css">'))

const index_template_ssr = parse(fs.readFileSync(path.join(__dirname, '../template.html')).toString())
index_template_ssr.querySelector('body')?.appendChild(parse('<script src="/index.js"></script>'))
index_template_ssr.querySelector('head')?.appendChild(parse('<link rel="stylesheet" href="/index.css">'))

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
    index_template_ssr.querySelector('#app')?.set_content(app_content);
    index_template_ssr.querySelector('title')?.set_content(context.content.title);
    index_template_ssr.querySelector('meta[name="description"]')?.setAttribute('value', truncate(context.content.description.replace(/\s/g, ' '), 160));
    index_template_ssr.querySelector('meta[name="og:title"]')?.setAttribute('value', context.content.title);
    index_template_ssr.querySelector('meta[name="og:url"]')?.setAttribute('value', `${req.protocol}://${req.hostname}${req.originalUrl}`);
    index_template_ssr.querySelector('meta[name="og:description"]')?.setAttribute('value', truncate(context.content.description.replace(/\s/g, ' '), 300));
    index_template_ssr.querySelector('meta[name="og:image"]')?.setAttribute('value', context.content.image ?  `${req.protocol}://${req.hostname}${context.content.image}` : '');

    res.send(index_template_ssr.toString())
}

async function renderIndex(req: Request, res: Response) {
    res.send(index_template.toString())
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


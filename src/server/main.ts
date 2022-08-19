import express, { Express, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'node-html-parser';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer'
import { createPool } from 'mysql2/promise';
import { getProjectDataBySlug } from './services/db_service'

import App from '../components/App.vue'

import * as dotenv from 'dotenv'
console.log(process.env.DOTENV_CONFIG_PATH)
dotenv.config({ debug: true, path: process.env.DOTENV_CONFIG_PATH })

const app: Express = express();
const port = 3000;

const pool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const index_template = parse(fs.readFileSync(path.join(__dirname, '../template.html')).toString())
index_template.querySelector('body')?.appendChild(parse('<script src="/index.js"></script>'))
index_template.querySelector('head')?.appendChild(parse('<link rel="stylesheet" href="/index.css">'))

app.use(express.static('dist/client'))
app.use(express.static('public'))
if (process.env.DEV_MODE)
    app.use(express.static('.'))

async function renderContent(req: Request, res: Response, context: any) {
    const app = createSSRApp(App);
    const app_content = await renderToString(app, { path: req.originalUrl, ...context })
    index_template.querySelector('#app')?.set_content(app_content);
    res.send(index_template.toString())
}

app.get('/', async (req: Request, res: Response) => {
    renderContent(req, res, {});
});

app.get('/project/:slug', async (req: Request, res: Response) => {
    const slug = req.params.slug
    const projectData = await getProjectDataBySlug(pool, slug)
    renderContent(req, res, {...projectData});
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


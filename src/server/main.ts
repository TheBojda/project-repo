import express, { Express, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'node-html-parser';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer'

import App from '../components/App.vue'

const app: Express = express();
const port = 3000;

const index_template = parse(fs.readFileSync(path.join(__dirname, '../template.html')).toString())
index_template.querySelector('body')?.appendChild(parse('<script src="/index.js"></script>'))
index_template.querySelector('head')?.appendChild(parse('<link rel="stylesheet" href="/index.css">'))

app.use(express.static('dist/client'))
app.use(express.static('public'))
if (process.env.DEV_MODE)
    app.use(express.static('.'))

app.get('/', async (req: Request, res: Response) => {
    const app = createSSRApp(App);
    const app_content = await renderToString(app)
    index_template.querySelector('#app')?.set_content(app_content);
    res.send(index_template.toString())
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});


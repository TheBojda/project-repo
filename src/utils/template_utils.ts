import ejs from 'ejs'
import * as path from 'path';

export async function renderTemplate(template: string, params?: object | undefined) {
    return await ejs.renderFile(path.join(__dirname, "../../views/", template + '.ejs'), params, {async: true})
}
import { createPool } from 'mysql2/promise';

import { init_env } from '../../utils/env_utils'
init_env()

const pool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

async function runQuery(sql: string, values?: any) {
    let connection = await pool.getConnection();
    try {
        return await connection.execute(sql, values)
    } finally {
        connection.release();
    }
}

export async function getProjectDataBySlug(slug: string) {
    const [rows, _] = await runQuery("SELECT content, email_hash FROM projects WHERE slug = ?", [slug])
    return {
        content: JSON.parse(rows[0].content),
        avatar_hash: rows[0].email_hash
    }
}

export async function createDraft(content: string, email: string) {
    await runQuery("INSERT INTO drafts (`content`, `email_hash`) VALUES (?,md5(?))", [content, email])
}

export async function updateDraft(draftId: number, content: string, email: string) {
    await runQuery("UPDATE drafts SET content=?, state=NULL WHERE id=? AND email_hash=md5(?)", [content, draftId, email])
}

export async function getDrafts(email: string) {
    let rows
    if (email) {
        [rows] = await runQuery("SELECT id, content, email_hash, created, state FROM drafts WHERE email_hash = md5(?) ORDER BY state, created ASC", [email])
    } else {
        [rows] = await runQuery("SELECT id, content, email_hash, created FROM drafts WHERE state IS NULL ORDER BY created ASC")
    }
    let result: any[] = []
    for (const row of rows) {
        result.push({
            id: row.id,
            content: JSON.parse(row.content),
            avatar_hash: row.email_hash,
            state: row.state
        })
    }
    return result
}

export async function getDraft(id: number) {
    const [rows, _] = await runQuery("SELECT content, email_hash, slug FROM drafts WHERE id = ?", [id])
    return {
        content: JSON.parse(rows[0].content),
        email_hash: rows[0].email_hash,
        slug: rows[0].slug
    }
}

export async function setDraftState(id: number, state: string) {
    await runQuery("UPDATE drafts SET state=? WHERE id=?", [state, id])
}

export async function getUserRole(email: string) {
    const [rows, _] = await runQuery("SELECT role FROM users WHERE email = ?", [email])
    if ((rows as []).length > 0)
        return rows[0].role;
    return "user";
}

export async function getProjects(email: string) {
    let rows
    [rows] = await runQuery("select slug, content, email_hash from projects WHERE email_hash = md5(?) ORDER BY created ASC", [email])
    let result: any[] = []
    for (const row of rows) {
        result.push({
            content: JSON.parse(row.content),
            avatar_hash: row.email_hash,
            slug: row.slug
        })
    }
    return result
}

export async function createProject(slug: string, content: string, email_hash: string, description: string, category: string, position: { lat: number, lng: number }) {
    await runQuery('INSERT INTO projects (`slug`, `content`, `email_hash`, `description`, `category`, `position`) VALUES (?,?,?,?,?,Point(?,?))', [slug, content, email_hash, description, category, position.lng, position.lat])
}

export async function updateProject(slug: string, content: string, email_hash: string, description: string, category: string, position: { lat: number, lng: number }) {
    await runQuery('UPDATE projects SET content=?, description=?, category=?, position=Point(?,?) WHERE slug=? AND email_hash=?', [content, description, category, position.lng, position.lat, slug, email_hash])
}

export async function createDraftForProject(slug: string, email: string) {
    await runQuery('INSERT INTO drafts (`content`, `slug`, `email_hash`) SELECT content, slug, email_hash FROM projects WHERE slug=? AND email_hash=md5(?)', [slug, email])
}

export async function getDraftIdBySlug(slug: string, email: string) {
    const [rows, _] = await runQuery("SELECT id FROM drafts WHERE slug=? AND email_hash = md5(?)", [slug, email])
    if ((rows as []).length > 0)
        return rows[0].id;
    return null;
}

export async function deleteDraftById(id: number) {
    await runQuery("DELETE FROM drafts WHERE id=?", [id])
}

export async function search(expression: string, category: string, offset: string, position?: { lat: number, lng: number }) {
    let rows
    if (position && position.lat && position.lng)
        [rows] = await runQuery("SELECT slug, content, ST_Distance_Sphere(position, point(?, ?)) as distance FROM projects WHERE MATCH (description) AGAINST (?) AND category=? ORDER BY distance ASC LIMIT 11 OFFSET " + (parseInt(offset) || 0), [position.lng, position.lat, expression, category]);
    else
        [rows] = await runQuery("SELECT slug, content, MATCH (description) AGAINST (?) as relevance FROM projects WHERE MATCH (description) AGAINST (?) AND category=? ORDER BY relevance DESC LIMIT 11 OFFSET " + (parseInt(offset) || 0), [expression, expression, category]);
    let projects: any[] = []
    let c = 0;
    for (const row of rows) {
        projects.push({
            content: JSON.parse(row.content),
            slug: row.slug
        })
        c++;
        if (c > 9)
            break;
    }
    let result = { projects: projects }
    if (rows.length > 10)
        result['next_offset'] = offset + 11;
    return result
}

export async function collectHashtags(content: string) {
    let hashtags = content.split(/[\s\n\r]/gmi).filter(v => v.startsWith('#'))
    for (let hashtag of hashtags) {
        await runQuery("INSERT IGNORE hashtags (`hashtag`) VALUES (?)", [hashtag.substring(1)]);
    }
}

export async function getHashtags() {
    let rows
    [rows] = await runQuery("SELECT hashtag FROM hashtags");
    let result: any[] = [];
    for (const row of rows) {
        result.push({ value: row.hashtag, label: row.hashtag })
    }
    return result
}
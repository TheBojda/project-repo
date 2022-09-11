import { Pool, createPool } from 'mysql2/promise';

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
    const [rows, _] = await runQuery("SELECT content FROM projects WHERE slug = ?", [slug])
    return {
        content: JSON.parse(rows[0].content)
    }
}

export async function createDraft(content: string, email: string) {
    await runQuery("INSERT INTO drafts (`content`, `email`) VALUES (?,?)", [content, email])
}

export async function updateDraft(draftId: number, content: string, email: string) {
    await runQuery("UPDATE drafts SET content=?, state=NULL WHERE id=? AND email=?", [content, draftId, email])
}


export async function getDrafts(email: string) {
    let rows
    if (email) {
        [rows] = await runQuery("SELECT id, content, md5(email) as avatar_hash, created, state FROM drafts WHERE email = ? ORDER BY state, created ASC", [email])
    } else {
        [rows] = await runQuery("SELECT id, content, md5(email) as avatar_hash, created FROM drafts WHERE state IS NULL ORDER BY created ASC")
    }
    let result: any[] = []
    for (const row of rows) {
        result.push({
            id: row.id,
            content: JSON.parse(row.content),
            avatar_hash: row.avatar_hash,
            state: row.state
        })
    }
    return result
}

export async function getDraft(id: number) {
    const [rows, _] = await runQuery("SELECT content, email, slug FROM drafts WHERE id = ?", [id])
    return {
        content: JSON.parse(rows[0].content),
        email: rows[0].email,
        slug: rows[0].slug
    }
}

export async function setDraftState(id: number, state: string) {
    await runQuery("UPDATE drafts SET state=? WHERE id=?", [state, id])
}

export async function updateDraftSlug(id: number, slug: string) {
    await runQuery("UPDATE drafts SET slug=? WHERE id=?", [slug, id])
}

export async function getUserRole(email: string) {
    const [rows, _] = await runQuery("SELECT role FROM users WHERE email = ?", [email])
    if ((rows as []).length > 0)
        return rows[0].role;
    return "user";
}

export async function createProject(slug: string, content: string, email: string, description: string, categories: string, position: { lat: number, lng: number }) {
    await runQuery('INSERT INTO projects (`slug`, `content`, `email`, `description`, `categories`, `position`) VALUES (?,?,?,?,?,ST_SRID(Point(?,?),4326))', [slug, content, email, description, categories, position.lat, position.lng])
}

export async function updateProject(slug: string, content: string, email: string, description: string, categories: string, position: { lat: number, lng: number }) {
    await runQuery('UPDATE projects SET content=?, description=?, categories=?, position=ST_SRID(Point(?,?),4326) WHERE slug=? AND email=?', [content, description, categories, position.lat, position.lng, slug, email])
}
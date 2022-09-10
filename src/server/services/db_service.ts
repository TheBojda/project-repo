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
    const [rows, _] = await runQuery("SELECT title, short_description, description FROM projects WHERE slug = ?", [slug])
    return rows[0]
}

export async function createDraft(content: string, email: string | null, slug: string | null) {
    await runQuery("INSERT INTO drafts (`content`, `email`, `slug`) VALUES (?,?,?)", [content, email, slug])
}

export async function getDrafts(email: string) {
    let rows
    if (email) {
        [rows] = await runQuery("SELECT id, content, md5(email) as avatar_hash, created FROM drafts WHERE email = ? ORDER BY created ASC", [email])
    } else {
        [rows] = await runQuery("SELECT id, content, md5(email) as avatar_hash, created FROM drafts ORDER BY created ASC")
    }
    let result: any[] = []
    for (const row of rows) {
        result.push({
            id: row.id,
            content: JSON.parse(row.content),
            avatar_hash: row.avatar_hash
        })
    }
    return result
}

export async function getDraft(id: number) {
    const [rows, _] = await runQuery("SELECT content, email FROM drafts WHERE id = ?", [id])
    return {
        content: JSON.parse(rows[0].content),
        email: rows[0].email
    }
}

export async function getUserRole(email: string) {
    const [rows, _] = await runQuery("SELECT role FROM users WHERE email = ?", [email])
    if ((rows as []).length > 0)
        return rows[0].role;
    return "user";
}
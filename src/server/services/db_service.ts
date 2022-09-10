import { Pool, createPool } from 'mysql2/promise';

import { init_env } from '../../utils/env_utils'
init_env()

const pool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export async function getProjectDataBySlug(slug: string) {
    const connection = await pool.getConnection();
    try {
        const [rows, _] = await connection.execute("SELECT title, short_description, description FROM projects WHERE slug = ?", [slug])
        return rows[0]
    } finally {
        connection.release();
    }
}

export async function createDraft(content: string, email: string | null, slug: string | null) {
    const connection = await pool.getConnection();
    try {
        await connection.execute("INSERT INTO drafts (`content`, `email`, `slug`) VALUES (?,?,?)", [content, email, slug])
    } finally {
        connection.release();
    }
}
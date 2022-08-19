import { Pool } from 'mysql2/promise';

export async function getProjectDataBySlug(pool: Pool, slug: string) {
    const connection = await pool.getConnection();
    try {
        const [rows, _] = await connection.execute("SELECT title, short_description, description FROM projects WHERE slug = ?", [slug])
        return rows[0]
    } finally {
        connection.release();
    }
}
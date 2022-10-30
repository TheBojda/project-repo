import { runQuery } from '../../utils/db_utils';

export async function getProjectDataBySlug(slug: string) {
    const rows = await runQuery("SELECT content, email_hash FROM projects WHERE slug = ?", [slug])
    return {
        content: JSON.parse(rows[0].content),
        avatar_hash: rows[0].email_hash
    }
}

export async function getProjects(email: string) {
    const rows = await runQuery("select slug, content, email_hash from projects WHERE email_hash = md5(?) ORDER BY created ASC", [email])
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
    await runQuery('UPDATE projects SET changeset=NULL, content=?, description=?, category=?, position=Point(?,?) WHERE slug=? AND email_hash=?', [content, description, category, position.lng, position.lat, slug, email_hash])
}

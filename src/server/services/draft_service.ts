import { runQuery } from '../../utils/db_utils';

export async function createDraft(content: string, email: string) {
    await runQuery("INSERT INTO drafts (`content`, `email_hash`) VALUES (?,md5(?))", [content, email])
}

export async function updateDraft(draftId: number, content: string, email: string) {
    await runQuery("UPDATE drafts SET content=?, state=NULL WHERE id=? AND email_hash=md5(?)", [content, draftId, email])
}

export async function getDrafts(email: string) {
    const rows = (email)
        ? await runQuery("SELECT id, content, email_hash, created, state FROM drafts WHERE email_hash = md5(?) ORDER BY state, created ASC", [email])
        : await runQuery("SELECT id, content, email_hash, created FROM drafts WHERE state IS NULL ORDER BY created ASC")
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
    const rows = await runQuery("SELECT content, email_hash, slug FROM drafts WHERE id = ?", [id])
    return {
        content: JSON.parse(rows[0].content),
        email_hash: rows[0].email_hash,
        slug: rows[0].slug
    }
}

export async function setDraftState(id: number, state: string) {
    await runQuery("UPDATE drafts SET state=? WHERE id=?", [state, id])
}

export async function createDraftForProject(slug: string, email: string) {
    await runQuery('INSERT INTO drafts (`content`, `slug`, `email_hash`) SELECT content, slug, email_hash FROM projects WHERE slug=? AND email_hash=md5(?)', [slug, email])
}

export async function getDraftIdBySlug(slug: string, email: string) {
    const rows = await runQuery("SELECT id FROM drafts WHERE slug=? AND email_hash = md5(?)", [slug, email])
    if (rows.length > 0)
        return rows[0].id;
    return null;
}

export async function deleteDraftById(id: number) {
    await runQuery("DELETE FROM drafts WHERE id=?", [id])
}


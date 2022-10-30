import { runQuery } from '../../utils/db_utils';

export async function getMaxChangeset() {
    const rows = await runQuery("SELECT MAX(changeset) as max_changeset FROM projects")
    return rows[0].max_changeset
}

export async function getChangeset(n: number) {
    const rows = await runQuery("SELECT slug, content, email_hash FROM projects WHERE changeset=?", [n])
    let result: any[] = [];
    for (const row of rows) {
        result.push({ value: row.hashtag, label: row.hashtag })
    }
    return result
}
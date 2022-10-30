import { runQuery } from '../../utils/db_utils';

export async function search(expression: string, category: string, offset: string, position?: { lat: number, lng: number }) {
    const rows = (position && position.lat && position.lng)
        ? await runQuery("SELECT slug, content, ST_Distance_Sphere(position, point(?, ?)) as distance FROM projects WHERE MATCH (description) AGAINST (?) AND category=? ORDER BY distance ASC LIMIT 11 OFFSET " + (parseInt(offset) || 0), [position.lng, position.lat, expression, category])
        : await runQuery("SELECT slug, content, MATCH (description) AGAINST (?) as relevance FROM projects WHERE MATCH (description) AGAINST (?) AND category=? ORDER BY relevance DESC LIMIT 11 OFFSET " + (parseInt(offset) || 0), [expression, expression, category])
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
    const rows = await runQuery("SELECT hashtag FROM hashtags");
    let result: any[] = [];
    for (const row of rows) {
        result.push({ value: row.hashtag, label: row.hashtag })
    }
    return result
}
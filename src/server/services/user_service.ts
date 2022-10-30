import { runQuery } from '../../utils/db_utils';

export async function getUserRole(email: string) {
    const rows = await runQuery("SELECT role FROM users WHERE email = ?", [email])
    if (rows.length > 0)
        return rows[0].role;
    return "user";
}

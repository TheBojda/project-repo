import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv'

if (process.env.DEV_MODE)
    dotenv.config({ override: true, path: "env.development" })

const main = async () => {
    const connection = await createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    const [rows] = await connection.execute("SELECT MAX(changeset) as max_changeset FROM projects")
    let max_changeset = rows[0].max_changeset
    if (!max_changeset)
        max_changeset = 0;

    let next_changeset = max_changeset + 1;

    await connection.execute("UPDATE projects SET changeset=? WHERE changeset IS NULL", [next_changeset])

    connection.end();
}

main();
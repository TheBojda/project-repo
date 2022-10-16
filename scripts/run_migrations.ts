import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import * as path from 'path';
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

    await connection.execute(`CREATE TABLE IF NOT EXISTS migrations (migration VARCHAR(255))`)

    const files = fs.readdirSync(path.join(process.cwd(), './database/migrations'))
    files.sort()
    for (const file of files) {
        let rows
        [rows] = await connection.execute("SELECT migration FROM migrations WHERE migration = ?", [file])
        if (rows.length == 0) {
            console.log(`Running migration: ${file}`);
            const content = fs.readFileSync(path.join(process.cwd(), `./database/migrations/${file}`), 'utf-8').toString()
            await connection.execute(content);
            await connection.execute("INSERT INTO migrations VALUES (?)", [file]);
        }
    }

    connection.end();
}

main();

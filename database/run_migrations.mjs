import { createConnection } from 'mysql2/promise';
import fs from 'fs';

import * as dotenv from 'dotenv'
dotenv.config({ debug: true, path: process.env.DOTENV_CONFIG_PATH })

const main = async () => {
    const connection = await createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    await connection.execute(`CREATE TABLE IF NOT EXISTS migrations (migration VARCHAR(255))`)

    /*
    const files = fs.readdirSync('./sql')
    for (const file of files) {
        const [rows, _] = await connection.execute("SELECT migration FROM migrations WHERE migration = ?", [file])
        if ((<Array<any>>rows).length == 0) {
            console.log(`Running migration: ${file}`);
            const content = fs.readFileSync(`./sql/${file}`, 'utf-8').toString()
            await connection.execute(content);
            await connection.execute("INSERT INTO migrations VALUES (?)", [file]);
        }
    }
    */

    connection.end();
}

main();

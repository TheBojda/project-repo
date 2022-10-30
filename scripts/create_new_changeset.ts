import { runQuery } from '../src/utils/db_utils'

const main = async () => {
    const rows = await runQuery("SELECT MAX(changeset) as max_changeset FROM projects")
    let max_changeset = rows[0].max_changeset
    if (!max_changeset)
        max_changeset = 0;

    let next_changeset = max_changeset + 1;

    await runQuery("UPDATE projects SET changeset=? WHERE changeset IS NULL", [next_changeset])
}

main();
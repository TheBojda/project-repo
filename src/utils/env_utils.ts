import * as dotenv from 'dotenv'

export function init_env() {
    dotenv.config()
    if (process.env.DEV_MODE)
        dotenv.config({ override: true, path: "env.development" })
}
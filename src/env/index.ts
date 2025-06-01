import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(
        [
            'develop',
            'test',
            'prod'
        ])
        .default('develop'),
    DATABASE_CLIENT: z.string(),
    DATABASE_URL: z.string(),
    MIGRATIONS_URL : z.string(),
    PORT : z.number().default(3333)
})

// Faz conversão automática das variáveis da env
export const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    console.error('Invalid enviroment variables!\n',_env.error.format)

    throw new Error('Invalid enviroment variables')
}

export const env = _env.data
import { config } from 'dotenv'
import { z } from 'zod'

// Caso for executado server em ambiente de testes, ele irá utilizar .env.test
if(process.env.NODE_ENV == 'test'){
    config({ path: '.env.test'})
} else {
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(
        [
            'develop',
            'test',
            'production'
        ])
        .default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    MIGRATIONS_URL : z.string(),
    PORT : z.coerce.number().default(3333)
})

// Faz conversão automática das variáveis da env
export const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    throw new Error(`Invalid enviroment variables\n ${_env.error.format()}`,)
}

export const env = _env.data
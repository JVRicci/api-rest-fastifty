import fastify from 'fastify'
import { knex } from './database'
import cookie from '@fastify/cookie'

import { env } from './env'
import { transactionRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)

// Criação de preHandler global, onde o log da requisição é retornado
app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url} `)
})

// Registro do plugin de transactions e configura prefixo
app.register(transactionRoutes, {
  prefix : 'transactions'
})

app.listen({
  port : env.PORT,
}).then(() => {
  console.log(`Server is running on port ${env.PORT}`)
})

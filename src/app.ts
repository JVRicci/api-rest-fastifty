import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionRoutes } from './routes/transactions'

// Exporta a variável para ser utilizada tanta pelo server quanto por testes automatizados
export const app = fastify()

app.register(cookie)

// Criação de preHandler global, onde o log da requisição é retornado
app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url} `)
})

// Registro do plugin de transactions e configura prefixo
app.register(transactionRoutes, {
    prefix : 'transactions'
})
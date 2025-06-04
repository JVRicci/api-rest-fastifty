import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { knex } from '../database'

export function transactionRoutes(app : FastifyInstance) {
    app.get('/', async () => {    
        // const tables = await knex('sqlite_schema').select('*')
        const transaction = await knex('transactions')
            .select('*')

        return { transaction }
    })

    app.get("/:id", async (request) =>{
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const transaction = await knex('transactions')
            .where('id', id)
            .first()
            .select('*')

        return { transaction }
    })

    app.post('/', async (request, reply)=> {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const {title, amount, type} = createTransactionBodySchema.parse(
            request.body
        )

        await knex('transactions')
            .insert({
                id : randomUUID(),
                title,
                amount : type  == 'credit' ? amount : amount * -1,
            })

        return reply.status(201).send()
    })
    
}
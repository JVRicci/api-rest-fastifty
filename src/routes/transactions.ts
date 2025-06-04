import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export function transactionRoutes(app : FastifyInstance) {
    app.get('/',
        {
            preHandler: [checkSessionIdExists]
        },
        async ( request, reply ) => {  
        // const tables = await knex('sqlite_schema').select('*')
        const { sessionId } = request.cookies

        const transaction = await knex('transactions')
            .where('session_id', sessionId)
            .select('*')

        return { transaction }
    })

    app.get("/:id",
        {
            preHandler: [checkSessionIdExists]
        },
        async (request) =>{
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const { sessionId } = request.cookies

        const transaction = await knex('transactions')
            .where({
                session_id: sessionId,
                id
            })
            .first()

        return { transaction }
    })

    app.get('/summary',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request) => {

        const { session_id } = request.cookies
        
        // É possivel adcionar alias nas colunas, como é feito no metodo sum
        const summary = await knex('transactions')
            .sum('amount', { as : 'amount'})
            .first()
        
        return { summary }
    })

    app.post('/',
        async (request, reply)=> {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const {title, amount, type} = createTransactionBodySchema.parse(
            request.body
        )

        // Declara o cookie, e caso não exista, cria um para atribuir
        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('sessionId', sessionId, {
                path: '/',
                // Indica que o cooki dura 7 dias.
                //  60 = 1seg, 60 = 1 hora, 24 horas, 7 dias
                maxAge: 60 * 60 * 24 * 7 // 7 dias
            })
        }

        await knex('transactions')
            .insert({
                id : randomUUID(),
                title,
                amount : type  == 'credit' ? amount : amount * -1,
                session_id: sessionId
            })

        return reply.status(201).send()
    })
    
}
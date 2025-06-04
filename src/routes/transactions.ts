import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export function transactionRoutes(app : FastifyInstance) {
    // Retorna todas as transações
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

            return reply.status(200).send({ transaction }) 
    })

    // Pesquisa pelo id
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

    // Faz soma de todos os valores das transações
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

    // Cria nova transação
    app.post('/',
        async (request, reply)=> {
        // Cria um z object para tratamento das informaçoes do request, 
        // e faz com que apenas dois tipos de transação sejam aceitas
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        // Faz a verificação da requisição
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
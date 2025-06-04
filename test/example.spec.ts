import { expect, test, it, beforeAll, afterAll, beforeEach, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { title } from 'process'

describe('Transaction routes', () => {
    // Faz com que todos os plugins e metodos do app, sejam carregados antes dos testes
    beforeAll( async ()=>{
        await app.ready()
    })
    
    // Finaliza a conexão do app
    afterAll( async () => {
        await app.close()
    })
    
    it.skip('User can create a new transaction', async () => {
        const response = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Transaction Test',
                amount: 5000,
                type: 'credit'
            })
            //  .expect(201)
        
        expect(response.statusCode).toEqual(201)
    })

    it.only('Should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Transaction Test',
                amount: 5000,
                type: 'credit'
            })

        // Salva os cookies da requisição para utilizar na pesquisa
        const cookies  = createTransactionResponse.get('Set-Cookie')

        // Efetua requisição utilizando os cookies para retornar transactions
        const listTransactionResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies ?? []) // Definido um valor padrão, para caso o cookie seja undefined
            .expect(200)

        console.log(listTransactionResponse.body)

        expect(listTransactionResponse.body.transaction).toEqual([
            expect.objectContaining({
                title: 'Transaction Test',
                amount: 5000,
            }),
        ])
    })
})
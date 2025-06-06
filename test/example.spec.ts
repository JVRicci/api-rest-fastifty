import { expect, test, it, beforeAll, afterAll, beforeEach, describe } from 'vitest'
import { execSync } from 'node:child_process'
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
    
    // Para cada teste, ele vai executar as migrations, pois sem fazer isso, 
    // o banco de teste não atualiza, e é necessário q ue por padrão ele sempre esteja resetado
    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
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

    it.skip('Should be able to list all transactions', async () => {
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

        // console.log(listTransactionResponse.body)

        expect(listTransactionResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'Transaction Test',
                amount: 5000,
            }),
        ])
    })

    it.skip('should to be able to get an especific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title : 'New Transaction Test',
                amount : 650,
                type : 'debit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')
        
        const listTransactionResponse = await request(app.server)
            .get('/transactions/')
            .set('Cookie', cookies ?? [])
            .expect(200)

        const transactionId = listTransactionResponse.body.transactions[0].id

        const getTransactionResponse = await request( app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies ?? [])
            .expect(200)

        console.log(getTransactionResponse.body)
        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title : 'New Transaction Test',
                amount : -650,
            })
        )
    })

    it.only('Should be able to get the summary', async () => {

        const createFirstTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title : 'First transaction',
                amount : 1000,
                type : 'debit' 
            })

        const cookies = createFirstTransactionResponse.get('Set-Cookie')

        const createSecondTransactionResponse = await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies ?? [])
            .send({
                title : 'Second transaction',
                amount : 500,
                type : 'credit' 
            })
        
        const summaryResponse = request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies ?? [])
            .expect(200)

        expect( (await summaryResponse).body.summary ).toEqual(
            expect.objectContaining({
                amount : 500
            })
        )
        
    })
})
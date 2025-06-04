import { expect, test, it, beforeAll, afterAll, beforeEach, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transaction routes', () => {
    // Faz com que todos os plugins e metodos do app, sejam carregados antes dos testes
    beforeAll( async ()=>{
        await app.ready()
    })
    
    // Finaliza a conexão do app
    afterAll( async () => {
        await app.close()
    })
    
    it('User can create a new transaction', async () => {
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
})
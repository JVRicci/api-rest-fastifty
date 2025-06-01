import fastify from 'fastify'
import { knex } from './database'

const port = 3333

const app = fastify()

app.get('/hello', async () => {
  // const tables = await knex('sqlite_schema').select('*')

  // const transaction = await knex('transactions').insert({
  //   id : crypto.randomUUID(),
  //   title : 'Transação de teste',
  //   amount : 1000,
  // }).returning('*')

  return await knex('transactions')
    .where('amount', 1000)
    .select('*')
})

app.listen({
  port,
}).then(() => {
  console.log(`Server is running on port ${port}`)
})

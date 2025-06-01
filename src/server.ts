import fastify from 'fastify'

const port = 3333

const app  = fastify()

app.get('/hello',()=>{
    return 'hello world'
})

app.listen({
    port
}).then(() => {
    console.log(`Server is running on port ${port}`)
})
import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex' 

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL não foi encontrado")
}

const configurations: { [key: string]: Knex.Config } = {
    development: {
        client: process.env.DATABASE_CLIENT,
        connection: {
            filename: process.env.DATABASE_URL,
        },
        // Faz com que todos os valores do banco por padrão sejam nulos
        useNullAsDefault: true,
        migrations: {
            extension: "ts",
            directory: process.env.MIGRATIONS_URL,
        }
    }
};

const environment = process.env.NODE_ENV || 'development';
const config = configurations[environment];

export default config;
export const knex = setupKnex (config)
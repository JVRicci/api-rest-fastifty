import { knex as setupKnex, Knex } from 'knex' 
import { env } from './env';

const config:  Knex.Config  = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === 'sqlite' ? {
        filename : env.DATABASE_URL
    } : env.DATABASE_URL,
    // Faz com que todos os valores do banco por padrão sejam nulos
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: env.MIGRATIONS_URL,
    }

};

export default config;
export const knex = setupKnex (config)
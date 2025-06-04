// eslint-disable-next-line
import { Knex } from 'knex'

// O modulo irá sobescrever a as Tables do Knex q por padrão é uma interface vazia. 
// Cada interface do modulo, será uma tabela da aplicação
declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string,
            title: string,
            amount: number,
            created_at: string
            session_id?: string
        }
    }
}

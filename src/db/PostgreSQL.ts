import { config } from 'dotenv';
import { Pool } from 'pg';

config();

export class PostgreSQL {
    private static instance: PostgreSQL;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            host: process.env.host,
            port: process.env.port,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database
        });
    }

    public static getInstance(): PostgreSQL {
        if (!PostgreSQL.instance) {
            PostgreSQL.instance = new PostgreSQL();
        }
        return PostgreSQL.instance;
       
    }

    async getData(query: string, params?: any[]): Promise<any> {
        const result = await this.pool.query(query, params);
        return result.rows;
    }

    async addData(query: string, params?: any[]): Promise<boolean> {
        let ok = false;
        try {
            // const result = await this.pool.query(query, params);
            // result.rowCount;
            await this.pool.query(query, params);
            ok = true;
        } catch (error) {
            console.log('addData [error] => ', error);
            ok = false;
        }
        return ok;
    }

    // async connect(): Promise<void> {
    //     try {
    //         await this.client.connect();
    //         console.log('Connected to the database');
    //     } catch (err) {
    //         console.error('Error while connecting to database ===> ', err);
    //     }
    // }

    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------

    // async insertData(
    //     table: string,
    //     columns: string,
    //     values: string,
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     data: any[]
    // ): Promise<void> {
    //     try {
    //         const text = `INSERT INTO public.\"${table}\"(${columns}) VALUES(${values});`;
    //         const res = await this.client.query(text, data);
    //         console.log(res.rowCount + ' row(s) added');
    //     } catch (err) {
    //         console.error('Error while inserting data', err);
    //     } finally {
    //         console.log('finally insert');
    //         this.client.end();
    //     }
    // }

    // async selectData(
    //     table: string,
    //     columns: string,
    //     condition: string,
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     data: any[]
    // ): Promise<void> {
    //     try {
    //         const text = `SELECT * FROM public.\"${table}\" `;
    //         console.log('text => ', text);
    //         console.log('data => ', data);
    //         const res = await this.client
    //             .query(text)
    //             .then((res) => res.rows)
    //             .catch((err) => console.log('Error masimo => ', err));
    //     } catch (err: any) {
    //         console.error('Error selecting data', err.toString());
    //     } finally {
    //         console.log('finally select');
    //         this.client.end();
    //     }
    // }
}

//
// postgreSQL
//     .connect()
//     .then(() => {
//         postgreSQL.insertData(
//             'tabla',
//             'columna1, columna2, columna3',
//             '$1, $2, $3',
//             ['valor1', 'valor2', 'valor3']
//         );
//         return postgreSQL.selectData(
//             'tabla',
//             'columna1, columna2, columna3',
//             'WHERE columna1 = $1',
//             ['valor1']
//         );
//     })
//     .catch((err) => console.error('Error en la aplicación', err));

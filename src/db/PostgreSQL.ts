import { config } from 'dotenv';
import { Pool } from 'pg';
import { requireEnv } from '../utils';

config();

export class PostgreSQL {
    private static instance: PostgreSQL;
    private pool: Pool;

    private host = requireEnv('host');
    private port = Number(requireEnv('port'));
    private user = requireEnv('user');
    private password = requireEnv('password');
    private database = requireEnv('database');

    private constructor() {
        this.pool = new Pool({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database,
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
        try {
            await this.pool.query(query, params);
            return true;
        } catch (error) {
            console.log('addData [error] =>', error);
            return false;
        }
    }
}

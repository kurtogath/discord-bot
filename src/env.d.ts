declare global {
    namespace NodeJS {
        interface ProcessEnv {
            host: string;
            port: number;
            user: string;
            password: string;
            database: string;
        }
    }
}

export { };


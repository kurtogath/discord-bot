declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            BOT_ID: number;
            TWITCH_LINK: string;
            TWITCH_CLIENT_ID: string;
            TWITCH_CLIENT_SECRET: string;
            TWITCH_USER_ID: string;
            USER_ACCES_TOKEN: string;
            host: string;
            port: number;
            user: string;
            password: string;
            database: string;
        }
    }
}

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            BOT_ID: number;
            TWITCH_LINK: string;
            TWITCH_CLIENT_ID: string;
            TWITCH_CLIENT_SECRET: string;
            TWITCH_USER_ID: string;
            TWITCH_ACCESS_TOKEN: string;
            TWITCH_API_URL: string;
            USER_ACCES_TOKEN: string;
            host: string;
            port: number;
            user: string;
            password: string;
            database: string;
            DISCORD_CANAL_EN_DIRECTO:string;
            DISCORD_CANAL_BIENVENIDA:string;
        }
    }
}

export { };


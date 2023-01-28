declare global {
    namespace NodeJS {
        interface  ProcessEnv{
            TOKEN:string
            BOT_ID:number
            TWITCH_LINK:string
        }
    }
}

export { }


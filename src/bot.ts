import { Client, ClientOptions, GatewayIntentBits, Message } from 'discord.js';
import { config } from 'dotenv';
import { EMOJIS } from './utils';
config();

const token = process.env.TOKEN;

const clientParams: ClientOptions = {
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
};

const client: Client = new Client(clientParams);

client.on('ready', () => {
    console.log(`Bot Online!`);
});

client.on('messageCreate', async (message: Message) => {
    //Do something with the message
    //TODO: Limit chanels to use maybe
    const contentMessage: string = message.content;
    
    if (message.author.bot) {
        return;
    }

    if (contentMessage.startsWith(`!`)) {
        //If the message it's a command
        switch (contentMessage) {
            case '!twitch':
                const urlTwitch: string = process.env.TWITCH_LINK;
                message.channel.send(
                    `Aqui tienes el link de los directos del panita ${urlTwitch} ${EMOJIS.KurtoLove}  ${EMOJIS.PeepoLove}`
                );
                break;
            default:
                break;
        }
    }
});

client.login(token);

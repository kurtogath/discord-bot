import { Client, ClientOptions, GatewayIntentBits, Message } from 'discord.js';
import { config } from 'dotenv';
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
    const idBot: string = process.env.BOT_ID ? process.env.BOT_ID : '';
    if (message.author.id === idBot) {
        return;
    }

    if (contentMessage.startsWith(`!`)) {
        //If the message it's a command
        
    }
});

client.login(process.env.TOKEN);

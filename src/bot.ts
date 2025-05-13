import { Client, ClientOptions, GatewayIntentBits, Message } from 'discord.js';
import { config } from 'dotenv';
import { startTwitchIntegration } from './platforms/twitch/TwitchClient';
import { EMOJIS, requireEnv } from './utils';
import { logError } from './utils/logger';

config();

const token = requireEnv('TOKEN');
const TWITCH_API_URL = requireEnv('TWITCH_API_URL');

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

client.on('ready', async () => {
    console.log('BOT ONLINE!!!');

    try {
    } catch (error) {
        await logError('client.on => Ready', error);
        console.error('Error al interactuar con la base de datos:', error);
    }
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    const contentMessage: string = message.content;

    if (contentMessage.startsWith(`!`)) {
        switch (contentMessage) {
            case '!twitch':
                const urlTwitch: string = requireEnv('TWITCH_LINK') ?? '';
                message.channel.send(
                    `Aqui tienes el link de los directos del panita ${EMOJIS.KurtoLove}  ${EMOJIS.PeepoLove} ${urlTwitch}`
                );
                break;
            case '!status':
                try {
                    const { getValidAccessToken } = await import(
                        './platforms/twitch/tokenManager'
                    );
                    const accessToken = await getValidAccessToken();
                    const clientId = requireEnv('TWITCH_CLIENT_ID');

                    const res = await fetch(TWITCH_API_URL, {
                        headers: {
                            'Client-ID': clientId,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    const data = await res.json();

                    if (res.ok && data.data?.length > 0) {
                        const subs = data.data
                            .filter((s: any) => s.type === 'stream.online')
                            .map((s: any) => `🟢 ${s.type} (ID: ${s.id})`)
                            .join('\n');

                        message.channel.send(
                            `📡 **Suscripciones activas:**\n${subs}`
                        );
                    } else {
                        message.channel.send(
                            '⚠️ No hay suscripciones activas detectadas.'
                        );
                    }
                } catch (error) {
                    await logError('!status command', error);
                    message.channel.send(
                        '❌ Error al consultar el estado. Revisa los logs.'
                    );
                }
                break;

            default:
                break;
        }
    }
});

client.login(token);

startTwitchIntegration(client);

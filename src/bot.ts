import {
    Client,
    ClientOptions,
    GatewayIntentBits,
    Message,
    Partials,
} from 'discord.js';
import { config } from 'dotenv';
import { ConfigKeys } from './enums/config';
import { handleGuildMemberAdd } from './events/onGuildMemberAdd';
import {
    registerReactionRoleHandlers,
    setupReactionRoles,
} from './events/reactionRoles';
import { startTwitchIntegration } from './platforms/twitch/TwitchClient';
import { EMOJIS } from './utils';
import { getConfigData } from './utils/getConfig';
import { logError } from './utils/logger';

config();

async function displayCommand(contentMessage:string, message: Message){
    const TWITCH_API_URL = await getConfigData(ConfigKeys.TWITCH_API_URL) 
    
    switch (contentMessage) {
        case '!twitch':
            const urlTwitch: string = await getConfigData(ConfigKeys.TWITCH_LINK);
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
                const clientId = await getConfigData(ConfigKeys.TWITCH_CLIENT_ID);

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

async function startBot() {
    try {
        const token = await getConfigData(ConfigKeys.TOKEN);

        const clientParams: ClientOptions = {
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
            ],
            partials: [
                Partials.Message,
                Partials.Channel,
                Partials.Reaction,
                Partials.GuildMember,
                Partials.User,
            ],
        };

        const client: Client = new Client(clientParams);


        
        client.on('ready', async () => {
            try {
                console.log('BOT ONLINE!!!');
            } catch (error) {
                await logError('client.on => Ready', error);
                console.error('Error al interactuar con la base de datos:', error);
            }
        });

        client.on('messageCreate', async (message: Message) => {
            if (message.author.bot) return;

            const contentMessage: string = message.content;

            
            if (contentMessage.startsWith(`!`)) {
                await displayCommand(contentMessage, message)                
            }
        });

        //Mensaje bienvendia y asignamos rol
        client.on('guildMemberAdd', (member) => {
            handleGuildMemberAdd(member, client);
        });

        client.once('ready', async () => {
            await setupReactionRoles(client);
            registerReactionRoleHandlers(client);
        });

        await client.login(token);

        client.login(token);

        startTwitchIntegration(client);

    } catch (error) {
        logError('startBot', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

startBot();
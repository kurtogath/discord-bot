import { Client as DiscordClient } from 'discord.js';
import WebSocket from 'ws';
import { PostgreSQL } from '../../db/PostgreSQL';
import { MessageType } from '../../enums';
import { ConfigKeys } from '../../enums/config';
import { SocketWelcomeMessage } from '../../types';
import { EMOJIS } from '../../utils';
import { getTextChannelSafe } from '../../utils/discord';
import { getConfigData } from '../../utils/getConfig';
import { clearTwitchSubscriptions } from './clearTwitchSubscriptions';
import { subscribeToTwitchEvents } from './subscribe';

const postgreSQL = PostgreSQL.getInstance();

async function sendLiveMessage(discordClient: DiscordClient) {
    const urlTwitch: string = await getConfigData(ConfigKeys.TWITCH_LINK);

    const canalId = await getConfigData(ConfigKeys.DISCORD_CANAL_EN_DIRECTO);
    const EN_VIVO = await getTextChannelSafe(discordClient, canalId);

    if (EN_VIVO) {
        EN_VIVO.send(
            `${EMOJIS.KurtoLink} Tu streamer favorito está en directo! ${EMOJIS.KurtoLove} ${EMOJIS.PeepoLove} ${urlTwitch}`
        );
    } else {
        console.error(
            '[Twitch] EN_VIVO es undefined. No se pudo enviar el mensaje en el canal DISCORD_CANAL_EN_DIRECTO.'
        );
    }
}

export function startTwitchIntegration(discordClient: DiscordClient) {
    const twitchSocket = new WebSocket('wss://eventsub.wss.twitch.tv/ws');

    twitchSocket.on('open', () => {
        console.log('[Twitch] Conectado a WebSocket');
    });

    twitchSocket.on('message', async (message: WebSocket.Data) => {
        const buffer = Buffer.from(message as ArrayBuffer);
        const messageAsString = buffer.toString();
        const messageAsObject: SocketWelcomeMessage =
            JSON.parse(messageAsString);

        //Obtenemos notificacion del socket de Twitch
        if (
            messageAsObject.metadata?.message_type === MessageType.Notificacion
        ) {
            await sendLiveMessage(discordClient);
        }

        if (
            messageAsObject.metadata?.message_type ===
            MessageType.SessionWelcome
        ) {
            const sessionId = messageAsObject.payload?.session?.id ?? '';

            try {
                await postgreSQL.addData(
                    `INSERT INTO "Session"("Id") VALUES($1) ON CONFLICT DO NOTHING`,
                    [sessionId]
                );

                const session = await postgreSQL.getData(
                    `SELECT * FROM "Session" WHERE "Id" = $1`,
                    [sessionId]
                );

                console.log('[Twitch] Sesión registrada:', session);
                //Limpiamos todas las subscripciones cuando se inicia el bot
                await clearTwitchSubscriptions();
                //Creamos la susbcripcion cuando se inicia el bot
                const twitchUserId = await getConfigData(ConfigKeys.TWITCH_USER_ID);
                await subscribeToTwitchEvents(sessionId, twitchUserId);
            } catch (error) {
                console.error(
                    '[Twitch] Error al registrar sesión o suscribirse:',
                    error
                );
            }
        }
    });

    twitchSocket.on('error', (error) => {
        console.error('[Twitch] WebSocket Error:', error);
    });

    twitchSocket.on('close', (code, reason) => {
        console.log(`[Twitch] Conexión cerrada: ${code} - ${reason}`);
    });
}

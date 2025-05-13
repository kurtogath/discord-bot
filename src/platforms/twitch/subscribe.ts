import axios from 'axios';
import { requireEnv } from '../../utils';
import { logError } from '../../utils/logger';
import { getAccessToken } from './getAccessToken';

const TWITCH_API_URL = requireEnv('TWITCH_API_URL');

//Suscribe to socket
export async function subscribeToTwitchEvents(
    sessionId: string,
    broadcasterId: string
) {
    const accessToken = await getAccessToken();
    const clientId = requireEnv('TWITCH_CLIENT_ID');

    try {
        const response = await axios.post(
            TWITCH_API_URL,
            {
                type: 'stream.online',
                version: '1',
                condition: { broadcaster_user_id: broadcasterId },
                transport: {
                    method: 'websocket',
                    session_id: sessionId,
                },
            },
            {
                headers: {
                    'Client-ID': clientId,
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('[Twitch] Suscripción creada:', response.data);
    } catch (error: any) {
        await logError('subscribeToTwitchEvents', error);
        console.error(
            '[Twitch] Error al suscribirse:',
            error?.response?.data || error.message
        );
    }
}

import axios from 'axios';
import { ConfigKeys } from '../../enums/config';
import { getConfigData } from '../../utils/getConfig';
import { logError } from '../../utils/logger';
import { getAccessToken } from './getAccessToken';


//Suscribe to socket
export async function subscribeToTwitchEvents(
    sessionId: string,
    broadcasterId: string
) {
    const accessToken = await getAccessToken();
    const TWITCH_API_URL = await getConfigData(ConfigKeys.TWITCH_API_URL);
    const clientId = await getConfigData(ConfigKeys.TWITCH_CLIENT_ID);

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

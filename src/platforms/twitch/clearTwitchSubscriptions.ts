import axios from 'axios';
import { ConfigKeys } from '../../enums/config';
import { getConfigData } from '../../utils/getConfig';
import { getValidAccessToken } from './tokenManager';


export async function clearTwitchSubscriptions() {
    
    const accessToken = await getValidAccessToken();
    const TWITCH_API_URL = await getConfigData(ConfigKeys.TWITCH_API_URL)
    const clientId = await getConfigData(ConfigKeys.TWITCH_CLIENT_ID);

    // Obtener todas las suscripciones activas
    const subsResponse = await axios.get(TWITCH_API_URL, {
        headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const subs = subsResponse.data.data;

    if (subs.length === 0) {
        console.log('[Twitch] No hay suscripciones previas para eliminar.');
        return;
    }

    // Borrar cada suscripción por ID
    for (const sub of subs) {
        await axios.delete(TWITCH_API_URL, {
            headers: {
                'Client-ID': clientId,
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                id: sub.id,
            },
        });
        console.log(`[Twitch] Eliminada suscripción con ID: ${sub.id}`);
    }
}

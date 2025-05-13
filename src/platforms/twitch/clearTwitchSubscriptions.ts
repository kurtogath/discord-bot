
import axios from 'axios';
import { requireEnv } from '../../utils';
import { getValidAccessToken } from './tokenManager';

const TWITCH_API_URL = requireEnv('TWITCH_API_URL');

export async function clearTwitchSubscriptions() {
    const accessToken = await getValidAccessToken();
    const clientId = requireEnv('TWITCH_CLIENT_ID');

    // Obtener todas las suscripciones activas
    const subsResponse = await axios.get(TWITCH_API_URL, {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
        }
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
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                id: sub.id
            }
        });
        console.log(`[Twitch] Eliminada suscripción con ID: ${sub.id}`);
    }
}

import axios from 'axios';
import { PostgreSQL } from '../../db/PostgreSQL';
import { ConfigKeys } from '../../enums/config';
import { getConfigData } from '../../utils/getConfig';

const postgreSQL = PostgreSQL.getInstance();

interface TokenData {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

async function getTokenFromDb(
    broadcasterId: string
): Promise<TokenData | null> {
    const result = await postgreSQL.getData(
        'SELECT "AccessToken", "RefreshToken", "ExpiresAt" FROM "TwitchToken" WHERE "BroadcasterId" = $1',
        [broadcasterId]
    );

    if (!result || result.length === 0) return null;

    return {
        access_token: result[0].AccessToken,
        refresh_token: result[0].RefreshToken,
        expires_at: Number(result[0].ExpiresAt),
    };
}

async function saveTokenToDb(broadcasterId: string, token: TokenData) {
    await postgreSQL.addData(
        `INSERT INTO "TwitchToken" ("BroadcasterId", "AccessToken", "RefreshToken", "ExpiresAt")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("BroadcasterId") DO UPDATE
         SET "AccessToken" = EXCLUDED."AccessToken",
             "RefreshToken" = EXCLUDED."RefreshToken",
             "ExpiresAt" = EXCLUDED."ExpiresAt"`,
        [
            broadcasterId,
            token.access_token,
            token.refresh_token,
            token.expires_at,
        ]
    );
}

async function refreshTokens(refresh_token: string): Promise<TokenData> {
    const clientId = await getConfigData(ConfigKeys.TWITCH_CLIENT_ID);
    const clientSecret = await getConfigData(ConfigKeys.TWITCH_CLIENT_SECRET);
    const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'refresh_token',
                refresh_token,
            },
        }
    );

    const expires_in = response.data.expires_in * 1000;
    const expires_at = Date.now() + expires_in;

    return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_at,
    };
}

export async function getValidAccessToken(): Promise<string> {
    const broadcasterId = await getConfigData(ConfigKeys.TWITCH_USER_ID);

    const existing = await getTokenFromDb(broadcasterId);

    if (existing && Date.now() < existing.expires_at) {
        return existing.access_token;
    }

    if (existing?.refresh_token) {
        const newTokens = await refreshTokens(existing.refresh_token);
        await saveTokenToDb(broadcasterId, newTokens);
        return newTokens.access_token;
    }

    throw new Error(
        'No hay tokens válidos ni refresh_token en la base de datos.'
    );
}

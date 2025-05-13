import { Client, TextChannel } from 'discord.js';
import { logError } from './logger';

/**
 * Intenta obtener un canal de texto desde cache o haciendo fetch.
 */
export async function getTextChannelSafe(
    client: Client,
    channelId: string
): Promise<TextChannel | null> {
    try {
        let channel = client.channels.cache.get(channelId) ?? null;

        if (!channel) {
            channel = await client.channels.fetch(channelId);
        }

        if (channel?.isTextBased()) {
            return channel as TextChannel;
        }

        return null;
    } catch (error) {
        await logError('getTextChannelSafe', error);
        return null;
    }
}

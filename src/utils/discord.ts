import { Client, GuildMember, TextChannel } from 'discord.js';
import { requireEnv } from './env';
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

export async function addRole(
    member: GuildMember,
    client: Client
): Promise<boolean> {
    try {
        //Obtenemos los datos
        const roleId = requireEnv("DISCORD_ROL_USER")
        const guildId = requireEnv("DISCORD_GUILD_ID")
        
        const guild = await client.guilds.fetch(guildId);
        const roles = await guild.roles.fetch(); // trae todos los roles
        const role = roles?.find((r) => r.id === roleId);
        
        if (role) {
            await member.roles.add(role);
            console.log(`Rol '${role.name}' asignado a ${member.user.tag}`);
            return true
        }
        await logError('getRoleSafe', `No se ha podido asignar el rol a ${member.user.tag}`);
        return false
    } catch (error) {
        await logError('getRoleSafe', error);
        return false;
    }
}


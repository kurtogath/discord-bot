import { Client, GuildMember } from 'discord.js';
import { requireEnv } from '../utils';
import { addRole, getTextChannelSafe } from '../utils/discord';
import { logError } from '../utils/logger';
import { sendWelcomeImage } from '../utils/sendWelcomeImage';



export const handleGuildMemberAdd = async (member: GuildMember, discordClient:Client) => {
    try {

        // const canalId = requireEnv('DISCORD_CANAL_BIENVENIDA');
        const canalId = requireEnv('DISCORD_CANAL_BIENVENIDA');
        const channel = await getTextChannelSafe(discordClient, canalId);

        if (channel) {

            await sendWelcomeImage(member, channel);
            
            //Añadimos el rol
            await addRole(member,discordClient)
            return true
        }
        await logError('handleGuildMemberAdd', 'Error al enviar el mensaje de bienvendia')

        return false
    } catch (error) {
        await logError('handleGuildMemberAdd', error);
        console.error('Error en handleGuildMemberAdd:', error);
    }
};

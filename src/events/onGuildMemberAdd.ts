import { Client, GuildMember } from 'discord.js';
import { ConfigKeys } from '../enums/config';
import { addRole, getTextChannelSafe } from '../utils/discord';
import { getConfigData } from '../utils/getConfig';
import { logError } from '../utils/logger';
import { sendWelcomeImage } from '../utils/sendWelcomeImage';

export const handleGuildMemberAdd = async (
    member: GuildMember,
    discordClient: Client
) => {
    try {
        const canalId = await getConfigData(ConfigKeys.DISCORD_CANAL_TEST)
        // const canalId = await getConfigData(ConfigKeys.DISCORD_CANAL_BIENVENIDA)
        const channel = await getTextChannelSafe(discordClient, canalId);

        if (channel) {
            await sendWelcomeImage(member, channel);

            //Añadimos el rol
            await addRole(member, discordClient);
            return true;
        }
        await logError(
            'handleGuildMemberAdd',
            'Error al enviar el mensaje de bienvendia'
        );

        return false;
    } catch (error) {
        await logError('handleGuildMemberAdd', error);
        console.error('Error en handleGuildMemberAdd:', error);
    }
};

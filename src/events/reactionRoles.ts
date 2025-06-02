import {
    Client,
    MessageReaction,
    PartialMessageReaction,
    PartialUser,
    User
} from 'discord.js';
import { ConfigKeys } from '../enums/config';
import { addRolesMessageId, getRoles, getRolesByGuild } from '../utils/database/roles';
import { getTextChannelSafe } from '../utils/discord';
import { getConfigData } from '../utils/getConfig';

// Define los emojis y los roles que asignan
const reactionRoleMap: Record<string, string> = {
    '🎮': 'Gamer',
    '🎨': 'Artista',
    '🎵': 'Música',
    '🇪🇸': 'España',
    '🌎': 'Latinoamérica',
};


export async function setupReactionRoles(client: Client) {
    const canalId = await getConfigData(ConfigKeys.DISCORD_CANAL_ROLES);
    const channel = await getTextChannelSafe(client, canalId);
    if (channel) {
        const guildId = channel.guild.id;
        const roles = await getRoles(guildId)
        if(roles.length === 0 || roles[0].message_id !== '')  return null;
        const messageText = `Reacciona para recibir un rol:\n${roles
            .map((r: any) => `${r.role_name}`)
            .join('\n')}`;

        const message = await channel.send(messageText);
        addRolesMessageId(message);
        

        for (const emoji of Object.keys(reactionRoleMap)) {
            await message.react(emoji);
        }
    }
}

async function checkEmoji(reaction : MessageReaction | PartialMessageReaction , user:  User | PartialUser){
    const resp = false
    if (user.bot) return resp;
    const guildId = reaction.message.guild?.id;
    //Si no se encueentra la guild, pasamos
    if (!guildId) return resp;
    const roles = await getRoles(guildId)
    // Si no es el mensaje de roles, ignorar
    if(roles.length === 0 || roles[0].message_id === '')  return resp;
    const allowedEmojis = new Set(roles.map((r) => r.emoji));
    const emoji = reaction.emoji.name;
    // Eliminar la reacción si no está en la lista permitida
    if (!allowedEmojis.has(emoji)) {
        await reaction.users.remove(user.id);
        return resp;
    }
    return true
}   


// Handler de reacciones
export function registerReactionRoleHandlers(client: Client) {
    client.on('messageReactionAdd', async (reaction, user) => {        
        const checked = await checkEmoji(reaction,user);
        if(!checked) return;
        await handleReaction(reaction, user, true);
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        const checked = await checkEmoji(reaction,user);
        if(!checked) return;
        await handleReaction(reaction, user, false);
    });
}

async function handleReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    add: boolean
) {
    // Ignorar si no es el mensaje objetivo
    const reactionRoleMessage = await getRolesByGuild(reaction)
    const reactionRoleMessageId = reactionRoleMessage[0].message_id
    if (reaction.message.id !== reactionRoleMessageId || user.bot) return;
    
    const guild = reaction.message.guild;
    if (!guild) return;
    
    const member = await guild.members.fetch(user.id);
    
    const roles = await guild.roles.fetch();
    if (!roles) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const roleSelected = await getRoles(guild.id ,reaction.emoji.name!)
    const roleSelected2 = roleSelected[0]
    const role = roles?.find((r) => {
        return r.name === roleSelected2.role_name
        
    });
    
    if (!role) return;

    if (add) {
        await member.roles.add(role);
        console.log(`Asignado rol ${role.name} a ${user.tag}`);
    } else {
        await member.roles.remove(role);
        console.log(`Removido rol ${role.name} a ${user.tag}`);
    }
}

import { Message, MessageReaction, PartialMessageReaction } from 'discord.js';
import { PostgreSQL } from '../../db/PostgreSQL';
import { logError } from '../logger';

const postgreSQL = PostgreSQL.getInstance();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getRoles(guildId:string, emoji?: string): Promise<any[]> {
    try {
        let result;

        //Si nos pasan un emoji, buscamos ese rol
        //Si no recibimos el emoji, buscamos todos los roles de ese server
        if (emoji) {
            result = await postgreSQL.getData(
                'SELECT * FROM reaction_roles WHERE emoji = $1 AND guild_id = $2',
                [emoji, guildId]
            );

            if (!result || result.length === 0) {
                logError('getRoles', `No se encontró un rol para el emoji ${emoji}`);
                return [];
            }

            return result;
        } else {
            result = await postgreSQL.getData('SELECT * FROM reaction_roles WHERE guild_id = $1', [guildId]);

            if (!result || result.length === 0) {
                logError('getRoles', 'No hay roles disponibles para la guild en la base de datos');
                return [];
            }

            return result
        }
    } catch (err) {
        logError('getRoles', `Error al obtener roles: ${String(err)}`);
        throw new Error('No se pudieron obtener los roles de la base de datos. En GetRoles');
    }
}

export async function addRolesMessageId(message:Message) {
    try {
        
        await postgreSQL.addData(
            `UPDATE reaction_roles
             SET message_id = ($1)
             WHERE guild_id = $2;`,
            [message.id, message.guildId]
        );
          

       
    } catch (err) {
        logError('addRolesMessageId', `Error al obtener roles: ${String(err)}`);
        throw new Error('No se pudo añadir el message id');
    }
}

export async function getRolesByGuild(reaction:MessageReaction | PartialMessageReaction) {
    try {
        const guild = reaction.message.guild?.id;
        
        const result = await postgreSQL.getData(
            `SELECT *
            FROM reaction_roles
            WHERE guild_id = $1;`,
            [guild]
        );
          
        if (!result || result.length === 0) return null;

        return result

       
    } catch (err) {
        logError('getRoleMessageId', `Error al obtener roles: ${String(err)}`);
        throw new Error('No se pudieron obtener los roles de la base de datos. Error en la Id de la guild');
    }
}


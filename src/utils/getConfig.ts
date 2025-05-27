import { PostgreSQL } from '../db/PostgreSQL';
import { logError } from './logger';

const postgreSQL = PostgreSQL.getInstance();

async function getTokenFromDb(key: string): Promise<string> {
    const result = await postgreSQL.getData(
        'SELECT valor FROM configuracion WHERE clave = $1',
        [key]
    );

    if (!result || result.length === 0) {
        logError('GetConfig', `No se han podido obtener los datos para ${key}`);
        return '';
    }

    return result[0].valor;
}

export async function getConfigData(key: string): Promise<string> {
    const token = await getTokenFromDb(key);

    if (token) {
        return token;
    }

    logError('getToken', `No se ha podido obtener los datos de configuración `);

    throw new Error(
        'No hay tokens válidos ni refresh_token en la base de datos.'
    );
}

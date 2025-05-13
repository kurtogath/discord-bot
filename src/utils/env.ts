import { logError } from './logger';

export function requireEnv(key: keyof NodeJS.ProcessEnv): string {
    const value = process.env[key];
    if (!value) {
        const error = new Error(`Missing environment variable: ${key}`);
        logError('requireEnv', error).catch(console.error);
        throw error;
    }
    return value;
}

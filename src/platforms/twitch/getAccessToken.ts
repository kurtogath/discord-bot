import { getValidAccessToken } from './tokenManager';

export async function getAccessToken(): Promise<string> {
    return getValidAccessToken();
}

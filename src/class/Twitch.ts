import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import WebSocket from 'ws';
import { SocketSubscription } from '../types';

config();

export class Twitch {
    private clientId: string;
    private clientSecret: string;
    private token: string;
    private userId: string;

    private webSocket: WebSocket;
    private sessionId: string;

    constructor(url: string) {
        this.clientId = process.env.TWITCH_CLIENT_ID!;
        this.clientSecret = process.env.TWITCH_CLIENT_SECRET!;
        this.token = process.env.USER_ACCES_TOKEN!;
        this.userId = process.env.TWITCH_USER_ID!;

        this.webSocket = new WebSocket(url);
        this.sessionId = '';
    }

    public on(event: string, callback: (data: any) => void): void {
        this.webSocket.on(event, callback);
    }

    public emit(event: string, data: any): void {
        this.webSocket.send(JSON.stringify({ event, data }));
    }

    public async subscribeToEvents(sessionId: string): Promise<void> {
        this.sessionId = sessionId;

        const response: AxiosResponse<SocketSubscription> = await axios.post(
            'https://api.twitch.tv/helix/eventsub/subscriptions',
            {
                type: 'stream.online',
                version: '1',
                condition: {
                    broadcaster_user_id: this.userId
                },
                transport: {
                    method: 'websocket',
                    session_id: sessionId
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Client-Id': this.clientId,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Twitch subscription response:', response.data);
    }
}

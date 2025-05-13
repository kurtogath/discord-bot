import { MessageType } from '../enums';

export interface GetToken {
    acces_token: string;
    expires_in: number;
    token_type: string;
}

export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: 'staff' | 'admin' | 'global_mod' | 'moderator' | '';
    broadcaster_type: 'partner' | 'affiliate' | 'viewer';
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
}

export interface SocketWelcomeMessage {
    metadata: {
        message_id: string;
        message_type: MessageType;
        message_timestamp: string;
        subscription_type?: string;
        subscription_version?: string;
    };
    payload?: {
        session?: {
            id: string;
            status: string;
            connected_at: string;
            keepalive_timeout_seconds: number;
            reconnect_url: string;
        };
        subscription?: {
            id: string;
            status: string;
            type: string;
            version: string;
            cost: string;
            condition: number;
            transport?: {
                method: string;
                session_id: string;
            };
            created_at?: string;
        };
        event?: number;
    };
}

export interface SocketSubscription {
    data: [
        {
            id: string;
            status: string;
            type: string;
            version: string;
            condition: {
                broadcaster_user_id: string;
            };
            created_at: string;
            transport: {
                method: string;
                session_id: string;
                connected_at: string;
            };
            cost: number;
        }
    ];
    total: number;
    max_total_cost: number;
    total_cost: number;
}

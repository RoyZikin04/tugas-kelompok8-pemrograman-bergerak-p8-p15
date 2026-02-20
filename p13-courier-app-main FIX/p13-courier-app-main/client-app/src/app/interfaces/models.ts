export interface User {
    id: number;
    name: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
    error?: string;
}

export interface Delivery {
    id?: number;
    user_id: number;
    no_resi: string;
    customer_name: string;
    photo_path: string; // Base64
    latitude: number;
    longitude: number;
    status?: string;
    created_at?: string;
}
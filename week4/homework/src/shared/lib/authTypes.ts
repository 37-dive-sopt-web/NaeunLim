export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    userId: number;
    message: string;
}

export interface ErrorResponse {
    success: false;
    code: string;
    message: string;
}
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}

export function success<T>(data: T): ServiceResponse<T> {
    return { data, error: null, success: true };
}

export function error<T = null>(message: string): ServiceResponse<T> {
    console.error(`[Service Error]: ${message}`);
    return { data: null, error: message, success: false };
}

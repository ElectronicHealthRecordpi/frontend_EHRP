import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    PatientInfo,
} from '../types/auth.types';

const API_BASE = 'http://localhost:3000/api';

async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
    }
    return data as T;
}

export async function loginApi(body: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return handleResponse<LoginResponse>(res);
}

export async function registerApi(body: RegisterRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return handleResponse<void>(res);
}

export async function verifyCiApi(ci: string): Promise<PatientInfo> {
    const res = await fetch(`${API_BASE}/auth/verify-ci`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ci }),
    });
    return handleResponse<PatientInfo>(res);
}

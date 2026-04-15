export interface LoginRequest {
    userName: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    password: string;
    ci: string;
}

export interface LoginResponse {
    access_token: string;
}

export interface JwtPayload {
    sub: string;
    userName: string;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
    iat: number;
    exp: number;
}

export interface PatientInfo {
    id: string;
    name: string;
    lastName: string;
    age: number;
    ci: string;
    phone: string;
    genderId: number;
    bloodTypeId: number;
    latitude: number | null;
    longitude: number | null;
    isDeleted: boolean;
    createdAt: string;
    gender: { id: number; name: string };
    bloodType: { id: number; name: string };
}

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

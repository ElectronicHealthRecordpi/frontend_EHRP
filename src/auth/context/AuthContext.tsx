import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload, UserRole } from '../types/auth.types';

interface AuthState {
    token: string | null;
    userName: string | null;
    role: UserRole | null;
    patientId: string | null;
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

const TOKEN_KEY = 'ehr_token';

function decodeToken(token: string): Omit<AuthState, 'isAuthenticated'> {
    try {
        const payload = jwtDecode<JwtPayload>(token);
        if (payload.exp * 1000 < Date.now()) {
            return { token: null, userName: null, role: null, patientId: null };
        }
        return {
            token,
            userName: payload.userName,
            role: payload.role,
            patientId: payload.sub,
        };
    } catch {
        return { token: null, userName: null, role: null, patientId: null };
    }
}

function getInitialState(): AuthState {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return { token: null, userName: null, role: null, patientId: null, isAuthenticated: false };

    const decoded = decodeToken(stored);
    if (!decoded.token) {
        localStorage.removeItem(TOKEN_KEY);
        return { token: null, userName: null, role: null, patientId: null, isAuthenticated: false };
    }
    return { ...decoded, isAuthenticated: true };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>(getInitialState);

    const login = useCallback((token: string) => {
        const decoded = decodeToken(token);
        if (!decoded.token) return;
        localStorage.setItem(TOKEN_KEY, token);
        setState({ ...decoded, isAuthenticated: true });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState({ token: null, userName: null, role: null, patientId: null, isAuthenticated: false });
    }, []);

    useEffect(() => {
        if (!state.token) return;
        try {
            const payload = jwtDecode<JwtPayload>(state.token);
            const msUntilExpiry = payload.exp * 1000 - Date.now();
            if (msUntilExpiry <= 0) {
                logout();
                return;
            }
            const timer = setTimeout(logout, msUntilExpiry);
            return () => clearTimeout(timer);
        } catch {
            logout();
        }
    }, [state.token, logout]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

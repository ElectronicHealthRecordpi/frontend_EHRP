import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../auth/context/AuthContext';
import type { UserRole } from '../../auth/types/auth.types';

export function PublicRoute() {
    const { isAuthenticated, role } = useAuth();

    if (isAuthenticated && role) {
        const redirectMap: Record<UserRole, string> = {
            DOCTOR: '/doctor/home',
            PATIENT: '/patient',
            ADMIN: '/admin',
        };
        return <Navigate to={redirectMap[role]} replace />;
    }

    return <Outlet />;
}

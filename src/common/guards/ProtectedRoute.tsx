import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../auth/context/AuthContext';
import type { UserRole } from '../../auth/types/auth.types';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        const redirectMap: Record<UserRole, string> = {
            DOCTOR: '/doctor/home',
            PATIENT: '/patient',
            ADMIN: '/admin',
        };
        return <Navigate to={redirectMap[role] ?? '/auth/login'} replace />;
    }

    return <Outlet />;
}

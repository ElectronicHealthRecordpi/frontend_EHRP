import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/authApi';
import { Loader2 } from 'lucide-react';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!userName.trim() || !password.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            const { access_token } = await loginApi({ userName: userName.trim(), password });
            login(access_token);

            const payload = JSON.parse(atob(access_token.split('.')[1]));
            const role: string = payload.role;

            const redirectMap: Record<string, string> = {
                DOCTOR: '/doctor/home',
                PATIENT: '/patient',
                ADMIN: '/admin',
            };
            navigate(redirectMap[role] ?? '/auth/login', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <h1 className="text-xl font-semibold text-gray-900 text-center">
                Iniciar Sesión
            </h1>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nombre de usuario
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    placeholder="usuario"
                    disabled={loading}
                    autoComplete="username"
                />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="current-password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Iniciar Sesión
            </button>

            <p className="text-center text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <Link to="/auth/register" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    Regístrate
                </Link>
            </p>
        </form>
    );
}

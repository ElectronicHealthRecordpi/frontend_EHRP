import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { verifyCiApi, registerApi } from '../services/authApi';
import type { PatientInfo } from '../types/auth.types';
import { Loader2, ArrowLeft, ArrowRight, MapPin, User, Phone, Droplets, CheckCircle2 } from 'lucide-react';
import { MapPreview } from '../components/MapPreview';

const BLOOD_TYPE_LABELS: Record<string, string> = {
    A_POSITIVE: 'A+', A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+', B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+', AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+', O_NEGATIVE: 'O-',
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [ci, setCi] = useState('');
    const [patient, setPatient] = useState<PatientInfo | null>(null);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleVerifyCi = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedCi = ci.trim();
        if (!trimmedCi) {
            setError('Por favor, ingresa tu carnet de identidad.');
            return;
        }

        if (!/^[0-9]{5,10}[A-Za-z]{0,2}$/.test(trimmedCi)) {
            setError('CI inválido. Debe tener entre 5 y 10 dígitos, opcionalmente seguido de hasta 2 letras.');
            return;
        }

        setLoading(true);
        try {
            const data = await verifyCiApi(trimmedCi);
            setPatient(data);
            setStep(2);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se encontró un paciente con ese CI');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedUser = userName.trim();
        if (!trimmedUser) {
            setError('El nombre de usuario es obligatorio.');
            return;
        }

        if (password.length < 8 || password.length > 20) {
            setError('La contraseña debe tener entre 8 y 20 caracteres.');
            return;
        }

        if (!PASSWORD_REGEX.test(password)) {
            setError('La contraseña debe contener al menos una mayúscula, una minúscula y un número.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await registerApi({ userName: trimmedUser, password, ci: ci.trim() });
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrar la cuenta');
        } finally {
            setLoading(false);
        }
    };

    const stepIndicator = (
        <div className="flex items-center justify-center gap-2 mb-5">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= s
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {s}
                    </div>
                    {s < 3 && (
                        <div className={`w-8 h-0.5 ${step > s ? 'bg-emerald-600' : 'bg-gray-200'} transition-colors`} />
                    )}
                </div>
            ))}
        </div>
    );

    if (success) {
        return (
            <div className="space-y-5 text-center">
                <div className="flex justify-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">¡Cuenta creada!</h1>
                <p className="text-sm text-gray-600">
                    Tu cuenta ha sido registrada exitosamente. Ya puedes iniciar sesión.
                </p>
                <Link
                    to="/auth/login"
                    className="inline-block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors text-center"
                >
                    Iniciar Sesión
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 text-center">
                Crear Cuenta
            </h1>

            {stepIndicator}

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Step 1: CI */}
            {step === 1 && (
                <form className="space-y-4" onSubmit={handleVerifyCi}>
                    <p className="text-sm text-gray-500 text-center">
                        Ingresa tu carnet de identidad para verificar tus datos.
                    </p>
                    <div className="space-y-1.5">
                        <label htmlFor="ci" className="block text-sm font-medium text-gray-700">
                            Carnet de Identidad (CI)
                        </label>
                        <input
                            type="text"
                            id="ci"
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            placeholder="Ej: 12345678"
                            disabled={loading}
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        Siguiente
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/auth/login" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                            Iniciar Sesión
                        </Link>
                    </p>
                </form>
            )}

            {/* Step 2: Patient info */}
            {step === 2 && patient && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 text-center">
                        Confirma que estos son tus datos.
                    </p>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-gray-500">Nombre:</span>
                            <span className="font-medium text-gray-900 capitalize">{patient.name} {patient.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="h-4 w-4 text-gray-400 shrink-0 text-center text-xs font-bold">CI</span>
                            <span className="text-gray-500">CI:</span>
                            <span className="font-medium text-gray-900">{patient.ci}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-gray-500">Teléfono:</span>
                            <span className="font-medium text-gray-900">{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Edad:</span>
                            <span className="font-medium text-gray-900">{patient.age} años</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Género:</span>
                            <span className="font-medium text-gray-900 capitalize">{patient.gender.name.toLowerCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Droplets className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-gray-500">Tipo de sangre:</span>
                            <span className="font-medium text-gray-900">
                                {BLOOD_TYPE_LABELS[patient.bloodType.name] ?? patient.bloodType.name}
                            </span>
                        </div>
                        {patient.latitude && patient.longitude && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                                    <span className="text-gray-500">Ubicación:</span>
                                    <span className="font-medium text-gray-900 text-xs">
                                        {Number(patient.latitude).toFixed(4)}, {Number(patient.longitude).toFixed(4)}
                                    </span>
                                </div>
                                <MapPreview
                                    latitude={Number(patient.latitude)}
                                    longitude={Number(patient.longitude)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(''); }}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Atrás
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep(3); setError(''); }}
                            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Credentials */}
            {step === 3 && (
                <form className="space-y-4" onSubmit={handleRegister}>
                    <p className="text-sm text-gray-500 text-center">
                        Crea tus credenciales de acceso.
                    </p>

                    <div className="space-y-1.5">
                        <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700">
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            id="reg-username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            placeholder="Ej: usuario123"
                            disabled={loading}
                            autoComplete="username"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="reg-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            placeholder="••••••••"
                            disabled={loading}
                            autoComplete="new-password"
                        />
                        <p className="text-xs text-gray-400">
                            8-20 caracteres. Al menos una mayúscula, una minúscula y un número.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            id="reg-confirm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            placeholder="••••••••"
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => { setStep(2); setError(''); }}
                            disabled={loading}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Atrás
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Registrarse
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

import React from 'react'

export const Login = () => {
    return (
        <form className="space-y-5">
            <h1 className="text-xl font-semibold text-gray-900 text-center">
                Iniciar Sesión
            </h1>

            <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nombre de usuario
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    placeholder="usuario"
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
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer"
            >
                Iniciar Sesión
            </button>
        </form>
    )
}

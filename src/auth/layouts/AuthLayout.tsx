import logo from '../../assets/logo/sedes.png'
import { Outlet } from 'react-router'

export const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="flex flex-col md:flex-row w-full max-w-md md:max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-center bg-gray-50 py-8 md:py-0 md:px-10 border-b md:border-b-0 md:border-r border-gray-200">
                    <img
                        className="h-20 md:h-32 w-auto object-contain"
                        src={logo}
                        alt="Logo SEDES"
                    />
                </div>
                <div className="flex-1 px-6 py-8 md:px-8 md:py-10">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
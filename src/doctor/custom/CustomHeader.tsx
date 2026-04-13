import logo from '@/assets/logo/sedes.png'
import { NavLink, useNavigate } from 'react-router'
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Menu, User } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
    { to: '/doctor/home', label: 'Inicio' },
    { to: '/doctor/patients', label: 'Pacientes' },
    { to: '/doctor/citas', label: 'Citas' },
]

export const CustomHeader = () => {
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => {
        navigate('/auth/login')
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">

                {/* Logo */}
                <NavLink to="/doctor/home" className="shrink-0">
                    <img src={logo} alt="Sedes Logo" className="h-14 w-auto" />
                </NavLink>

                {/* Nav links — desktop */}
                <nav className="hidden md:flex items-center gap-0.5">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-1">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setMobileOpen(prev => !prev)}
                        className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                        aria-label="Abrir menú"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Avatar + dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 outline-none hover:bg-gray-50 transition-colors focus-visible:ring-1 focus-visible:ring-emerald-500 cursor-pointer">
                                <div className="hidden md:flex flex-col items-end leading-tight">
                                    <span className="text-sm font-medium text-gray-900">Dr. Pepe Mujica</span>
                                    <span className="text-xs text-gray-400">Médico General</span>
                                </div>
                                <Avatar size="default">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Dr. Pepe Mujica" />
                                    <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-semibold">PM</AvatarFallback>
                                    <AvatarBadge className="bg-emerald-500" />
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-gray-900">Mi cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => navigate('/doctor/profile')} className="cursor-pointer text-gray-700 focus:bg-emerald-50 focus:text-emerald-700">
                                    <User className="mr-2 h-4 w-4" />
                                    Mi perfil
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>

            {/* Mobile nav panel */}
            {mobileOpen && (
                <nav className="md:hidden border-t border-gray-200 bg-white px-4 py-2 space-y-1">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            )}
        </header>
    )
}

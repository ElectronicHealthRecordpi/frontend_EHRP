import { createBrowserRouter, Navigate } from "react-router";
import { AuthLayout } from "../auth/layouts/AuthLayout";
import { Login } from "../auth/views/Login";
import { Register } from "../auth/views/Register";
import { DoctorLayout } from "../doctor/layout/DoctorLayout";
import { DoctorHome } from "../doctor/views/DoctorHome";
import { ProtectedRoute } from "../common/guards/ProtectedRoute";
import { PublicRoute } from "../common/guards/PublicRoute";

export const appRouter = createBrowserRouter([
    {
        path: "/auth",
        element: <PublicRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "login",
                        element: <Login />
                    },
                    {
                        path: "register",
                        element: <Register />
                    }
                ]
            }
        ]
    },
    {
        path: "/doctor",
        element: <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />,
        children: [
            {
                element: <DoctorLayout />,
                children: [
                    {
                        path: "home",
                        element: <h1>home</h1>
                    },
                    {
                        path: "patients",
                        element: <h1 className="bg-yellow-100">Patients</h1>
                    },
                    {
                        path: "citas",
                        element: <DoctorHome />
                    },
                    {
                        path: "profile",
                        element: <h1 className="bg-yellow-100">Profile</h1>
                    }
                ]
            }
        ]
    },
    {
        path: "/patient",
        element: <ProtectedRoute allowedRoles={['PATIENT']} />,
        children: [
            {
                index: true,
                element: <h1 className="bg-yellow-100">Patient Home</h1>
            }
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
            {
                index: true,
                element: <h1 className="bg-yellow-100">Admin Home</h1>
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/auth/login" replace />
    }
])
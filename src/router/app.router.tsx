import { createBrowserRouter } from "react-router";
import { AuthLayout } from "../auth/layouts/AuthLayout";
import { Login } from "../auth/views/Login";
import { DoctorLayout } from "../doctor/layout/DoctorLayout";
import { DoctorHome } from "../doctor/views/DoctorHome";
export const appRouter = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <h1 className="bg-yellow-100">Register</h1>
            }

        ]
    },
    {
        path: "/doctor",
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
    },
    {
        path: "/patient",
        element: <h1 className="bg-yellow-100">Home</h1>
    },
    {
        path: "/admin",
        element: <h1 className="bg-yellow-100">Home</h1>
    }

])
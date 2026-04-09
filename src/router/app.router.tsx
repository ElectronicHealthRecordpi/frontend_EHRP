import { createBrowserRouter } from "react-router";
import { AuthLayout } from "../auth/layouts/AuthLayout";
import { Login } from "../auth/views/Login";
import { DoctorLayout } from "../doctor/layout/DoctorLayout";
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
                element: <h1 className="bg-yellow-100">Home</h1>
            },
            {
                path: "patients",
                element: <h1 className="bg-yellow-100">Patients</h1>
            },
            {
                path: "appointments",
                element: <h1 className="bg-yellow-100">Appointments</h1>
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
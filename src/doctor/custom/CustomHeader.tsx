import React from 'react'
import { Link } from 'react-router'

export const CustomHeader = () => {
    return (
        <header className='bg-gray-100 p-4'>
            <ul className='flex flex-row gap-4'>
                <li><Link to="/doctor/home">Home</Link></li>
                <li><Link to="/doctor/patients">Patients</Link></li>
                <li><Link to="/doctor/appointments">Appointments</Link></li>
                <li><Link to="/doctor/profile">Profile</Link></li>
            </ul>


        </header>
    )
}

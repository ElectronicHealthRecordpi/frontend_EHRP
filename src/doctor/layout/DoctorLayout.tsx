import { CustomHeader } from "../custom/CustomHeader"
import { Outlet } from 'react-router';

export const DoctorLayout = () => {
    return (
        <div>
            <CustomHeader />
            <Outlet />
        </div>
    )
}

import MainAdmNavbar from "@/Components/MainAdmNavbar";
import { FC, ReactNode } from "react";
import { ModalEditUserProvider, useUserEditModal } from '@/Components/user-modals-edit/EditUserContext';
import EditUserModal from '@/Components/user-modals-edit/EditUserModal';


export const AdmMain: FC<{ children: ReactNode }> = ({ children }) => {

    return (


        <>
            <ModalEditUserProvider>
                <MainAdmNavbar />
                {children}
                <EditUserModal />
            </ModalEditUserProvider>

        </>


    )
}
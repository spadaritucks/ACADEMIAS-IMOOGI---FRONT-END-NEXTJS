import ClientMainNavbar from "@/Components/ClientMainNavbar";
import { FC, ReactNode } from "react";
import { ModalEditUserProvider, useUserEditModal } from '@/Components/user-modals-edit/EditUserContext';
import EditUserModal from '@/Components/user-modals-edit/EditUserModal';


export const ClientMain: FC<{ children: ReactNode }> = ({ children }) => {

    return (


        <>
            <ModalEditUserProvider>
                <ClientMainNavbar />
                {children}
                <EditUserModal />
            </ModalEditUserProvider>

        </>
    )
}
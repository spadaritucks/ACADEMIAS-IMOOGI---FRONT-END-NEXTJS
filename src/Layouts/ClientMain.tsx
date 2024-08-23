import ClientMainNavbar from "@/Components/ClientMainNavbar";
import { FC, ReactNode } from "react";


export const ClientMain: FC<{ children: ReactNode }> = ({ children }) => {

    return (


        <>
            <ClientMainNavbar />
            {children}
        </>
    )
}
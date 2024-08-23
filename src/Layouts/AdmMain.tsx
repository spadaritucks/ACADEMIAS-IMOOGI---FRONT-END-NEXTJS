import MainAdmNavbar from "@/Components/MainAdmNavbar";
import { FC, ReactNode } from "react";


export const AdmMain: FC<{ children: ReactNode }> = ({ children }) => {

    return (


        <>
            <MainAdmNavbar />
            {children}
        </>
    )
}
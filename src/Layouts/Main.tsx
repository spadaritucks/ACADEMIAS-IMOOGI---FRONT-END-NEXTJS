import MainNavBar from '@/Components/MainNavbar'
import Footer from '@/Components/Footer'
import { FC, ReactNode } from 'react'




export const Main: FC<{ children: ReactNode }> = ({ children }) => {

    return (
        <>
            <MainNavBar />
            {children}
            <Footer />
        </>

    )
}
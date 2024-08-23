'use client'
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import Logo from '../../public/sistema imoogi.jpeg'
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import '@/Assets/css/components-styles/DefaultNav.css'
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function MainNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu começa fechado
    


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Alterna entre aberto e fechado
    };


    return (
        <>

            <nav className='navbar-style'>
                <Link href='/'><Image width={192} height={63} className="nav-bar-logo" src={Logo} alt="Imoogi" /></Link>

                <div className={`nav-itens ${isMenuOpen ? 'open' : ''}`}>
                    <div className="nav-link-routes">
                        <Link href='/unidades'>Unidades</Link>
                        <Link href='/modalidade'>Modalidades</Link>

                        <NavDropdown title="Colaboradores" id="nav-dropdown" className="nav-dropdown">
                            <NavDropdown.Item ><Link href='/equipe'>Equipe</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link href='/gympass'>Gympass</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link href='/totalpass'>TotalPass</Link></NavDropdown.Item>
                        </NavDropdown>
                    </div>


                    <div className="nav-link-login">
                        <button className='nav-btn-register'><Link href=''>Planos</Link></button>
                        <Link href='login'><LoginIcon sx={{ margin: 0.5, fontSize: 30 }} />Login</Link>
                    </div>


                </div>

                <div className="btn-toogle" onClick={toggleMenu}>
                    <MenuIcon sx={{ fontSize: 45 }} />
                </div>

            </nav>



        </>
    )
}
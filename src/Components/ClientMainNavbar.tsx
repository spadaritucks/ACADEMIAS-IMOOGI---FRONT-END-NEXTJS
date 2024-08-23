import Image from 'next/image'
import UserSession from '@/Components/api/UserSession';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import '@/Assets/css/components-styles/AuthNav.css'
import { useState } from 'react';
import Logo from '../../public/sistema imoogi.jpeg'
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar } from '@chakra-ui/react'


export default function ClientMainNavbar() {
    const { user, setUser } = UserSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);


    const toggleMenu = () => {
        setOpen(!open);
    }

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        router.push('/login'); // Redireciona para a página de login ou outra página desejada após o logout
    };

    let fotoUsuario = user.foto_usuario;
    let nomeUsuario = user.nome;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/storage/${fotoUsuario}`;

    return (
        <>

            <div className="auth-bar">
                <Image width={192} height={63} className="nav-bar-logo" src={Logo} alt="Imoogi" />
                <div className={`authbar-style ${open ? 'open' : ''}`}>
                    <div className='side-link-routes'>
                        <Link href='/dashboard'><div className='side-link'><DashboardIcon />Dashboard</div></Link>
                        <Link href='/planos'><div className='side-link'><AccountBoxIcon />Planos e Contratos</div></Link>
                        <Link href='modalidades'><div className='side-link'><SportsMartialArtsIcon />Modalidades</div></Link>
                        <Link href='/unidade'> <div className='side-link'><LocationOnIcon />Unidades</div></Link>
                        <Link href='/usuarios'> <div className='side-link'><NoteAltIcon />Cadastro de Usuarios</div></Link>

                    </div>

                    <div className='users-info'>
                        <p className='session-name'><Avatar src={`${url}`} sx={{ margin: 2 }} />{nomeUsuario}</p>
                        <p className='session-name' onClick={handleLogout}><LogoutIcon sx={{ margin: 0.5, fontSize: 30, cursor: 'pointer' }}></LogoutIcon>Logout</p>
                    </div>
                </div>



                <div className="btn-hamburguer" onClick={toggleMenu}>
                    <MenuIcon sx={{ fontSize: 45 }} />
                </div>
            </div>




        </>
    )
}

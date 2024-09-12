import Image from 'next/image'
import UserSession from '@/Components/api/UserSession';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import '@/Assets/css/components-styles/AuthNav.css'
import { useRef, useState } from 'react';
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
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useModal } from './errors/errorContext';
import { useUserEditModal } from './user-modals-edit/EditUserContext';
import { updatePassword } from './api/UsuariosRequest';

interface userForms {

    handleUpdatePassword?: (e: React.FormEvent<HTMLFormElement>) => void;
    modalPassword?: () => void
    formref?: React.RefObject<HTMLFormElement>

}


export default function MainAdmNavbar() {
    const { user, setUser } = UserSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { modalServer } = useModal();
    const { showModal } = useUserEditModal();


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

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)

            const responsePassword = await updatePassword(user.id, formdata)
            if (responsePassword) {
                if (responsePassword.status === 'false') {
                    modalServer('Mensagem', responsePassword.message); // Aqui você acessa apenas a mensagem

                } else {
                    modalServer('Mensagem', responsePassword.message); // Aqui também


                }
            }
        }

    }

    

    const modalPassword = () => {
        showModal('Alterar Senha', <PasswordForm handleUpdatePassword={handleUpdatePassword} formref={formRef} />)
    }

    const handleUserArea = () => {
        showModal('Usuario', <UserModal handleUpdatePassword={handleUpdatePassword} formref={formRef} modalPassword={modalPassword} />)
    }


    let fotoUsuario = user.foto_usuario;
    let nomeCompleto = user.nome;
    let partesNome = nomeCompleto.split(' ')
    let nome = partesNome.slice(0,2).join(' ')

    const url = `${process.env.NEXT_PUBLIC_API_URL}/storage/${fotoUsuario}`;

    return (
        <>

            <div className="auth-bar">
                <Image width={192} height={63} className="nav-bar-logo" src={Logo} alt="Imoogi" />
                <div className={`authbar-style ${open ? 'open' : ''}`}>
                    <div className='side-link-routes'>
                        <Link href='/dashboard'><div className='side-link'><DashboardIcon />Dashboard</div></Link>
                        <Link href='/planos'><div className='side-link'><AccountBoxIcon />Planos e Contratos</div></Link>
                        <Link href='/modalidades'><div className='side-link'><SportsMartialArtsIcon />Modalidades</div></Link>
                        <Link href='/unidade'> <div className='side-link'><LocationOnIcon />Unidades</div></Link>
                        <Link href='/usuarios'> <div className='side-link'><NoteAltIcon />Cadastro de Usuarios</div></Link>
                        <Link href='/aulas'> <div className='side-link'><NoteAltIcon />Aulas</div></Link>

                    </div>

                    <div className='users-info' >
                        <p className='session-name' onClick={() => handleUserArea()}><Avatar src={`${url}`} sx={{ margin: 2 }} />{nome}</p>
                        <p className='logout' onClick={handleLogout}><LogoutIcon sx={{ margin: 0.5, fontSize: 30, cursor: 'pointer' }}></LogoutIcon>Logout</p>
                    </div>
                </div>



                <div className="btn-hamburguer" onClick={toggleMenu}>
                {!open ?  <MenuIcon sx={{ fontSize: 45 }}  /> :<CloseSharpIcon sx={{ fontSize: 45 }} />}
                </div>
            </div>




        </>
    )
}


export const UserModal: React.FC<userForms> = ({ handleUpdatePassword, formref, modalPassword }) => {

    return (

        <div className='user-menu'>
            {modalPassword ? <button className='btn-password' onClick={() => modalPassword()} >Alterar senha</button> : ""}
        </div>
    )
}

export const PasswordForm: React.FC<userForms> = ({ handleUpdatePassword, formref }) => {

    return (
        <form onSubmit={handleUpdatePassword} ref={formref} className='crud-form' >
            <div className="form-name-input">
                <span>Senha Anterior</span>
                <input type="password" name="password_anterior" id='password_anterior' />
            </div>
            <div className="form-name-input">
                <span>Nova Senha</span>
                <input type="password" name="password" id='password' />
            </div>
            <div className="form-name-input">
                <span>Confirme sua Senha</span>
                <input type="password" name="password_confirmation" id='password_confirmation' />
            </div>

            <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                <button type='submit' className='submit-button'>Enviar</button>
            </div>
        </form>
    )
}

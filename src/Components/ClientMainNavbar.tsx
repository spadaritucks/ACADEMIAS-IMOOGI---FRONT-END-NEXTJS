import Image from 'next/image'
import UserSession from '@/Components/api/UserSession';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import '@/Assets/css/components-styles/AuthNav.css'
import { ReactNode, useEffect, useRef, useState } from 'react';
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
import { updatePassword, updateUserClient, Usuario } from './api/UsuariosRequest';
import { useModal } from '@/Components/errors/errorContext';
import { useUserEditModal } from './user-modals-edit/EditUserContext';
import "@/Assets/css/pages-styles/forms.css"

interface userForms {

    handleUpdateSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    handleUpdatePassword?: (e: React.FormEvent<HTMLFormElement>) => void;
    modalPassword?: () => void
    userModal?: () => void
    formref?: React.RefObject<HTMLFormElement>
    formRefPassword? :React.RefObject<HTMLFormElement>
    user?: Usuario
}


export default function ClientMainNavbar() {
    const { user, setUser } = UserSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const formRefPassword = useRef<HTMLFormElement>(null);
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

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            
            const formdata = new FormData(formRef.current)
            formdata.append('_method', 'PUT')
           
                
                const response = await updateUserClient(user.id, formdata)
                if (response) {
                    if (response === 'false') {
                        modalServer('Mensagem', response.message); // Aqui você acessa apenas a mensagem
    
                    } else {
                        modalServer('Mensagem', response.message); // Aqui também
    
    
                    }
                }
            else{
                modalServer('Erro', 'Confirme corretamente a sua senha')
            }
           
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRefPassword.current) {
            const formdata = new FormData(formRefPassword.current)
            formdata.append('_method', 'PUT')
            
            if(formdata.get('password') === formdata.get('password_confirmation')){
                formdata.delete('password_confirmation');
                const responsePassword = await updatePassword(user.id, formdata)
                console.log(formdata)
                if (responsePassword) {
                    if (responsePassword.status === 'false') {
                        modalServer('Mensagem', responsePassword.message); // Aqui você acessa apenas a mensagem
    
                    } else {
                        modalServer('Mensagem', responsePassword.message); // Aqui também
    
    
                    }
                }
            }
          
        }

    }

    const userModal = () => {
        showModal('Editar Usuario', <UserDadosForm formref={formRef} handleUpdateSubmit={handleUpdateSubmit} user={user} />)
    }

    const modalPassword = () => {
        showModal('Alterar Senha', <PasswordForm handleUpdatePassword={handleUpdatePassword} formRefPassword={formRefPassword} />)
    }

    const handleUserArea = () => {
        showModal('Usuario', <UserModal handleUpdatePassword={handleUpdatePassword} formref={formRef} modalPassword={modalPassword} userModal={userModal} />)
    }






    let fotoUsuario = user.foto_usuario;
    let nomeCompleto = user.nome;
    let partesNome = nomeCompleto.split(' ')
    let nome = partesNome.slice(0, 2).join(' ')

    const url = `${process.env.NEXT_PUBLIC_API_URL}/storage/${fotoUsuario}`;
    return (
        <>

            <div className="auth-bar">
                <Image width={192} height={63} className="nav-bar-logo" src={Logo} alt="Imoogi" />
                <div className={`authbar-style ${open ? 'open' : ''}`}>
                    <div className='side-link-routes'>
                        <Link href='/area_aluno'><div className='side-link'><DashboardIcon />Menu</div></Link>
                        <Link href='/carteira'><div className='side-link'><AccountBoxIcon />Carteira</div></Link>
                        <Link href='/grade'><div className='side-link'><SportsMartialArtsIcon />Reservar Aula</div></Link>

                    </div>

                    <div className='users-info' >
                        <p className='session-name' onClick={() => handleUserArea()}><Avatar src={`${url}`} sx={{ margin: 2 }} />{nome}</p>
                        <p className='logout' onClick={handleLogout}><LogoutIcon sx={{ margin: 0.5, fontSize: 30, cursor: 'pointer' }}></LogoutIcon>Logout</p>
                    </div>
                </div>





                <div className="btn-hamburguer" onClick={toggleMenu}>
                    {!open ? <MenuIcon sx={{ fontSize: 45 }} /> : <CloseSharpIcon sx={{ fontSize: 45 }} />}
                </div>
            </div>




        </>
    )
}

export const UserModal: React.FC<userForms> = ({ handleUpdatePassword, handleUpdateSubmit, formref, modalPassword, userModal }) => {

    return (

        <div className='user-menu'>
            {userModal ? <button className='btn-userDados' onClick={() => userModal()}> Editar Dados Pessoais</button> : ""}
            {modalPassword ? <button className='btn-password' onClick={() => modalPassword()} >Alterar senha</button> : ""}
        </div>
    )
}

export const PasswordForm: React.FC<userForms> = ({ handleUpdatePassword, formRefPassword }) => {

    return (
        <form onSubmit={handleUpdatePassword} ref={formRefPassword} className='crud-form' >
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

export const UserDadosForm: React.FC<userForms> = ({ handleUpdateSubmit, formref, user }) => {

    

    const handleInputClick = () => {
        if (user && formref?.current) {
            const form = formref.current;
            (form['nome'] as HTMLInputElement).value = user.nome.toString();
            (form['email'] as HTMLInputElement).value = user.email.toString();
            (form['data_nascimento'] as HTMLInputElement).value = user.data_nascimento.toString();
            (form['cpf'] as HTMLInputElement).value = user.cpf.toString();
            (form['rg'] as HTMLInputElement).value = user.rg.toString();
            (form['telefone'] as HTMLInputElement).value = user.telefone.toString();
            (form['cep'] as HTMLInputElement).value = user.cep.toString();
            (form['logradouro'] as HTMLInputElement).value = user.logradouro.toString();
            (form['numero'] as HTMLInputElement).value = user.numero.toString();
            user.complemento ? (form['complemento'] as HTMLInputElement).value = user.complemento.toString() : ''
          

        }
    }

    useEffect(() => {
        handleInputClick();
    }, [user])




    return (
        <form onSubmit={handleUpdateSubmit} ref={formref} className='crud-form' >
            <div className="form-name-input">
                <span>Foto do Usuario</span>
                <input type="file" name="foto_usuario" id='foto_usuario' />
            </div>
            <div className="form-name-input">
                <span>Nome Completo</span>
                <input type="text" name='nome' id="nome" placeholder="Nome Completo" />
            </div>
            <div className="form-name-input">
                <span>Email</span>
                <input type="text" name='email' id="email" placeholder="Email" />
            </div>
            <div className="form-name-input">
                <span>Data de Nascimento</span>
                <input type="date" name='data_nascimento' id="data_nascimento" />
            </div>
            <div className="form-name-input">
                <span>CPF</span>
                <input type="text" name='cpf' id="cpf" placeholder="CPF" />
            </div>
            <div className="form-name-input">
                <span>RG</span>
                <input type="text" name='rg' id="rg" placeholder="RG" />
            </div>
            <div className="form-name-input">
                <span>Telefone</span>
                <input type="text" name='telefone' id="telefone" placeholder="Telefone" />
            </div>
            <div className="form-name-input">
                <span>CEP</span>
                <input type="text" name='cep' id="cep" placeholder="CEP" />
            </div>
            <div className="form-name-input">
                <span>Logradouro</span>
                <input type="text" name='logradouro' id="logradouro" placeholder="Logradouro" />
            </div>
            <div className="form-name-input">
                <span>Numero da Residencia</span>
                <input type="text" name='numero' id="numero" placeholder="Numero da Residencia" />
            </div>
            <div className="form-name-input">
                <span>Complemento (Opcional)</span>
                <input type="text" name='complemento' id="complemento" placeholder="Complemento" />
            </div>

            <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                <button type='submit' className='submit-button'>Enviar</button>
            </div>
        </form>
    )
}





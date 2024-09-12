'use client'
import { use, useEffect, useRef, useState } from 'react'
import '../../Assets/css/pages-styles/forms.css'
import { loginUser } from '@/Components/api/UsuariosRequest';
import { useModal } from '@/Components/errors/errorContext';
import { redirect, usePathname, useRouter } from 'next/navigation';
import UserSession from '@/Components/api/UserSession';
import { Main } from '@/Layouts/Main';
import { Modal } from 'react-bootstrap';





function login() {



    const { user, setUser } = UserSession();


    const formRef = useRef<HTMLFormElement>(null);
    const { modalServer } = useModal()
    const router = useRouter();


    useEffect(() => {
        if (user) {
            user.tipo_usuario === 'aluno' ? router.push('/area_aluno') : router.push('/dashboard');
        }
    }, [user, router]);



    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault()


        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const doingLogin = async () => {

                const response = await loginUser(formdata)

                if (response) {
                    if (response.status === 'false') {
                        modalServer('Erro', response.message)
                    } else {
                        sessionStorage.setItem('user', JSON.stringify(response.user));
                        modalServer('Sucesso', response.message || 'Usuario Logado com Sucesso')
                        setUser(response.user)
                        response.user.tipo_usuario === 'aluno' ? router.push('/area_aluno') : router.push('/dashboard');
                    }
                }


            }

            doingLogin();
        }
    }

    return (
        <Main>
            <div className="area-form">
                <h2>Login do Usuario</h2>
                <form action="" onSubmit={handleSubmit} ref={formRef}>
                    <div className="form-component-login">
                        <div className="form-name-input">
                            <span>Insira o seu CPF</span>
                            <input type="text" name="cpf" id='cpf' placeholder='CPF' />
                        </div>
                        <div className="form-name-input">
                            <span>Insira sua Senha</span>
                            <input type="password" name="password" id='password' placeholder='Senha' />
                        </div>
                        <button type='submit' className='submit-button'>Enviar</button>
                    </div>
                </form>
            </div>
        </Main>
    )
}

export default login
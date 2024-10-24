'use client'
import { useRef, useState } from 'react';
import '../../../../Assets/css/pages-styles/forms.css'
import { useModal } from '@/Components/errors/errorContext';
import { createUser } from '@/Components/api/UsuariosRequest';
import { Contratos } from './contratos';
import {Funcionario} from './funcionario';
import { Usuarios } from './usuarios';
import { AdmMain } from '@/Layouts/AdmMain';
import UserSession from '@/Components/api/UserSession';



function criarUsuarios() {

    const formRef = useRef<HTMLFormElement>(null);
    const [selectType, setSelectType] = useState<string>('');
    const [showContratos, setShowContratos] = useState<boolean>(false);
    const [showFuncionario, setShowFuncionario] = useState<boolean>(false);
    const [formErrors, setFormErros] = useState<{ [key: string] : string[]}>({})
 





    const { modalServer } = useModal();

    const handleTypeUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectType(value);
        setShowContratos(value === 'aluno');
        setShowFuncionario(value === 'funcionario');

    }


    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            console.log(formData)

            const sendFormData = async () => {
                if (formData.get('password') == formData.get('password_confirmation')) {
                    formData.delete('password_confirmation')

                    const response = await createUser(formData)
                    console.log(response)
                    if (response) {
                        if (response.status === 'false') {
                            if (typeof response.message === 'object') {
                                
                                setFormErros(response.message)
                                modalServer("Erro", 'Preencha os campos necessarios!')
                              
                            } else {
                                modalServer("Erro", response.message)
                            }
                        } else {
                            modalServer("Erro", response.message)
                        }
                    }




                } else {
                    modalServer('Usuario não cadastrado', 'Confirme sua senha corretamente')
                }

            }

            sendFormData()
        }
        // 



    }


    const [inputModalidadeState, setInputModalidadeState] = useState<boolean>(false);
    const toogleInputModalidade = () => {
        setInputModalidadeState(!inputModalidadeState)

    }
    return (
        <AdmMain>
            <div className='area-form'>
                <h2>Registre o Usuario</h2>
                <form action="" className='register-form' onSubmit={handleSubmit} ref={formRef}>

                    <div className="form-component">
                        {<Usuarios handleTypeUserChange={handleTypeUserChange} formErrors={formErrors} />}
                    </div>

                    <div className="form-component">
                        {showContratos && <Contratos formErrors={formErrors} toogleInputModalidade={toogleInputModalidade} setInputModalidadeState={setInputModalidadeState} inputModalidadeState={inputModalidadeState} />}
                        {showFuncionario && <Funcionario formErrors={formErrors}  />}

                    </div>



                    <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                        <button type='submit' className='submit-button'>Enviar</button>
                    </div>
                </form>
              


            </div>

        </AdmMain>
    )

}

export default UserSession(criarUsuarios)


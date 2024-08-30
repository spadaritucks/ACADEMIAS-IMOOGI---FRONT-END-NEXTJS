import { Modalidade } from "@/Components/api/ModalidadesRequest";
import { Contrato, DadosFuncionario, Usuario, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UsuariosProps {
    handleTypeUserChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    formRef?: React.RefObject<HTMLFormElement>
    user?: Usuario
    contrato?: Contrato;
    modalidade?: UsuarioModalidade[];
    funcionario?: DadosFuncionario;
    handleInputClick?: () => void
  
}


export const Usuarios: React.FC<UsuariosProps> = ({ handleInputClick,  user, contrato, modalidade, funcionario, handleTypeUserChange }) => {

    const [passwordInputState,setPasswordInputState] = useState<boolean>(false);

    const displayPasswordInput = () =>{
        setPasswordInputState(!passwordInputState)
    }
   

    useEffect(() => {
        if (user) {
            displayPasswordInput()
        }
        
    }, [user, contrato,modalidade,funcionario]); // Executa sempre que 'user' mudar


    return (
        <>
            <div className="form-name-input">
                <span>Insira sua Foto</span>
                <input type="file" name="foto_usuario" id='foto_usuario' />
            </div>
            <div className="form-name-input">
                <span>Tipo de Usuario</span>
                <select name="tipo_usuario" id="tipo_usuario" onChange={handleTypeUserChange}>
                    <option value="0">Selecione</option>
                    <option value="aluno">Aluno</option>
                    <option value="funcionario">Funcionario</option>
                </select>
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

            <div className= {`form-name-input ${passwordInputState ? 'disabled' : ''}`} >
                <span>Senha</span>
                <input type="password" name='password' id="password" placeholder="Senha" />
            </div>

            <div className={`form-name-input ${passwordInputState ? 'disabled' : ''}`}>
                <span>Confirme sua senha</span>
                <input type="password" name='password_confirmation' id="password_confirmation" placeholder="Confirme a Senha" />
            </div>


        </>
    )
}
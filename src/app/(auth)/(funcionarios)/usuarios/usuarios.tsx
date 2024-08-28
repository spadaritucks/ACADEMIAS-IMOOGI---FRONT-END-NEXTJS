import { Modalidade } from "@/Components/api/ModalidadesRequest";
import { Contrato, DadosFuncionario, Usuario, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { useEffect, useState } from "react";

interface UsuariosProps {
    handleTypeUserChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    formRef?: React.RefObject<HTMLFormElement>
    user?: Usuario
    contrato?: Contrato;
    modalidade?: UsuarioModalidade[];
    funcionario?: DadosFuncionario;
}


export const Usuarios: React.FC<UsuariosProps> = ({ formRef, user, contrato, modalidade, funcionario, handleTypeUserChange }) => {

    const [passwordInputState,setPasswordInputState] = useState<boolean>(false);

    const displayPasswordInput = () =>{
        setPasswordInputState(!passwordInputState)
    }


    const handleInputClick = () => {
        if (user && formRef?.current) {
            const form = formRef.current;
            (form['tipo_usuario'] as HTMLSelectElement).value = user.tipo_usuario.toString();
            (form['nome'] as HTMLInputElement).value = user.nome.toString();
            (form['email'] as HTMLInputElement).value = user.email.toString();
            (form['data_nascimento'] as HTMLInputElement).value = user.data_nascimento.toString();
            (form['cpf'] as HTMLInputElement).value = user.cpf.toString();
            (form['rg'] as HTMLInputElement).value = user.rg.toString();
            (form['telefone'] as HTMLInputElement).value = user.telefone.toString();
            (form['cep'] as HTMLInputElement).value = user.cep.toString();
            (form['logradouro'] as HTMLInputElement).value = user.logradouro.toString();
            (form['numero'] as HTMLInputElement).value = user.numero.toString();
            (form['complemento'] as HTMLInputElement).value = user.complemento.toString();
            if (contrato && modalidade) {
                (form['planos_id'] as HTMLSelectElement).value = contrato.planos_id.toString();
                (form['data_inicio'] as HTMLInputElement).value = contrato.data_inicio.toString();
                (form['data_renovacao'] as HTMLInputElement).value = contrato.data_renovacao.toString();
                (form['data_vencimento'] as HTMLInputElement).value = contrato.data_vencimento.toString();
                (form['valor_plano'] as HTMLInputElement).value = contrato.valor_plano.toString();
                (form['desconto'] as HTMLInputElement).value = contrato.desconto.toString();
                (form['parcelas'] as HTMLInputElement).value = contrato.parcelas.toString();
                (form['observacoes'] as HTMLInputElement).value = contrato.observacoes.toString();
            }
            if (funcionario) {
                (form['tipo_funcionario'] as HTMLSelectElement).value = funcionario.tipo_funcionario.toString();
                (form['cargo'] as HTMLInputElement).value = funcionario.cargo.toString();
                (form['atividades'] as HTMLInputElement).value = funcionario.atividades.toString();
            }

        }
    }

    useEffect(() => {
        if (user) {
            handleInputClick();
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
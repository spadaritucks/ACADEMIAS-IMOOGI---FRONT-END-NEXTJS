'use client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getPlanos, Plano } from '@/Components/api/PlanosRequest';
import { getModalidade, Modalidade } from '@/Components/api/ModalidadesRequest';
import '../../../../Assets/css/pages-styles/forms.css'
import { Contrato, createUser, UsuarioModalidade } from '@/Components/api/UsuariosRequest';
import { useModal } from '@/Components/errors/errorContext';
import { Usuario } from '@/Components/api/UsuariosRequest';

interface UsuariosProps {
    user?: Usuario //---> Verificação se o formulario é de edição
    modalidade?: UsuarioModalidade[];
    contrato?: Contrato;
    handleInputClick?: () => void
    toogleInputModalidade?: () => void
    setInputModalidadeState?: Dispatch<SetStateAction<boolean>>
    inputModalidadeState?: boolean;
}



export const Contratos: React.FC<UsuariosProps> = ({ user, contrato, modalidade, inputModalidadeState, setInputModalidadeState, toogleInputModalidade }) => {
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [inputVisibility, setInputVisibility] = useState<boolean>(false)

    const inputModalidadeVisibility = () => {
        setInputVisibility(!inputVisibility) //Visibilidade do Input das Modalidaddes
    }


    useEffect(() => {
        if (user) {
            inputModalidadeVisibility()
        }
    }, [user, contrato, modalidade])

    useEffect(() => {
        const fetchPlanos = async () => {
            try {
                const planos = await getPlanos();
                setPlanos(planos);
            } catch (error) {
                console.error('Failed to fetch planos:', error);
            }
        };

        const fetchModalidades = async () => {
            try {
                const modalidades = await getModalidade();
                setModalidades(modalidades);
            } catch (error) {
                console.error('Failed to fetch modalidades:', error);
            }
        };

        fetchPlanos();
        fetchModalidades();
    }, []);

    return (

        <>
            <div className="form-name-input">
                <span>Plano</span>
                <select name="planos_id" id="planos_id">
                    {planos.map((plano) => (
                        <option value={plano.id}>
                            {plano.nome_plano}
                        </option>
                    ))}
                </select>
            </div>

            <div className={`form-name-input ${inputVisibility ? `disabled` : ''}`} >
                <span>Modalidade 1</span>
                <select name="modalidade_id[]" id="modalidade_id" disabled = {inputVisibility} >
                    <option value="" >Selecione</option>
                    {modalidades.map((modalidade) => (
                        <option value={modalidade.id}>
                            {modalidade.nome_modalidade}
                        </option>
                    ))}
                </select>
                <button type='reset' className='insertMoreOne' onClick={toogleInputModalidade}>+ 1 Modalidade</button>
            </div>
            <div className={`form-name-input ${inputModalidadeState ? `flex` : 'none'}`}  >
                <span>Modalidade 2</span>
                <select name="modalidade_id[]" id="modalidade_id" disabled = {!inputModalidadeState}>
                    <option value="" disabled>Selecione</option>
                    {modalidades.map((modalidade) => (
                        <option value={modalidade.id}>
                            {modalidade.nome_modalidade}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-name-input">
                <span>Data de Inicio</span>
                <input type="date" name='data_inicio' id="data_inicio" />
            </div><div className="form-name-input">
                <span>Data de Renovação</span>
                <input type="date" name='data_renovacao' id="data_renovacao" />
            </div><div className="form-name-input">
                <span>Data de Vencimento</span>
                <input type="date" name='data_vencimento' id="data_vencimento" />
            </div><div className="form-name-input">
                <span>Valor do Plano</span>
                <input type="text" name='valor_plano' id="valor_plano" />
            </div><div className="form-name-input">
                <span>Desconto (em %)</span>
                <input type="text" name='desconto' id="desconto" />
            </div><div className="form-name-input">
                <span>Parcelas</span>
                <input type="text" name='parcelas' id="parcelas" />
            </div><div className="form-name-input">
                <span>Observações</span>
                <input type="text" name='observacoes' id="observacoes" />
            </div>

        </>


    );
};



'use client';
import { useEffect, useRef, useState } from 'react';
import { getPlanos, Plano } from '@/Components/api/PlanosRequest';
import { getModalidade, Modalidade } from '@/Components/api/ModalidadesRequest';
import '../../../../Assets/css/pages-styles/forms.css'
import { createUser } from '@/Components/api/UsuariosRequest';
import { useModal } from '@/Components/errors/errorContext';
import { Usuario } from '@/Components/api/UsuariosRequest';




export const Contratos = () => {
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [inputModalidadeState, setInputModalidadeState] = useState<boolean>(false)

    const toogleInputModalidade = () => {
        setInputModalidadeState(!inputModalidadeState)
    }

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

            <div className="form-name-input">
                <span>Modalidade 1</span>
                <select name="modalidade_id[]" id="modalidade_id">
                    {modalidades.map((modalidade) => (
                        <option value={modalidade.id}>
                        {modalidade.nome_modalidade}
                    </option>
                    ))}
                </select>
                <button type='reset' className='insertMoreOne' onClick={toogleInputModalidade}>Inserir mais uma Modalidade</button>
            </div>
            <div className= {`form-name-input ${inputModalidadeState ? `flex` : 'none'}`} >
                <span>Modalidade 2</span>
                <select name="modalidade_id[]" id="modalidade_id">
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



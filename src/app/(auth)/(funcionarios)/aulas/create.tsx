'use client'

import { useEffect, useState } from 'react';
import '../../../../Assets/css/pages-styles/forms.css'
import { Plano } from '@/Components/api/PlanosRequest'
import { getModalidade, Modalidade } from '@/Components/api/ModalidadesRequest';

interface createProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
    diasDaSemana?: string[]
}


export default function Create({ handleSubmit, formRef, diasDaSemana }: createProps) {


    const [modalidades, setModalidades] = useState<Modalidade[]>([])

    useEffect(() => {
        const fetchModalidades = async () => {
            const response = await getModalidade();
            setModalidades(response);

        }

        fetchModalidades()
    }, [])

    return (
        <>

            <form action="" className="crud-form" onSubmit={handleSubmit} ref={formRef} >
                <div className="form-name-input">
                    <span>Modalidade Praticada</span>
                    <select name="modalidade_id" id="modalidade_id">
                    <option value="" disabled selected >Selecione</option>
                        {modalidades.map(modalidade => (
                            <option value={modalidade.id}>{modalidade.nome_modalidade}</option>
                        ))}
                    </select>
                </div>
                <div className="form-name-input">
                    <span>Selecione o Dia da Semana</span>
                    <select name="dia_semana" id="dia_semana">
                    <option value="" disabled selected >Selecione</option>
                        {diasDaSemana?.map(dia => (
                            <option value= {dia}>{dia}</option>
                        ))}
                    </select>
                </div>
                <div className="form-name-input">
                    <span>Horario da Aula</span>
                    <input type="time" name="horario" id='horario' />
                </div>
                <div className="form-name-input">
                    <span>Limite de Alunos</span>
                    <input type="text" name="limite_alunos" id='limite_alunos' />
                </div>


                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>

            </form>
        </>
    )
}
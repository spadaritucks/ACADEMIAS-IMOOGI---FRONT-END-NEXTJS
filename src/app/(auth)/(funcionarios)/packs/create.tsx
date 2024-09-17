'use client'

import '../../../../Assets/css/pages-styles/forms.css'
import { Plano } from '@/Components/api/PlanosRequest'

interface createProps{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement> 
}


export default function Create({handleSubmit,formRef}:createProps) {

    return (
        <>
        <h2>Criar Packs</h2>
            <form action="" className="crud-form" onSubmit={handleSubmit} ref={formRef} >
                <div className="form-name-input">
                    <span>Nome do Pack</span>
                    <input type="text" name="nome_plano" id='nome_plano' />
                </div>
                <div className="form-name-input">
                    <span>Duração (em meses)</span>
                    <input type="text" name="duracao" id='duracao' />
                </div>
                <div className="form-name-input">
                    <span>Valor da Matricula</span>
                    <input type="text" name="valor_matricula" id='valor_matricula' />
                </div>
                <div className="form-name-input">
                    <span>Valor Mensal</span>
                    <input type="text" name="valor_mensal" id='valor_mensal' />
                </div>
                <div className="form-name-input">
                    <span>Valor Total</span>
                    <input type="text" name="valor_total" id='valor_total' />
                </div>
                <div className="form-name-input">
                    <span>N° Modalidades</span>
                    <select name="num_modalidades" id="num_modalidades">
                        <option selected>Selecione</option>
                        <option value="1">1 Modalidade</option>
                        <option value="2">2 Modalidades</option>
                    </select>

                </div>
                <div className="form-name-input">
                    <span>Status do Pack</span>
                    <select name="status" id="status">
                        <option selected>Selecione</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>

                </div>

                <div className="form-name-input">
                    <span>Numero de Check-in Permitidos</span>
                    <input type="text" name="number_checkins_especial" id='number_checkins_especial' />
                </div>

                   <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
                
            </form>
        </>
    )
}
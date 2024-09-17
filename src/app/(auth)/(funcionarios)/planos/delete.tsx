'use client'

import { Plano } from '@/Components/api/PlanosRequest';
import '../../../../Assets/css/pages-styles/forms.css'


interface PlanosProps {
    planos: Plano[];
    handleSubmitDelete: (e: React.FormEvent<HTMLFormElement>) => void
    formRef: React.RefObject<HTMLFormElement>
}



export default function Delete({ planos, handleSubmitDelete, formRef }: PlanosProps) {

    return (
        <>
            <h2>Deletar Contratos</h2>
            <form action="" className="crud-form" onSubmit={handleSubmitDelete} ref={formRef} >
                <div className="form-name-input">
                   
                    <span>Selecione o Plano</span>
                    <select name="planos_id" id="planos_id">
                    <option value="" disabled selected >Selecione</option>
                        {planos.map(planos => (
                            <option value={planos.id}>{planos.nome_plano}</option>
                        ))}
                    </select>
                </div>
                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Deletar</button>
                </div>
            </form>
        </>
    )
}
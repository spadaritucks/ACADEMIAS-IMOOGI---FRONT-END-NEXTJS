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
        <h2>Criar Modalidade</h2>
            <form action="" className="crud-form" onSubmit={handleSubmit} ref={formRef} >
            <div className="form-name-input">
                    <span>Foto da Modalidade</span>
                    <input type="file" name="foto_modalidade" id='foto_modalidade' />
                </div>
                <div className="form-name-input">
                    <span>Nome da Modaliade</span>
                    <input type="text" name="nome_modalidade" id='nome_modalidade' />
                </div>
                <div className="form-name-input">
                    <span>Descrição da Modalidade</span>
                    <input type="text" name="descricao_modalidade" id='descricao_modalidade' />
                </div>

                   <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
                
            </form>
        </>
    )
}
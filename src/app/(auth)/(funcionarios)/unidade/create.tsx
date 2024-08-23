'use client'

import '../../../../Assets/css/pages-styles/forms.css'


interface createProps{
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement> 
}


export default function Create({handleSubmit,formRef}:createProps) {

    return (
        <>
        <h2>Criar Unidade</h2>
            <form action="" className="crud-form" onSubmit={handleSubmit} ref={formRef} >
            <div className="form-name-input">
                    <span>Foto da Unidade</span>
                    <input type="file" name="imagem_unidade" id='imagem_unidade' />
                </div>
                <div className="form-name-input">
                    <span>Nome da Unidade</span>
                    <input type="text" name="nome_unidade" id='nome_unidade' />
                </div>

                <div className="form-name-input">
                    <span>Endereço da Unidade</span>
                    <input type="text" name="endereco" id='endereco' />
                </div>

                <div className="form-name-input">
                    <span>Grade Horaria</span>
                    <input type="file" name="grade" id='grade' />
                </div>
                <div className="form-name-input">
                    <span>Descrição da Unidade</span>
                    <input type="text" name="descricao" id='descricao' />
                </div>

                   <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                    <button type='submit' className='submit-button'>Enviar</button>
                </div>
                
            </form>
        </>
    )
}
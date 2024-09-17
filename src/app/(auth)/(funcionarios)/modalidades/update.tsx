'use client'

import { Modalidade } from '@/Components/api/ModalidadesRequest';
import '../../../../Assets/css/pages-styles/forms.css'
import { useState } from 'react';
import Image from 'next/image';


interface ModalidadeProps {
    modalidades: Modalidade[];
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
}


export default function Update({ modalidades, handleSubmitUpdate, formRef }: ModalidadeProps) {

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const id = e.target.value
        const selectedModalidade = modalidades.find(modalidade => modalidade.id === parseInt(id));
        if (selectedModalidade && formRef.current) {

            const form = formRef.current;

            // Atualize os campos do formulário com os dados do plano selecionado
            setPreviewImage(selectedModalidade.foto_modalidade);
            (form['nome_modalidade'] as HTMLInputElement).value = selectedModalidade.nome_modalidade.toString();
            (form['descricao_modalidade'] as HTMLInputElement).value = selectedModalidade.descricao_modalidade.toString();

        }


    }


    return (
        <>
            <h2>Alterar Modalidade</h2>
            {previewImage && (
                <Image src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${previewImage}`} alt="Prévia da Imagem da Modalidade" width={200} height={200} style={{ gridColumn: '1 / -1' }} />
            )}

            <form action="" className="crud-form" onSubmit={handleSubmitUpdate} ref={formRef}>

                <div className="form-name-input">
                    <span>Selecione a Modalidade</span>
                    <select name="modalidade_id" id="modalidade_id" onChange={handleInputChange}>
                        <option value="" disabled selected >Selecione</option>
                        {modalidades.map(modalidades => (
                            <option value={modalidades.id}>{modalidades.nome_modalidade}</option>

                        ))}
                    </select>
                </div>


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
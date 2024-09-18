'use client'

import '../../../../Assets/css/pages-styles/forms.css'
import { Packs, Plano } from '@/Components/api/PlanosRequest'

interface PlanosProps {
    packs: Packs[];
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>
}


export default function Update({ packs, handleSubmitUpdate, formRef }: PlanosProps) {

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value
        const selectedPlano = packs.find(packs => packs.id === parseInt(id));
        if (selectedPlano && formRef.current) {

            const form = formRef.current;

            // Atualize os campos do formulário com os dados do plano selecionado
            (form['nome_plano'] as HTMLInputElement).value = selectedPlano.nome_plano.toString();
            (form['duracao'] as HTMLInputElement).value = selectedPlano.duracao.toString();
            (form['valor_matricula'] as HTMLInputElement).value = selectedPlano.valor_matricula.toString();
            (form['valor_mensal'] as HTMLInputElement).value = selectedPlano.valor_mensal.toString();
            (form['valor_total'] as HTMLInputElement).value = selectedPlano.valor_total.toString();
            (form['num_modalidades'] as HTMLSelectElement).value = selectedPlano.num_modalidades.toString();
            (form['status'] as HTMLSelectElement).value = selectedPlano.status;
            (form['number_checkins_especial'] as HTMLInputElement).value = selectedPlano.number_checkins_especial.toString();
        }


    }


    return (
        <>
            <h2>Alterar Pack</h2>
            <form action="" className="crud-form" onSubmit={handleSubmitUpdate} ref={formRef}>

                <div className="form-name-input">
                    <span>Selecione o Plano</span>
                    <select name="planos_id" id="planos_id" onChange={handleInputChange}>
                        <option value="" disabled selected >Selecione</option>
                        {packs.map(packs => (
                            <option value={packs.id}>{packs.nome_plano}</option>

                        ))}
                    </select>
                </div>

                <div className="form-name-input">
                    <span>Nome do Plano</span>
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
                    <span>Status do Plano</span>
                    <select name="status" id="status">
                        <option selected>Selecione</option>
                        <option value="Ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
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
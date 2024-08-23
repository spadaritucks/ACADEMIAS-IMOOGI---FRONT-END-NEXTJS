'use client'
import '../../../../Assets/css/pages-styles/forms.css'


export default function Funcionario() {


    return (

        <>
            <div className="form-name-input">
                <span>Tipo do Funcionario</span>
                <select name="tipo_funcionario" id="tipo_funcionario">
                    <option value="" selected>Selecione</option>
                    <option value="professor">Professor</option>
                    <option value="administrador">Administrador</option>
                </select>
            </div><div className="form-name-input">
                <span>Cargo</span>
                <input type="text" name='cargo' id="cargo" placeholder="Nome Completo" />
            </div><div className="form-name-input">
                <span>Atividades</span>
                <input type="text" name='atividades' id="atividades" placeholder="Nome Completo" />
            </div>
        </>


    )
}


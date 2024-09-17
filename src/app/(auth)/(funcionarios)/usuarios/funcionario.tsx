'use client'
import '../../../../Assets/css/pages-styles/forms.css'

interface UsuariosProps {
    formErrors?: { [key: string] : string[]}
}


export const Funcionario:React.FC<UsuariosProps> = ({formErrors}) => {


    return (

        <>
            <div className="form-name-input">
                <span>Tipo do Funcionario</span>

                <select name="tipo_funcionario" id="tipo_funcionario">
                    <option value="" disabled selected >Selecione</option>
                    <option value="professor">Professor</option>
                    <option value="administrador">Administrador</option>
                </select>
            </div><div className="form-name-input">
                <span>Cargo</span>
                <input type="text" name='cargo' id="cargo" placeholder="Cargo" />
            </div><div className="form-name-input">
                <span>Atividades</span>
                <input type="text" name='atividades' id="atividades" placeholder="Atividades" />
            </div>
        </>


    )
}


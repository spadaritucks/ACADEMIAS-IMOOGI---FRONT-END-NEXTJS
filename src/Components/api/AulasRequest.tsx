import api from './api'

export interface Aula {
    modalidade_id: number,
    nome_modalidade: string;
    horario: string;
    dia_semana:string;
    limite_alunos: number;
}

export const getAulas = async () =>{

    try{
        const response = await api.get('/api/aulas')
        return response.data.aulas

    }catch(error){
        console.error('Erro ao consultar as aulas' + error)
        throw error;
    }

}

export const createAula = async (userData: FormData) => {
    try{
        const response = await api.post('/api/aulas', userData);

        return response.data.message
    }catch(error){
        console.error("Erro ao criar a aula" + error)
        throw error
    }
}

export const updateAula = async (id:number, userData:FormData) => {
    try{
        const response = await api.post(`/api/aulas/${id}?_method=PUT`, userData);

        return response.data.message

    }catch(error){
        console.error("Erro ao criar a aula" + error)
        throw error
    }
}

export const deleteAula = async (id:number) => {
    try{
        const response = await api.delete(`/api/aulas/${id}`);

        return response.data.message
        
    }catch(error){
        console.error("Erro ao criar a aula" + error)
        throw error
    }
}
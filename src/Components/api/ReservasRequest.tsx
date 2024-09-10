import api from './api'

export interface Reserva {
    id:number;
    modalidade_id: number,
    usuario_id: number
    nome_modalidade: string;
    horario: string;
    dia_semana:string;
}

export const getReservas = async () =>{

    try{
        const response = await api.get('/api/reservas')
        return response.data.reservas

    }catch(error){
        console.error('Erro ao consultar as reservas' + error)
        throw error;
    }

}

export const createReservas = async (userData: FormData) => {
    try{
        const response = await api.post('/api/reservas', userData);

        return response.data.message
    }catch(error){
        console.error("Erro ao criar a reserva" + error)
        throw error
    }
}

export const updateReservas = async (id:number, userData:FormData) => {
    try{
        const response = await api.post(`/api/reservas/${id}?_method=PUT`, userData);

        return response.data.message

    }catch(error){
        console.error("Erro ao editar a reserva" + error)
        throw error
    }
}

export const deleteReserva = async (id:number) => {
    try{
        const response = await api.delete(`/api/reservas/${id}`);

        return response.data.message
        
    }catch(error){
        console.error("Erro ao criar a reserva" + error)
        throw error
    }
}
import api from './api';


 export interface Modalidade{
  id:number;
  foto_modalidade: string;
  nome_modalidade: string;
  descricao_modalidade:string
}

// Função para buscar todas as modalidades
export const getModalidade = async (): Promise<Modalidade[]> => {
  try {
    const response = await api.get('/api/modalidades');
    return response.data.modalidades; 
  } catch (error) {
    console.error('Failed to fetch modalidades:', error);
    return []; 
  }
};

// Função para buscar uma modalidade por ID
export const getModalidadeById = async (id: number): Promise<Modalidade> => {
  try {
    const response = await api.get(`/api/modalidades/${id}`);
    return response.data.modalidade; 
  } catch (error) {
    console.error('Failed to fetch modalidade by ID:', error);
    throw error; 
  }
};


export const createModalidade = async (modalidadeData: FormData): Promise<number> => {
  try {
    const response = await api.post('/api/modalidades', modalidadeData);
    return response.data.message;
  } catch (error) {
    console.error('Failed to create modalidade:', error);
    throw error; 
  }
};

// Função para atualizar uma modalidade existente
export const updateModalidade = async (id: FormDataEntryValue, modalidadeData: FormData): Promise<number> => {
  try {
    const response = await api.post(`/api/modalidades/${id}`, modalidadeData);
    return response.data.message;
  } catch (error) {
    console.error('Failed to update modalidade:', error);
    throw error; 
  }
};

// Função para deletar uma modalidade
export const deleteModalidade = async (id: FormDataEntryValue): Promise<number> => {
  try {
    const response = await api.delete(`/api/modalidades/${id}`);
    return response.status;
  } catch (error) {
    console.error('Failed to delete modalidade:', error);
    throw error; 
  }
};

export const selectModalidades= async () => {

  try {

    let planos: Modalidade[] = [];
    planos = await getModalidade(); // Busca os dados dos planos

  } catch (error) {

    console.error('Failed to fetch modalidade:', error);
  }
}
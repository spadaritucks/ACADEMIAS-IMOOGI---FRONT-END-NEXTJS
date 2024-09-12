'use client'
import {
    Table,
    TableContainer,
} from '@chakra-ui/react'
import { AdmMain } from "@/Layouts/AdmMain"
import '@/Assets/css/pages-styles/aulas.css'
import { useEffect, useRef, useState } from 'react';
import { Aula, createAula, getAulas } from '@/Components/api/AulasRequest';
import '../../../../Assets/css/pages-styles/crud.css'
import { useModal } from '@/Components/errors/errorContext';
import '../../../../Assets/css/pages-styles/dashboard.css'
import Create from './create';
import UserSession from '@/Components/api/UserSession';

// Definindo a ordem dos dias da semana
const diasDaSemana = [
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sabado'
];

// Função para converter horários no formato "HH:MM" para minutos desde a meia-noite
const convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

export default function Aulas() {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const { modalServer } = useModal();
    const { user, setUser } = UserSession();

    useEffect(() => {
        const fetchAulas = async () => {
            const response = await getAulas();

            // Ordenar as aulas por dia da semana e horário
            const sortedAulas = response.sort((a: Aula, b: Aula) => {
                const diaA = diasDaSemana.indexOf(a.dia_semana);
                const diaB = diasDaSemana.indexOf(b.dia_semana);

                if (diaA === diaB) {
                    // Comparar horários se os dias forem iguais
                    return convertToMinutes(a.horario) - convertToMinutes(b.horario);
                }
                return diaA - diaB; // Ordenar pelos dias da semana
            });

            setAulas(sortedAulas);
        };

        fetchAulas();

    }, []);

    if (!user) {
        return null;
    }

    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if(formRef.current){
            const formdata = new FormData(formRef.current)

            const response = await createAula(formdata)

            modalServer('Sucesso', response)
            
            
        }
        

    }

    // Agrupando as aulas por dia da semana
    const aulasPorDia = diasDaSemana.map(dia => {
        return {
            dia,
            aulas: aulas.filter(aula => aula.dia_semana === dia)
        };
    });

    return (
        <AdmMain>
            <section className='aulas-menu'>
            <h1>Gerenciamento de Aulas</h1>
                <div className='gerenciamento-aulas'>
                    <div className='aulas-list'>
                        {aulasPorDia.map(({ dia, aulas }) => (
                            <div className='aulas-area'>
                                {aulas ? aulas.map(aula => (
                                    <div className='aula-component' key={aula.modalidade_id}>
                                        <h3 className='modalidade_aula' style={{margin: '0 5px'}}>{aula.nome_modalidade}</h3>
                                        <p className='dia_semana' style={{margin: '0 5px'}}>{dia}</p>
                                        <p className='horario' style={{margin: '0 5px'}}>{aula.horario.substring(0, 5)}</p>
                                        <p className='limites_alunos' style={{margin: '0 5px'}}>Limite: {aula.limite_alunos} Alunos</p>
                                    </div>
                                )): <p>Nenhuma Aula Encontrada</p>}
                            </div>
                        ))}

                    </div>
                    <div className='aulas-create'>
                        <Create diasDaSemana={diasDaSemana} handleSubmit={handleSubmit} formRef={formRef} />
                    </div>
                </div>
                <h1>Grade de Aulas</h1>
                <div className='grade-aulas'>
                    <div className='aulas-container'>
                        {aulasPorDia.map(({ dia, aulas }) => (
                            <div className='coluna-aulas' key={dia}>
                                <h2 className='dia_semana'>{dia}</h2>
                                {aulas.length > 0 ? aulas.map(aula => (
                                    <div className='aula' key={aula.modalidade_id}>
                                        <h3 className='modalidade_aula'>{aula.nome_modalidade}</h3>
                                        <p className='horario'>{aula.horario.substring(0, 5)}</p>
                                        <p className='limites_alunos'>Limite: {aula.limite_alunos} Alunos</p>
                                    </div>
                                )) : <p>Nenhuma Aula</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </AdmMain>
    );
}

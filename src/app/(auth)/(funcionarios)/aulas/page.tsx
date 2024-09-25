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
import { format, addWeeks, startOfWeek, endOfWeek, parseISO, isSameWeek, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/Components/ui/button';

// Definindo a ordem dos dias da semana
const diasDaSemana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [semanaAtual, setSemanaAtual] = useState(new Date());

    useEffect(() => {
        setIsLoading(true)
        try {
            const fetchAulas = async () => {
                const inicio = startOfWeek(semanaAtual, { weekStartsOn: 1 });
                const fim = endOfWeek(semanaAtual, { weekStartsOn: 1 });
                const response = await getAulas(format(inicio, 'yyyy-MM-dd'), format(fim, 'yyyy-MM-dd'));

                // Filtrar apenas as aulas da semana atual
                const aulasDaSemana = response.filter((aula: Aula) => {
                    const dataInicio = parseISO(aula.data_inicio);
                    const dataFim = parseISO(aula.data_fim);
                    return (isBefore(dataInicio, fim) || isSameWeek(dataInicio, semanaAtual, { weekStartsOn: 1 })) &&
                           (isAfter(dataFim, inicio) || isSameWeek(dataFim, semanaAtual, { weekStartsOn: 1 }));
                });

                setAulas(aulasDaSemana);
            };

            fetchAulas();
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsLoading(false)
        }
    }, [semanaAtual]);

    if (!user) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const diasSemana = Array.from(formdata.getAll('dia_semana')).join(',');
            formdata.delete('dia_semana');
            formdata.append('dia_semana', diasSemana);

            const response = await createAula(formdata)

            modalServer('Sucesso', response)


        }
    }

    // Função para verificar se a aula ocorre em um determinado dia da semana atual
    const aulaOcorreNoDia = (aula: Aula, diaSemana: string) => {
        const dataInicio = parseISO(aula.data_inicio);
        const dataFim = parseISO(aula.data_fim);
        const diaAtual = diasDaSemana.indexOf(diaSemana);
        const diasAula = aula.dia_semana.split(',').map(Number);
        const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 1 });
        const fimSemana = endOfWeek(semanaAtual, { weekStartsOn: 1 });
        
        return diasAula.includes(diaAtual) &&
               isBefore(dataInicio, fimSemana) &&
               isAfter(dataFim, inicioSemana);
    };

    // Agrupando as aulas por dia da semana
    const aulasPorDia = diasDaSemana.map((dia) => {
        return {
            dia,
            aulas: aulas.filter(aula => aulaOcorreNoDia(aula, dia))
        };
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-2">Carregando dados...</p>
            </div>
        )
    }

    return (
        <AdmMain>
            <section className='aulas-menu'>
                <h1>Gerenciamento de Aulas</h1>
                <div className='buttons-datas'>
                    <Button variant = 'imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, -1))}>Semana Anterior</Button>
                    <span>{format(semanaAtual, "'Semana de' dd 'de' MMMM", { locale: ptBR })}</span>
                   <Button variant = 'imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, 1))}>Próxima Semana</Button>
                </div>
                <div className='gerenciamento-aulas'>
                    <div className='aulas-list'>
                        {aulasPorDia.map(({ dia, aulas }) => (
                            <div className='aulas-area' key={dia}>
                                <h2>{dia}</h2>
                                {aulas.length > 0 ? aulas.map(aula => (
                                    <div className='aula-component' key={aula.id}>
                                        <h3 className='modalidade_aula' style={{ margin: '0 5px' }}>{aula.nome_modalidade}</h3>
                                        <p className='horario' style={{ margin: '0 5px' }}>{aula.horario.substring(0, 5)}</p>
                                        <p className='limites_alunos' style={{ margin: '0 5px' }}>Limite: {aula.limite_alunos} Alunos</p>
                                    </div>
                                )) : <p>Nenhuma Aula Encontrada</p>}
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
                                <div className='aulas-lista'>
                                    {aulas.length > 0 ? aulas.map(aula => (
                                        <div className='aula' key={aula.modalidade_id}>
                                            <h3 className='modalidade_aula'>{aula.nome_modalidade}</h3>
                                            <p className='horario'>{aula.horario.substring(0, 5)}</p>
                                            <p className='limites_alunos'>Limite: {aula.limite_alunos} Alunos</p>
                                        </div>
                                    )) : <p>Nenhuma Aula</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </AdmMain>
    );
}

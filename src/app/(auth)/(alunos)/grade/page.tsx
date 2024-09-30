"use client"

import { ClientMain } from "@/Layouts/ClientMain"
import { FC, useEffect, useState } from "react";
import { Aula, getAulas } from "@/Components/api/AulasRequest";
import '@/Assets/css/pages-styles/aulas.css'
import { createReservas, deleteReserva, getReservas, Reserva } from "@/Components/api/ReservasRequest";
import UserSession from "@/Components/api/UserSession";
import { useModal } from "@/Components/errors/errorContext";
import { Contrato, getUsers, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { format, addWeeks, startOfWeek, endOfWeek, parseISO, isSameWeek, isBefore, isAfter, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/Components/ui/button';

// Definindo a ordem dos dias da semana
const diasDaSemana = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

// Função para converter horários no formato "HH:MM" para minutos desde a meia-noite
const convertToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Função para gerar uma chave única para cada aula
const generateKey = (modalidade_id: number, horario: string, dia_semana: string) => {
    return `${modalidade_id}-${horario}-${dia_semana}`;
};

export default function GradeReservas() {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [reservasPorAula, setReservasPorAula] = useState<{ [key: string]: number }>({});
    const [reservas, setReservas] = useState<Reserva[]>([])
    const { user } = UserSession();
    const { modalServer } = useModal();
    const [userModalidades, setUserModalidades] = useState<UsuarioModalidade[]>([])
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [semanaAtual, setSemanaAtual] = useState(new Date());
    const [dataHoje, setDataHoje] = useState<string>();


    useEffect(() => {
        setIsLoading(true)
        try {
            const fetchAulas = async () => {
                const inicio = startOfWeek(semanaAtual, { weekStartsOn: 1 });
                const fim = endOfWeek(semanaAtual, { weekStartsOn: 1 });
                const response = await getAulas(format(inicio, 'yyyy-MM-dd'), format(fim, 'yyyy-MM-dd'));
                const userResponse = await getUsers();

                // Filtrar apenas as aulas da semana atual
                const aulasDaSemana = response.filter((aula: Aula) => {
                    const dataInicio = parseISO(aula.data_inicio);
                    const dataFim = parseISO(aula.data_fim);
                    return dataInicio <= fim && dataFim >= inicio;
                });

                //Verificação das Modalidades Vinculadas
                const modalidadesVinculadas = userResponse.modalidades.filter(
                    (modalidade: UsuarioModalidade) => modalidade.usuario_id === user?.id
                );
                setUserModalidades(modalidadesVinculadas);

                const modalidadeIds = modalidadesVinculadas.map((modalidade: UsuarioModalidade) => modalidade.modalidade_id);

                const filteredAulas = aulasDaSemana.filter((aula: Aula) =>
                    modalidadeIds.includes(aula.modalidade_id)
                );

                //Hook contendo os contratos para verificação
                setContratos(userResponse.contratos);

                // Ordena as aulas por dia da semana e horário
                const sortedAulas = filteredAulas.sort((a: Aula, b: Aula) => {
                    const diaA = diasDaSemana.indexOf(a.dia_semana);
                    const diaB = diasDaSemana.indexOf(b.dia_semana);

                    if (diaA === diaB) {
                        return convertToMinutes(a.horario) - convertToMinutes(b.horario);
                    }
                    return diaA - diaB;
                });

                setAulas(sortedAulas);
            };

            const dataString = format(new Date(), 'MM-dd');
            setDataHoje(dataString)

            fetchAulas();
            fetchReservas();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [semanaAtual, user]);

    const fetchReservas = async () => {
        const reservasResponse = await getReservas();
        setReservas(reservasResponse);

        // Contagem de reservas para cada aula
        const reservasContadas: { [key: string]: number } = {};

        reservasResponse.forEach((reserva: Reserva) => {
            const diaSemanaNumero = diasDaSemana.indexOf(reserva.dia_semana);
            const aulaKey = generateKey(reserva.modalidade_id, reserva.horario, diaSemanaNumero.toString());

            if (!reservasContadas[aulaKey]) {
                reservasContadas[aulaKey] = 0;
            }
            reservasContadas[aulaKey]++;
        });

        setReservasPorAula(reservasContadas);
    };

    const clickReserva = async (modalidade_id: number, horario: string, dia_semana: string, limite_alunos: number) => {
        if (!user) return;

        const aulaKey = generateKey(modalidade_id, horario, dia_semana);
        const reservasAtual = reservasPorAula[aulaKey] || 0;

        // Verifica se o limite de alunos foi atingido
        if (reservasAtual >= limite_alunos) {
            modalServer('Erro', 'O limite de alunos para esta aula já foi atingido.');
            return;
        }

        //Verificação se não há mais de um agendamento
        const reservaExistente = reservas.find(reserva => reserva.usuario_id === user.id);

        if (reservaExistente) {
            modalServer('Erro', 'Você já possui uma reserva em outra aula. Cancele a reserva atual antes de fazer uma nova.');
            return;
        }

        //Verificação se o Plano esta em vigor
        const contrato = contratos.find(contrato => contrato.usuario_id === user.id)

        if (contrato) {
            const dataHoje = new Date()
            const dataVencimento = new Date(contrato.data_vencimento)

            if (isNaN(dataVencimento.getTime())) {
                modalServer('Erro', 'Data de vencimento inválida.');
                return;
            }

            const diffInTime = dataVencimento.getTime() - dataHoje.getTime();
            const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));

            if (dias < 0) {
                modalServer('Erro', 'Regularize o seu Plano')
                return
            }
        }

        const formdata = new FormData();
        const diaSemanaNumero = diasDaSemana.indexOf(dia_semana);
        formdata.append('usuario_id', user.id.toString());
        formdata.append('modalidade_id', modalidade_id.toString());
        formdata.append('horario', horario);
        formdata.append('dia_semana', diaSemanaNumero.toString());

        const response = await createReservas(formdata);
        if (response.status === 'false') {
            modalServer('Mensagem', response.message);
        } else {
            modalServer('Mensagem', response.message);
            setReservasPorAula(prevState => ({
                ...prevState,
                [aulaKey]: (prevState[aulaKey] || 0) + 1
            }));
            
            // Adicione esta linha para atualizar o estado das reservas
            setReservas(prevReservas => [
                ...prevReservas,
                {
                    usuario_id: user.id,
                    modalidade_id: modalidade_id,
                    horario: horario,
                    dia_semana: dia_semana
                } as Reserva
            ]);
        }
        
    };

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
        );
    }

    if (!user) {
        return null;
    }

    return (
        <ClientMain>
            <section className='aulas-menu'>
                <h1>Grade de Aulas</h1>
                <div className='buttons-datas'>
                    <Button variant='imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, -1))}>Semana Anterior</Button>
                    <span>{format(semanaAtual, "'Semana de' dd 'de' MMMM", { locale: ptBR })}</span>
                    <Button variant='imoogi' onClick={() => setSemanaAtual(addWeeks(semanaAtual, 1))}>Próxima Semana</Button>
                </div>
                <div className='grade-aulas'>
                    <div className='aulas-container'>
                        {aulasPorDia.map(({ dia, aulas }) => {
                            const dataCorrespondente = format(addDays(semanaAtual, diasDaSemana.indexOf(dia)), 'dd/MM'); // Adicionando a data correspondente
                            return (
                                <div className='coluna-aulas' key={dia}>
                                    <h2 className='dia_semana'>{dia} - {dataCorrespondente}</h2>
                                    <div className='aulas-lista'>
                                        {aulas.length > 0 ? aulas.map(aula => {
                                            const aulaKey = generateKey(aula.modalidade_id, aula.horario, dia);
                                            return (
                                                <div className='aula' key={aulaKey}>
                                                    <h3 className='modalidade_aula'>{aula.nome_modalidade}</h3>
                                                    <p className='horario'>{aula.horario.substring(0, 5)}</p>
                                                    <div className="container-reserva">
                                                        <button
                                                            className="btn-reserva"
                                                            onClick={() => clickReserva(aula.modalidade_id, aula.horario, dia, aula.limite_alunos)}
                                                        >
                                                            Reservar
                                                        </button>
                                                        <p className="limiteAlunos">
                                                            {reservasPorAula[aulaKey] || 0}/{aula.limite_alunos}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }) : <p>Nenhuma Aula</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </ClientMain>
    );
}


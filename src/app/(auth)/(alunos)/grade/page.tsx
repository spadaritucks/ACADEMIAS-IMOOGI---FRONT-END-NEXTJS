"use client"

import { ClientMain } from "@/Layouts/ClientMain"
import { FC, useEffect, useState } from "react";
import { Aula, getAulas } from "@/Components/api/AulasRequest";
import '@/Assets/css/pages-styles/aulas.css'
import { createReservas, getReservas, Reserva } from "@/Components/api/ReservasRequest";
import UserSession from "@/Components/api/UserSession";
import { useModal } from "@/Components/errors/errorContext";
import { Contrato, getUsers, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { getModalidade } from "@/Components/api/ModalidadesRequest";

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


    // Fetch aulas do banco de dados e ordenar e determinar verificações envolvendo as condições do usuario
    useEffect(() => {
        const fetchAulas = async () => {

            const response = await getAulas();
            const userResponse = await getUsers();

            //Verificação das Modalidades Vinculadas
            const modalidadesVinculadas = userResponse.modalidades.filter(
                (modalidade: UsuarioModalidade) => modalidade.usuario_id === user?.id
            );
            setUserModalidades(modalidadesVinculadas);


            const modalidadeIds = modalidadesVinculadas.map((modalidade: UsuarioModalidade) => modalidade.modalidade_id);


            const filteredAulas = response.filter((aula: Aula) =>
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

        fetchAulas();
    }, [user]);



    // Fetch reservas do banco de dados e contar
    useEffect(() => {
        const countAlunosReserva = async () => {
            const reservasResponse = await getReservas();
            setReservas(reservasResponse)

            // Contagem de reservas para cada aula
            const reservasContadas: { [key: string]: number } = {};

            reservasResponse.forEach((reserva: Reserva) => {
                const aulaKey = generateKey(reserva.modalidade_id, reserva.horario, reserva.dia_semana);

                if (!reservasContadas[aulaKey]) {
                    reservasContadas[aulaKey] = 0;
                }
                reservasContadas[aulaKey]++;
            });

            setReservasPorAula(reservasContadas);
        };

        countAlunosReserva();


    }, []);

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
                // Se a data de vencimento não for válida
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
        formdata.append('usuario_id', user.id.toString());
        formdata.append('modalidade_id', modalidade_id.toString());
        formdata.append('horario', horario);
        formdata.append('dia_semana', dia_semana);

        const response = await createReservas(formdata);
        modalServer('Aula Agendada', response);

        // Atualiza as reservas após criar nova reserva
        setReservasPorAula(prevState => ({
            ...prevState,
            [aulaKey]: reservasAtual + 1
        }));
    };

    if (!user) {
        return null;
    }


    // Agrupando as aulas por dia da semana
    const aulasPorDia = diasDaSemana.map(dia => {
        return {
            dia,
            aulas: aulas.filter(aula => aula.dia_semana === dia)

        };
    });

    return (
        <ClientMain>
            <div className='grade-aulas'>
                <div className='aulas-container'>
                    {aulasPorDia.map(({ dia, aulas }) => (
                        <div className='coluna-aulas' key={dia}>
                            <h2 className='dia_semana'>{dia}</h2>
                            {aulas.length > 0 ? aulas.map(aula => {
                                const aulaKey = generateKey(aula.modalidade_id, aula.horario, aula.dia_semana);

                                return (
                                    <div className='aula' key={aulaKey}>
                                        <h3 className='modalidade_aula'>{aula.nome_modalidade}</h3>
                                        <p className='horario'>{aula.horario.substring(0, 5)}</p>
                                        <div className="container-reserva">
                                            <button
                                                className="btn-reserva"
                                                onClick={() => clickReserva(aula.modalidade_id, aula.horario, aula.dia_semana, aula.limite_alunos)}
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
                    ))}
                </div>
            </div>
        </ClientMain>
    );
}


'use client'
import UserSession from "@/Components/api/UserSession";
import { Contrato, getUsers, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { ClientMain } from "@/Layouts/ClientMain";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import '@/Assets/css/pages-styles/area_aluno.css'
import { deleteReserva, getReservas, Reserva } from "@/Components/api/ReservasRequest";
import { useModal } from "@/Components/errors/errorContext";



export default function AreaDoAluno() {

    const { user, setUser } = UserSession();
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [modalidades, setModalidades] = useState<UsuarioModalidade[]>([])
    const [reservas, setReservas] = useState<Reserva>()
    const {modalServer} = useModal()

    

    useEffect(() => {

        const handleContratos = async () => {
            const response = await getUsers()
            setContratos(response.contratos)
            setModalidades(response.modalidades)

        }
        handleContratos();

        const handleReservas = async () => {
            if (!user) return;

            const reservasResponse = await getReservas();
            const userReserva = reservasResponse.find((reserva: Reserva) => reserva.usuario_id === user.id)
            setReservas(userReserva)
        }

        if(user){
            handleReservas()
        }

    }, [user])

    if (!user) {
        return null;
    }

    const clickDeleteReserva = async () => {
        if (!user) return;
    
        if (reservas) {
            const response = await deleteReserva(reservas.id);
            modalServer("Reserva Excluida", response);
    
            // Atualize o estado de reservas para forçar a re-renderização
            setReservas(undefined); // Ou null, dependendo do que você preferir
        }
    }



    

    const contrato = contratos.filter(contrato => contrato.usuario_id === user.id)
    const modalidade = modalidades.filter(modalidade => modalidade.usuario_id === user.id)

    let nomeCompleto = user.nome;
    let partesNome = nomeCompleto.split(' ')
    let nome = partesNome.slice(0, 2).join(' ')


    return (
        <ClientMain>
            <h1>Bem vindo(a) {nome}</h1>

            <section className="menuAluno">
                <div className="dados">
                    <h2>Informações do seu Plano</h2>
                    {contrato.map(userContrato => (
                        <>
                            <h3 className="plan-title">{userContrato.nome_plano}</h3>
                            <div className="user-datas">
                                <p className="dado"><span>Inicio </span> {userContrato.data_inicio}</p>
                                <p className="dado"><span>Renovação </span> {userContrato.data_renovacao}</p>
                                <p className="dado"><span>Vencimento  </span>{userContrato.data_vencimento}</p>
                            </div>
                        </>
                    ))}
                </div>
                <div className="dados">
                    <h2>Modalidades Permitidas</h2>
                    <div className="user-modalidades">
                        {modalidade.map((userModalidade, index) => (
                            <>
                                <p key={index} className="dado"> <span>Modalidade {index + 1} : </span>{userModalidade.nome_modalidade}</p>

                            </>
                        ))}
                    </div>

                    <div className="reservasContainer">
                        <h2>Reservas</h2>
                        <div className="reserva-dados">
                            {reservas ?
                                <>
                                <p className="modalidade-reserva" style={{margin : "5px"}}>{reservas?.nome_modalidade} - </p>
                                <p className="dia_semana_reserva"style={{margin : "5px"}}>{reservas?.dia_semana} - </p>
                                <p className="horario-reserva"style={{margin : "5px"}}>{reservas?.horario.substring(0,5)} - </p>
                                <button className="btn-delete-reserva" onClick={() => clickDeleteReserva()}>Desfazer</button>
                                </>:
                                <p>Nenhum agendamento feito</p>
                            }
                           
                        </div>
                    </div>
                </div>


            </section>
        </ClientMain>
    )



}
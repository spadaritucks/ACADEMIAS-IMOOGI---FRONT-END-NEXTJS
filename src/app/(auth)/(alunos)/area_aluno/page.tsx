'use client'
import UserSession from "@/Components/api/UserSession";
import { Contrato, getUsers, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { ClientMain } from "@/Layouts/ClientMain";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import '@/Assets/css/pages-styles/area_aluno.css'
import { deleteReserva, getReservas, Reserva } from "@/Components/api/ReservasRequest";
import { useModal } from "@/Components/errors/errorContext";
import { Button } from "@/Components/ui/button";
import { getPagamentosMensais, PagamentoMensal, postPagamentosMensais, putPagamentosMensais } from "@/Components/api/PagamentosRequest";
import { BaixaPagamento } from "./BaixaPagamento";
import EditUserModal from '@/Components/user-modals-edit/EditUserModal';
import { ModalEditUserProvider, useUserEditModal } from '@/Components/user-modals-edit/EditUserContext';
import Link from "next/link";





export default function AreaDoAluno() {



    const AreaAlunoContent = () => {
        const { user, setUser } = UserSession();
        const [contratos, setContratos] = useState<Contrato[]>([])
        const [modalidades, setModalidades] = useState<UsuarioModalidade[]>([])
        const [reservas, setReservas] = useState<Reserva>()
        const [pagamentos, setPagamentos] = useState<PagamentoMensal[]>([])
        const formRef = useRef<HTMLFormElement>(null);
        const { modalServer } = useModal()
        const { showModal } = useUserEditModal()



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

            const handlePagamentos = async () => {
                const response = await getPagamentosMensais()
                const pagamentosUsuario = response.filter((pagamento: PagamentoMensal) => pagamento.usuario_id == user.id);
                setPagamentos(pagamentosUsuario)
            }

            if (user) {
                handleReservas()
                handlePagamentos()
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

        const handlePagamentoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (formRef.current) {
                const formdata = new FormData(formRef.current)
                formdata.append('usuario_id', user.id)
                const response = await postPagamentosMensais(formdata)
                console.log(formdata)
                if (response) {
                    if (response.status === 'false') {
                        if (typeof response.message === 'object') {
                            modalServer('Erro', 'Preencha os campos corretamente');
                        } else if (typeof response.message === 'string') {
                            modalServer('Erro', response.message);
                        }
                    } else {
                        modalServer('Sucesso', response.message)
                    }



                }
            }

        }

        const baixaPagamento = () => {
            showModal('Baixa Pagamento', <BaixaPagamento handleSubmit={handlePagamentoSubmit} formRef={formRef} />)

        }

        const exibirModalPagamento = (pagamento: PagamentoMensal) => {
            const mensagem_adm = pagamento.comentario_adm

            const exibirMensagemAdm = () => {
                showModal('Mensagem do Administrador',
                   <>
                    <p className="text-center">{mensagem_adm}</p>
                    <Button variant='link' onClick={() => handleResponderMensagemAdm(pagamento.id)}>Responder Administrador</Button>
                   </>
                    
                )
            }

            const handleResponderMensagemAdm = (pagamento_id: number) => {
                showModal('Mensagem para o Administrador',  
                    <form onSubmit={handleSubmitResponderMensagemAdm(pagamento_id)} ref={formRef}>
                       <div className="form-name-input">
                           <span>Mensagem para o Administrador</span>
                           <textarea name="comentario" id="comentario" rows={4} cols={25}></textarea>
                       </div>
        
                       <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                           <button type='submit' className='submit-button'>Enviar</button>
                       </div>
                    </form>
                )
            }
            showModal('Informações de Pagamentos',
                <>


                    <div className="modal_pagamentos_dados ">
                        <Button variant='imoogi'><Link href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${pagamento.comprovante}`}>Comprovante</Link></Button>
                        <p className="dado-pagamento m-4"> <span> Valor Pago </span> R$ {pagamento.valor_pago}</p>
                        <p className="dado-pagamento m-4"> <span>Comentario </span> {pagamento.comentario}</p>
                        {mensagem_adm ? <p><Button variant ='imoogi' onClick={exibirMensagemAdm} >Mensagem do Administrador</Button></p> : ""}
                    </div>
                </>
            )
        }

        const handleSubmitResponderMensagemAdm = (pagamento_id: number) => async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
    
            if (formRef.current) {
                const formdata = new FormData(formRef.current);
                formdata.append('_method', 'PUT');
                
                try {
                    const response = await putPagamentosMensais(pagamento_id, formdata);
                    if(response){
                        if(response.status == 'false'){
                            if( typeof response.message == 'object'){
                                modalServer('Erro', 'Preencha todos os campos')
                        }if(typeof response.message == 'string'){
                            modalServer('Erro', response.message)
                        }
                    }else{
                        console.log(pagamento_id)
                        console.log(formdata)
                        modalServer('Sucesso', response.message)
                    }
    
                }
                    
    
                } catch (error) {
                    console.error('Erro ao enviar comentário:', error);
                }
            }
        };





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
                                <Button variant='imoogi' onClick={() => baixaPagamento()}>Anexar Comprovante</Button>
                            </>

                        ))}
                    </div>
                    <div className="pagamentos_container">
                        <h2>Pagamentos e Comprovantes</h2>
                        <div className="pagamentos-comprovantes">
                            {pagamentos.map(pagamento => (
                                <div className="container_pagamento" key={pagamento.id}>
                                    <p className="dado-pagamento"> <span>Data do Pagamento </span> {pagamento.data_pagamento}</p>
                                    <Button variant='imoogi' onClick={() => exibirModalPagamento(pagamento)}>Informações</Button>
                                </div>
                            ))}

                        </div>

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
                                        <p className="modalidade-reserva" style={{ margin: "5px" }}>{reservas?.nome_modalidade} - </p>
                                        <p className="dia_semana_reserva" style={{ margin: "5px" }}>{reservas?.dia_semana} - </p>
                                        <p className="horario-reserva" style={{ margin: "5px" }}>{reservas?.horario.substring(0, 5)} - </p>
                                        <button className="btn-delete-reserva" onClick={() => clickDeleteReserva()}>Desfazer</button>
                                    </> :
                                    <p>Nenhum agendamento feito</p>
                                }

                            </div>
                        </div>
                    </div>




                </section>

            </ClientMain>
        )

    }

    return (
        <ModalEditUserProvider>
            <AreaAlunoContent />
            <EditUserModal />
        </ModalEditUserProvider>
    )


}
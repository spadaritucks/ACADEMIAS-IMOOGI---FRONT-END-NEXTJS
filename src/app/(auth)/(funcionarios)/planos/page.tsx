'use client'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import '../../../../Assets/css/pages-styles/dashboard.css'
import '../../../../Assets/css/pages-styles/crud.css'
import Create from './create';
import Update from './update';
import Delete from './delete';
import { createPlano, deletePlano, getPlanos, updatePlano } from '@/Components/api/PlanosRequest';
import { useModal } from '@/Components/errors/errorContext';
import { AdmMain } from '@/Layouts/AdmMain';
import UserSession from '@/Components/api/UserSession';



export default function Planos() {

    const [showCreate, setShowCreate] = useState<Boolean>(false);
    const [showUpdate, setShowUpdate] = useState<Boolean>(false);
    const [showRead, setShowRead] = useState<any[]>([]);
    const [showDelete, setShowDelete] = useState<Boolean>(false);
    const { user, setUser } = UserSession();

    const formRef = useRef<HTMLFormElement>(null)
    const { modalServer } = useModal();

    const handleShowCreate = () => {
        setShowCreate(!showCreate)
        setShowUpdate(false)
        setShowDelete(false)
    }

    const handleShowUpdate = () => {
        setShowUpdate(!showUpdate)
        setShowCreate(false)
        setShowDelete(false)
    }

    const handleShowDelete = () => {
        setShowDelete(!showDelete)
        setShowCreate(false)
        setShowUpdate(false)
    }

    const handleShowRead = () => {

        const request = async () => {
            const response = await getPlanos()
            setShowRead(response)

        }

        request()
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const sendFormdata = async () => {
                const response: any = await createPlano(formdata)
                modalServer('Sucesso', response)
                console.log(response)
                
            }

            sendFormdata()
        }
        handleShowRead()
    }

    const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const id = formdata.get('planos_id')
            formdata.append('_method', 'PUT')

            if (id) {
                const sendFormdata = async () => {
                    const response: any = await updatePlano(id, formdata)
                    modalServer('Sucesso', response)
                    console.log(response)
                }
                sendFormdata()
            }


        }
        handleShowRead()
    }

    const handleSubmitDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const id = formdata.get('planos_id')


            if (id) {
                const sendFormdata = async () => {
                    const response: any = await deletePlano(id)
                    modalServer('Sucesso', response)
                    console.log(response)
                }
                sendFormdata()
            }

            handleShowRead()
        }

    }



    useEffect(() => {
        handleShowRead()
    }, [])



    return (
        <AdmMain>
            <>
                <h1>Painel de Planos e Contratos</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th style={{ textAlign: "center" } }>Nome do Plano</Th>
                                        <Th>Duração(em meses)</Th>
                                        <Th>Matricula</Th>
                                        <Th>Valor Mensal</Th>
                                        <Th>Valor Total</Th>
                                        <Th>N°Modalidades</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {showRead.map(planos => (
                                        <Tr key={planos.id}>
                                            <Td style={{ textAlign: "center" }}>{planos.nome_plano}</Td>
                                            <Td>{planos.duracao > 1 ? planos.duracao + ' meses' : planos.duracao + ' mês'}</Td>
                                            <Td>{'R$' + planos.valor_matricula}</Td>
                                            <Td>{'R$' + planos.valor_mensal}</Td>
                                            <Td>{'R$' + planos.valor_total}</Td>
                                            <Td>{planos.num_modalidades > 1 ? planos.num_modalidades + ' modalidades' : planos.num_modalidades + ' modalidade'}</Td>
                                            <Td>{planos.status}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <button className="dash-button" onClick={handleShowCreate}>Criar Plano</button>
                            <button className="dash-button" onClick={handleShowUpdate}>Atualizar Plano</button>
                            <button className="dash-button" onClick={handleShowDelete}>Deletar Plano</button>
                        </div>
                        <div className="crud-inputs">
                            {showCreate && <Create handleSubmit={handleSubmit} formRef={formRef} />}
                            {showUpdate && <Update handleSubmitUpdate={handleSubmitUpdate} formRef={formRef} planos={showRead} />}
                            {showDelete && <Delete planos={showRead} handleSubmitDelete={handleSubmitDelete} formRef={formRef} />}

                        </div>

                    </div>
                </section>
            </>
        </AdmMain>

    )


}
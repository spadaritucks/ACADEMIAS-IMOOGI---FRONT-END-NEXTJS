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
import {getPacks,createPack,deletePack,updatePack} from '@/Components/api/PlanosRequest';
import { useModal } from '@/Components/errors/errorContext';
import { AdmMain } from '@/Layouts/AdmMain';
import UserSession from '@/Components/api/UserSession';



export default function Packs() {

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
            const response = await getPacks()
            setShowRead(response)

        }

        request()
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const sendFormdata = async () => {
                const response: any = await createPack(formdata)
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
            const id = formdata.get('pack_id')
            formdata.append('_method', 'PUT')

            if (id) {
                const sendFormdata = async () => {
                    const response: any = await updatePack(id, formdata)
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
            const id = formdata.get('pack_id')


            if (id) {
                const sendFormdata = async () => {
                    const response: any = await deletePack(id)
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
                <h1>Painel de Packs Especiais</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th style={{ textAlign: "center" } }>Nome do Pack</Th>
                                        <Th>Duração(em meses)</Th>
                                        <Th>Matricula</Th>
                                        <Th>Valor Mensal</Th>
                                        <Th>Valor Total</Th>
                                        <Th>N°Modalidades</Th>
                                        <Th>Status</Th>
                                        <Th>Numero de Checkins</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {showRead.map(pack => (
                                        <Tr key={pack.id}>
                                            <Td style={{ textAlign: "center" }}>{pack.nome_plano}</Td>
                                            <Td>{pack.duracao > 1 ? pack.duracao + ' meses' : pack.duracao + ' mês'}</Td>
                                            <Td>{'R$' + pack.valor_matricula}</Td>
                                            <Td>{'R$' + pack.valor_mensal}</Td>
                                            <Td>{'R$' + pack.valor_total}</Td>
                                            <Td>{pack.num_modalidades > 1 ? pack.num_modalidades + ' modalidades' : pack.num_modalidades + ' modalidade'}</Td>
                                            <Td>{pack.status}</Td>
                                            <Td>{pack.number_checkins}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <button className="dash-button" onClick={handleShowCreate}>Criar Pack</button>
                            <button className="dash-button" onClick={handleShowUpdate}>Atualizar Pack</button>
                            <button className="dash-button" onClick={handleShowDelete}>Deletar Pack</button>
                        </div>
                        <div className="crud-inputs">
                            {showCreate && <Create handleSubmit={handleSubmit} formRef={formRef} />}
                            {showUpdate && <Update handleSubmitUpdate={handleSubmitUpdate} formRef={formRef} packs={showRead} />}
                            {showDelete && <Delete packs={showRead} handleSubmitDelete={handleSubmitDelete} formRef={formRef} />}

                        </div>

                    </div>
                </section>
            </>
        </AdmMain>

    )


}
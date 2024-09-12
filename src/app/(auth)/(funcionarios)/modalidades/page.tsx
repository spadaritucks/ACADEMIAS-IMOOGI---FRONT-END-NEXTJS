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
import { useModal } from '@/Components/errors/errorContext';
import { createModalidade, deleteModalidade, getModalidade, updateModalidade } from '@/Components/api/ModalidadesRequest';
import Image from 'next/image';
import { AdmMain } from '@/Layouts/AdmMain';
import UserSession from '@/Components/api/UserSession';



export default function Modalidade() {

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
            const response = await getModalidade()
            setShowRead(response)

        }

        request()
    }

    useEffect(()=>{
        handleShowRead()
    },[])

    if (!user) {
        return null;
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const sendFormdata = async () => {
                const response: any = await createModalidade(formdata)
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
            const id = formdata.get('modalidade_id')
            formdata.append('_method', 'PUT')

            if (id) {
                const sendFormdata = async () => {
                    const response: any = await updateModalidade(id, formdata)
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
            const id = formdata.get('modalidade_id')


            if (id) {
                const sendFormdata = async () => {
                    const response: any = await deleteModalidade(id)
                    modalServer('Sucesso', response)
                    console.log(response)
                }
                sendFormdata()
            }

            handleShowRead()
        }

    }




    return (
        <AdmMain>
            <>
                <h1>Painel de Modalidades</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Foto da Modalidade</Th>
                                        <Th>Nome da Modaliade</Th>
                                        <Th>Descrição da Modalidade</Th>

                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {showRead.map(modalidades => (
                                        <Tr key={modalidades.id}>
                                            <Td> <Image width={70} height={70} src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${modalidades.foto_modalidade}`} alt=""></Image></Td>
                                            <Td>{modalidades.nome_modalidade}</Td>
                                            <Td>{modalidades.descricao_modalidade}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <button className="dash-button" onClick={handleShowCreate}>Criar Modalidade</button>
                            <button className="dash-button" onClick={handleShowUpdate}>Atualizar Modalidade</button>
                            <button className="dash-button" onClick={handleShowDelete}>Deletar Modalidade</button>
                        </div>
                        <div className="crud-inputs">
                            {showCreate && <Create handleSubmit={handleSubmit} formRef={formRef} />}
                            {showUpdate && <Update handleSubmitUpdate={handleSubmitUpdate} formRef={formRef} modalidades={showRead} />}
                            {showDelete && <Delete modalidades={showRead} handleSubmitDelete={handleSubmitDelete} formRef={formRef} />}

                        </div>

                    </div>
                </section>
            </>
        </AdmMain>

    )


}
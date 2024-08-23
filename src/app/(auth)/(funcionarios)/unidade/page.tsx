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
import Image from 'next/image';
import { createUnidade, deleteUnidade, getUnidades, updateUnidade } from '@/Components/api/UnidadesRequest';
import Link from 'next/link';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { AdmMain } from '@/Layouts/AdmMain';



export default function Unidades() {

    const [showCreate, setShowCreate] = useState<Boolean>(false);
    const [showUpdate, setShowUpdate] = useState<Boolean>(false);
    const [showRead, setShowRead] = useState<any[]>([]);
    const [showDelete, setShowDelete] = useState<Boolean>(false);


    const formRef = useRef<HTMLFormElement>(null)
    const { showModal } = useModal();

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
            const response = await getUnidades()
            setShowRead(response)

        }

        request()
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formRef.current) {
            const formdata = new FormData(formRef.current)
            const sendFormdata = async () => {
                const response: any = await createUnidade(formdata)
                showModal('Sucesso', response)
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
            const id = formdata.get('unidade_id')
            formdata.append('_method', 'PUT')

            if (id) {
                const sendFormdata = async () => {
                    const response: any = await updateUnidade(id, formdata)
                    showModal('Sucesso', response)
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
            const id = formdata.get('unidade_id')


            if (id) {
                const sendFormdata = async () => {
                    const response: any = await deleteUnidade(id)
                    showModal('Sucesso', response)
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
                <h1>Painel de Unidades</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Foto da Unidade</Th>
                                        <Th>Nome da Unidade</Th>
                                        <Th>Endereço</Th>
                                        <Th>Grade Horaria</Th>
                                        <Th>Descrição da Modalidade</Th>

                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {showRead.map(unidade => (
                                        <Tr key={unidade.id}>
                                            <Td> <Image width={70} height={70} src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${unidade.imagem_unidade}`} alt=""></Image></Td>
                                            <Td>{unidade.nome_unidade}</Td>
                                            <Td>{unidade.endereco}</Td>
                                            <Td><Link href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${unidade.grade}`}><div className='pdf-link' ><PictureAsPdfIcon /> PDF GRADE HORARIA</div></Link></Td>
                                            <Td>{unidade.descricao}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <button className="dash-button" onClick={handleShowCreate}>Criar Unidade</button>
                            <button className="dash-button" onClick={handleShowUpdate}>Atualizar Unidade</button>
                            <button className="dash-button" onClick={handleShowDelete}>Deletar Unidade</button>
                        </div>
                        <div className="crud-inputs">
                            {showCreate && <Create handleSubmit={handleSubmit} formRef={formRef} />}
                            {showUpdate && <Update handleSubmitUpdate={handleSubmitUpdate} formRef={formRef} unidades={showRead} />}
                            {showDelete && <Delete unidades={showRead} handleSubmitDelete={handleSubmitDelete} formRef={formRef} />}

                        </div>

                    </div>
                </section>
            </>
        </AdmMain>
    )


}
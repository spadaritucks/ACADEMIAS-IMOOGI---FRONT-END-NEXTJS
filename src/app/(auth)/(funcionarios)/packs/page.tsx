'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { useEffect, useRef, useState } from 'react';
import '../../../../Assets/css/pages-styles/dashboard.css'
import '../../../../Assets/css/pages-styles/crud.css'
import Create from './create';
import Update from './update';
import Delete from './delete';
import { getPacks, createPack, deletePack, updatePack } from '@/Components/api/PlanosRequest';
import { useModal } from '@/Components/errors/errorContext';
import { AdmMain } from '@/Layouts/AdmMain';
import UserSession from '@/Components/api/UserSession';



export default function Packs() {

    const [showCreate, setShowCreate] = useState<Boolean>(false);
    const [showUpdate, setShowUpdate] = useState<Boolean>(false);
    const [showRead, setShowRead] = useState<any[]>([]);
    const [showDelete, setShowDelete] = useState<Boolean>(false);
    const { user, setUser } = UserSession();
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
setIsLoading(true)
        try {
            const request = async () => {
                const response = await getPacks()
                setShowRead(response)

            }

            request()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
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
            <>
                <h1>Painel de Packs Especiais</h1>
                <section className="painel-crud">
                    <div className="tabela-crud">
                        <Table>
                            <TableCaption>Lista de Packs Especiais</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Nome do Pack</TableHead>
                                    <TableHead>Duração(em meses)</TableHead>
                                    <TableHead>Matricula</TableHead>
                                    <TableHead>Valor Mensal</TableHead>
                                    <TableHead>Valor Total</TableHead>
                                    <TableHead>N°Modalidades</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Numero de Checkins</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {showRead.map(pack => (
                                    <TableRow key={pack.id}>
                                        <TableCell className="text-center">{pack.nome_plano}</TableCell>
                                        <TableCell>{pack.duracao > 1 ? pack.duracao + ' meses' : pack.duracao + ' mês'}</TableCell>
                                        <TableCell>{'R$' + pack.valor_matricula}</TableCell>
                                        <TableCell>{'R$' + pack.valor_mensal}</TableCell>
                                        <TableCell>{'R$' + pack.valor_total}</TableCell>
                                        <TableCell>{pack.num_modalidades > 1 ? pack.num_modalidades + ' modalidades' : pack.num_modalidades + ' modalidade'}</TableCell>
                                        <TableCell>{pack.status}</TableCell>
                                        <TableCell>{pack.number_checkins}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="crud-operations">
                        <div className='crud-buttons'>
                            <Button variant="imoogi" onClick={handleShowCreate}>Criar Pack</Button>
                            <Button variant="imoogi" onClick={handleShowUpdate}>Atualizar Pack</Button>
                            <Button variant="imoogi" onClick={handleShowDelete}>Deletar Pack</Button>
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
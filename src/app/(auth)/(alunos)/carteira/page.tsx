'use client'

import UserSession from "@/Components/api/UserSession";
import { Contrato, getUsers, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { ClientMain } from "@/Layouts/ClientMain";
import Image from "next/image";
import { useEffect, useState } from "react";
import '@/Assets/css/pages-styles/area_aluno.css'
import logo from '../../../../../public/sistema imoogi.jpeg'

export default function carteiraAluno() {
    const { user, setUser } = UserSession();
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [modalidades, setModalidades] = useState<UsuarioModalidade[]>([])

    useEffect(() => {

        const handleContratos = async () => {
            const response = await getUsers()
            setContratos(response.contratos)
            setModalidades(response.modalidades)

        }
        handleContratos();

    }, [])

    if (!user) {
        return null;
    }

    const contrato = contratos.filter(contrato => contrato.usuario_id === user.id)
    const modalidade = modalidades.filter(modalidade => modalidade.usuario_id === user.id)
    const fotoUsuario = `${process.env.NEXT_PUBLIC_API_URL}/storage/${user.foto_usuario}`

    let nomeCompleto = user.nome;
    let partesNome = nomeCompleto.split(' ')
    let nome = partesNome.slice(0, 2).join(' ')

    return (
        <ClientMain>
            <h1>Carteira do Aluno</h1>
            <section className="menuAluno">

                <div className="area-carteira">
                    <Image src={logo} alt="" width={200} height={150}></Image>
                    <div className="dados-carteira">
                        <div className="foto-usuario-area">
                            <Image className="foto-usuario" src={fotoUsuario} alt="" width={150} height={150}></Image>
                        </div>
                        <div className="dados-usuario-area">
                            <h2 className="nome-usuario">{nome}</h2>
                            {contrato.map(contrato => (
                                <p className="nome-plano">{contrato.nome_plano}</p>
                            ))}
                            {modalidade.map(modalidade => (
                                <p className="nome-modalidade">{modalidade.nome_modalidade}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </ClientMain>
    )
}
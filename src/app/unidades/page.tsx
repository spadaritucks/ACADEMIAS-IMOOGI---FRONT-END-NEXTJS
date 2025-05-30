'use client'
import Image from "next/image";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Link from "next/link";
import { getUnidades, Unidade } from "@/api/UnidadesRequest";
import { useEffect, useState } from "react";
import '../../Assets/css/pages-styles/unidades_modalidades.css'
import { Main } from "@/layouts/home/layout";


export default function unidades() {

    const [unidades, setUnidades] = useState<Unidade[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchUnidades = async () => {
        const response = await getUnidades();
        setUnidades(response)
    }
    
    useEffect(() => {
        setIsLoading(true)
        try {
            fetchUnidades()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-2">Carregando dados...</p>
            </div>
        )
    }

    return (
        <Main>

            <section className="area-unidades">
                <h2>Unidades Academias IMOOGI</h2>
                <div className="unidades-container">

                    {unidades.map(unidade => (
                        <div className="unidade">
                            <Image width={300} height={250} className="unidade-imagem" alt="" src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${unidade.imagem_unidade?.replace('uploads/', '')}`}></Image>
                            <h2 className="unidade-title">{unidade.nome_unidade}</h2>
                            <p className="unidade-endereco">{unidade.endereco}</p>
                            <p className="unidade-descricao">{unidade.descricao}</p>
                            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${unidade.grade?.replace('uploads/', '')}`}>PDF GRADE HORARIA</Link>
                        </div>
                    ))}

                </div>
            </section>

        </Main>
    )
}
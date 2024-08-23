'use client'
import { getModalidade, Modalidade } from "@/Components/api/ModalidadesRequest"
import Image from "next/image"
import { useEffect, useState } from "react"
import '../../Assets/css/pages-styles/unidades_modalidades.css'
import { Main } from "@/Layouts/Main"

export default function modalidade() {

    const [modalidades, setModalidades] = useState<Modalidade[]>([])

    const fetchModalidades = async () => {
        const response = await getModalidade();
        setModalidades(response);

    }

    useEffect(() => {
        fetchModalidades()
    })

    return (
        <Main>
            <section className="area-modalidades">
                <h2>Modalidades Academias IMOOGI</h2>
                <div className="modalidades-container">
                    {modalidades.map(modalidade => (
                        <div className="modalidade">
                            <Image className="modalidade-imagem" width={300} height={300} alt="" src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${modalidade.foto_modalidade}`}></Image>
                            <h2 className="modalidade-title">{modalidade.nome_modalidade}</h2>
                            <p className="modalidade-endereco">{modalidade.descricao_modalidade}</p>
                        </div>
                    ))}

                </div>
            </section>
        </Main>

    )
}
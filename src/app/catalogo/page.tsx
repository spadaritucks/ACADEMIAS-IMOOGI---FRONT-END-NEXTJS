"use client"

import { getPlanos, Plano } from "@/Components/api/PlanosRequest"
import { Main } from "@/Layouts/Main"
import { useEffect, useState } from "react"
import '@/Assets/css/pages-styles/catalogo.css'
import Link from "next/link"



export default function Catalogo() {

    const [planos, setPlanos] = useState<Plano[]>([])

    const fetchPlanos = async () => {
        const listaPlanos = await getPlanos();
        const plano = listaPlanos.filter(listaPlanos => listaPlanos.status == "Ativo")
        setPlanos(plano)
    }

    useEffect(() => {
        fetchPlanos()
    }, [])

    return (
        <Main>
            <section className="catalogo-menu">
                <h1>Catalogo de Planos</h1>
                <div className="container-catalogo">
                    {planos.map(plano => (
                        <div className="plano">
                            <h2 className="plano-title">{plano.nome_plano}</h2>
                            <p className="number-modalidades">{plano.num_modalidades == 1 ? plano.num_modalidades + " Modalidade" :  plano.num_modalidades + " Modalidades" }</p>
                            <p className="month-value"><span style={{fontSize: 26, fontWeight: 'bold'}}>R$ {plano.valor_mensal} mensais</span> {plano.valor_matricula > 0 ? "&" + " R$ " + plano.valor_matricula + "(Matricula)": "Matricula Isenta" }</p>
                            <p className="total-value"> Total do Plano : R$ {plano.valor_total}</p> 

                            <Link href='https://api.whatsapp.com/send/?phone=11977010020&text&type=phone_number&app_absent=0' className="purchase-btn">Matricule-se</Link>
                        </div>
                    ))}
                </div>
            </section>
        </Main>
    )

}
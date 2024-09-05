'use client'

import UserSession from "@/Components/api/UserSession";
import { Contrato, getUsers, UsuarioModalidade } from "@/Components/api/UsuariosRequest";
import { ClientMain } from "@/Layouts/ClientMain";
import { FC, useEffect, useState } from "react";
import '@/Assets/css/pages-styles/area_aluno.css'
import logo from '../../../../../public/sistema imoogi.jpeg'
import Image from "next/image";
import ReactPDF, { PDFDownloadLink } from '@react-pdf/renderer';
import { border } from "@chakra-ui/react";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export default function carteiraAluno() {
    const { user, setUser } = UserSession();
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [modalidades, setModalidades] = useState<UsuarioModalidade[]>([])
    const [imgData, setImageData] = useState<any>()

    useEffect(() => {
        const convertBase64 = async () => {
            if (user) {
                const filename = user.foto_usuario.replace(/^uploads\//, ''); // Remove 'uploads/' do início
                const fotoUsuario = `${process.env.NEXT_PUBLIC_API_URL}/api/image/${encodeURIComponent(filename)}`;
                const response = await fetch(fotoUsuario);
                const data = await response.json();

                const imgData = data.image;
                setImageData(imgData)
            }

        }
        convertBase64()

    }, [user])

    
const downloadPDF = () => {
    const element = document.getElementById('area-carteira');
    if (element) {
        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('carteira_aluno.pdf');
        });
    } else {
        console.error('Elemento não encontrado.');
    }
};

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


    let nomeCompleto = user.nome;
    let partesNome = nomeCompleto.split(' ')
    let nome = partesNome.slice(0, 2).join(' ')




    return (
        <ClientMain>
            <h1>Carteira do Aluno</h1>
            <section className="menuAluno">
                <div className="area-carteira" id="area-carteira">
                    <Image src={logo} alt="" width={200} height={150}></Image>
                    <div className="dados-carteira">
                        <div className="foto-usuario-area">
                            <Image className="foto-usuario" src={imgData} alt="" width={150} height={150}></Image>
                        </div>
                        <div className="dados-usuario-area">
                            <div className="divDados">
                                <span>Nome:</span>
                                <p className="nome-usuario">{nome}</p>
                            </div>
                            <div className="divDados">
                                <span>Plano:</span>
                                {contrato.map(contrato => (
                                    <p className="nome-plano">{contrato.nome_plano}</p>
                                ))}
                            </div>
                            <div className="divDados">
                                <span>Modalidade:</span>
                                <div className="container-modalidades">
                                    {modalidade.map(modalidade => (

                                        <p className="nome-modalidade"> |{modalidade.nome_modalidade}| </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={downloadPDF} className="btn-pdf">Download PDF</button>
            </section>
            
        </ClientMain>
    )
}


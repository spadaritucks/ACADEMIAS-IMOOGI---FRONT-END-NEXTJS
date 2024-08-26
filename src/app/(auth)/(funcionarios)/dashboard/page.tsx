
'use client';
import '../../../../Assets/css/pages-styles/dashboard.css';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Center,
} from '@chakra-ui/react';

import { ModalEditUserProvider, useUserEditModal } from '@/Components/user-modals-edit/EditUserContext';
import EditUserModal from '@/Components/user-modals-edit/EditUserModal';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Usuarios } from '../usuarios/usuarios';
import { Contratos } from '../usuarios/contratos';
import Funcionario from '../usuarios/funcionario';
import '../../../../Assets/css/pages-styles/forms.css'
import { Contrato, DadosFuncionario, deleteUser, getUsers, updateUser, Usuario, UsuarioModalidade } from '@/Components/api/UsuariosRequest';
import Image from 'next/image';
import { DadosPessoais } from './DadosPessoais';
import { Informacoes } from './Informaçoes';
import { AdmMain } from '@/Layouts/AdmMain';
import { Chart } from "react-google-charts";


const Dashboard = () => {
    return (
        <AdmMain>
            <ModalEditUserProvider>
                <DashboardContent />
                <EditUserModal />
            </ModalEditUserProvider>
        </AdmMain>
    );
};

export interface UserFormProps {
    selectType?: string;
    user: Usuario; // Assumindo que Usuario é a interface para os dados do usuário
    contrato?: Contrato;
    funcionario?: DadosFuncionario;
    modalidade?: UsuarioModalidade[];
    formRef: React.RefObject<HTMLFormElement>;
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
}


const DashboardContent = () => {
    const { showModal } = useUserEditModal();
    const formRef = useRef<HTMLFormElement>(null);
    const [selectType, setSelectType] = useState<string>('');
    const [showContratos, setShowContratos] = useState<boolean>(false);
    const [showFuncionario, setShowFuncionario] = useState<boolean>(false);
    const [users, setUsers] = useState<Usuario[]>([]);
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [modalidades, setModalidades] = useState<UsuarioModalidade[]>([])
    const [funcionarios, setFuncionarios] = useState<DadosFuncionario[]>([])
    const [search, setSearch] = useState<string>('')
    const [openDadosPessoais, setOpenDadosPessoais] = useState<boolean>(false)
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [ativos, setAtivos] = useState<number>(0)
    const [renovacao, setRenovacao] = useState<number>(0)
    const [vencidos, setVencidos] = useState<number>(0)
    const [numAlunos, setNumAlunos] = useState<number>(0)

    const getUsersFunction = async () => {
        const response = await getUsers();
        setUsers(response.usuarios)
        setContratos(response.contratos)
        setModalidades(response.modalidades)
        setFuncionarios(response.funcionarios)


    }

    useEffect(() => {
        getUsersFunction()
    }, [])

    const handleDadosPessoais = (id: number) => {
        setOpenDadosPessoais(true)
        setOpenInfo(false)
        const user = users.find(user => user.id === id);
        showModal('Dados Pessoais', <DadosPessoais user={user} />)

    }

    const handleInformacoes = (id: number) => {
        setOpenDadosPessoais(false)
        setOpenInfo(true)
        const contrato = contratos.find(contrato => contrato.usuario_id === id);
        const funcionario = funcionarios.find(funcionario => funcionario?.usuario_id === id)
        const modalidade = modalidades.filter(modalidade => modalidade.usuario_id === id)
        showModal('Informações do Usuario', <Informacoes contrato={contrato} funcionario={funcionario} modalidade={modalidade} />)

    }



    const handleEditClickWithType = (id: number, title: string) => {
        const user = users.find(user => user.id === id);
        const contrato = contratos.find(contrato => contrato.usuario_id === id)
        const modalidade = modalidades.filter(modalidade => modalidade.usuario_id === id)
        const funcionario = funcionarios.find(funcionario => funcionario.usuario_id === id)

        const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (formRef.current) {
                const formdata = new FormData(formRef.current)
                const id = user?.id
                formdata.append('_method', 'PUT')

                if (id) {
                    const sendFormdata = async () => {
                        const response: any = await updateUser(id, formdata)
                        showModal('Sucesso', response)
                        console.log(response)
                    }
                    sendFormdata()
                }


            }
            getUsersFunction()
        }

        if (user) {
            setSelectType(user.tipo_usuario);
            showModal(title, (
                <UserForm selectType={user.tipo_usuario} user={user} formRef={formRef} contrato={contrato} funcionario={funcionario}
                    modalidade={modalidade} handleSubmitUpdate={handleSubmitUpdate} />
            ));
        }
    }


    const handleDeleteButton = async (id: number) => {
        const response = await deleteUser(id)
        showModal('Sucesso', response)
        getUsersFunction()
    }

    const handleStatusUser = (id: number) => {
        const contrato = contratos.find(contrato => contrato.usuario_id === id);
        if (contrato) {
            const dataHoje = new Date();
            const data_renovacao = new Date(contrato.data_renovacao || '');
            if (isNaN(data_renovacao.getTime())) {
                return 'Data inválida';
            }
            const diffInTime = data_renovacao.getTime() - dataHoje.getTime();
            const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));
            if (dias > 30) {
                return <p>{dias} dias restantes <br />Ativo</p>;
            } else if (dias <= 30 && dias > 0) {
                return <p>{dias} dias restantes <br />Renovação</p>;
            } else if (dias <= 0) {
                return <p>{dias} dias restantes <br />Vencido</p>;
            }
        } else {
            return 'Colaborador';
        }
    };



    //Prenchimento dos Graficos
    useEffect(() => {
        let ativosCount = 0;
        let renovacaoCount = 0;
        let vencidosCount = 0;
        let alunosCount

        users.forEach((user) => {
            const contrato = contratos.find(contrato => contrato.usuario_id === user.id);

            if (contrato) {
                const dataHoje = new Date();
                const data_renovacao = new Date(contrato.data_renovacao || '');

                if (!isNaN(data_renovacao.getTime())) {
                    const diffInTime = data_renovacao.getTime() - dataHoje.getTime();
                    const dias = Math.ceil(diffInTime / (1000 * 3600 * 24));

                    if (dias > 30) {
                        ativosCount++;
                    } else if (dias <= 30 && dias > 0) {
                        renovacaoCount++;
                    } else if (dias <= 0) {
                        vencidosCount++;
                    }
                }
            }
        });

        setAtivos(ativosCount);
        setRenovacao(renovacaoCount);
        setVencidos(vencidosCount);
        alunosCount = ativosCount+renovacaoCount

        setNumAlunos(alunosCount)

    }, [users, contratos]);

    function charts() {

        const dataBars = [
            ["Indice", "Planos Ativos", "Planos Renovação", "Planos Vencidos"],
            ["Planos", ativos, renovacao, vencidos],
        ];

        const dataPie = [
            ["Planos", "Porcentagem"],
            ["Planos Ativos", ativos],
            ["Planos Renovação", renovacao],
            ["Planos Vencidos", vencidos],
        ];

        const optionsPie = {
            title: "Porcentagem Realidade Alunos",
        };

        const optionsBars = {
            chart: {
                title: "ACADEMIAS IMOOGI",
                subtitle: "Realidade de Alunos",
            },
        };
        return (
            <>

                <div className="chart-container">
                    <Chart
                        chartType="Bar"
                        width="350px"
                        height="350px"
                        data={dataBars}
                        options={optionsBars} />
                </div>
                <div className="chart-container">
                    <Chart
                        chartType="PieChart"
                        data={dataPie}
                        options={optionsPie}
                        width={"400px"}
                        height={"400px"} />
                </div>



            </>
        );
    }

    useEffect(() => {
        setShowContratos(selectType === 'aluno');
        setShowFuncionario(selectType === 'funcionario');
    }, [selectType]);

    const filteredUsers = users.filter(user =>
        user.nome.toLowerCase().includes(search.toLowerCase())
    );






    return (
        <section className="dashboard">
            <div className="usuarios-list">
                <div className="painel">
                    <h2>Painel de Usuarios</h2>
                    <div className='search-bar-area'>
                        <span>Pesquisar</span>
                        <input type="text" placeholder="Pesquisar" className="search-input" onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="user-container alunos">
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th style={{ textAlign: "center" }}>ID</Th>
                                        <Th style={{ textAlign: "center" }}>Nome do Aluno</Th>
                                        <Th style={{ textAlign: "center" }}>Tipo do Usuario</Th>
                                        <Th style={{ textAlign: "center" }} >Ações</Th>
                                        <Th style={{ textAlign: "center" }}>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>

                                    {filteredUsers.map(users => (
                                        <Tr key={users.id} style={{ textAlign: "center" }}>
                                            <Td>{users.id}</Td>
                                            <Td style={{ textAlign: "center" }}>{users.nome}</Td>
                                            <Td style={{ textAlign: "center" }}>{users.tipo_usuario}</Td>
                                            <Td>
                                                <button className="dash-button" onClick={() => handleDadosPessoais(users.id)}>Dados Pessoais</button>

                                                <button className='dash-button' onClick={() => handleInformacoes(users.id)}>Informações</button>

                                                <button className="dash-button" onClick={() => handleEditClickWithType(users.id, 'Editar Usuarios')}>
                                                    Editar</button>
                                                <button className="dash-button" onClick={() => handleDeleteButton(users.id)}>Excluir</button>
                                            </Td>
                                            <Td style={{ textAlign: "center" }}>{handleStatusUser(users.id)}</Td>
                                        </Tr>
                                    ))}

                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>

            </div>

            <div className='charts-area'>
                {charts()}
                <div className='chart-container'>
                    <span>Numero de Alunos</span>
                    <p className='number-alunos'>{numAlunos}</p>
                </div>

            </div>
        </section>

    );

};

const UserForm = ({ selectType, user, contrato, modalidade, funcionario, formRef, handleSubmitUpdate }: UserFormProps) => {


    return (
        <form className="register-form" ref={formRef} onSubmit={handleSubmitUpdate}>
            <div className="form-component">
                <Usuarios formRef={formRef} user={user} contrato={contrato} modalidade={modalidade}
                    funcionario={funcionario} /> {/* Manter aqui apenas se necessário */}
            </div>
            <div className="form-component">
                {selectType === 'aluno' && <Contratos />}
                {selectType === 'funcionario' && <Funcionario />}
            </div>
            <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                <button type='submit' className='submit-button'>Enviar</button>
            </div>
        </form>
    );
}

export default Dashboard;
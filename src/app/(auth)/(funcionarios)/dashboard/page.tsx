
'use client';
import '../../../../Assets/css/pages-styles/dashboard.css';
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

import { ModalEditUserProvider, useUserEditModal } from '@/Components/user-modals-edit/EditUserContext';
import EditUserModal from '@/Components/user-modals-edit/EditUserModal';
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { Usuarios } from '../usuarios/usuarios';
import { Contratos } from '../usuarios/contratos';
import {Funcionario} from '../usuarios/funcionario';
import '../../../../Assets/css/pages-styles/forms.css'
import { Contrato, DadosFuncionario, deleteUser, getUsers, updateUser, updateUserModalidade, Usuario, UsuarioModalidade } from '@/Components/api/UsuariosRequest';
import Image from 'next/image';
import { DadosPessoais } from './DadosPessoais';
import { Informacoes } from './Informaçoes';
import { AdmMain } from '@/Layouts/AdmMain';
import { Chart } from "react-google-charts";
import { getModalidade, Modalidade } from '@/Components/api/ModalidadesRequest';
import UserSession from '@/Components/api/UserSession';
import { getPacks, Packs } from '@/Components/api/PlanosRequest';



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
    pack?: Packs;
    formRef: React.RefObject<HTMLFormElement>;
    handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface UserModalidadesProp {
    modalidade: UsuarioModalidade[];
    handleSubmitUpdateModalidade: (e: React.FormEvent<HTMLFormElement>) => void;
    formRef: React.RefObject<HTMLFormElement>;
}


const DashboardContent = () => {
    const { showModal } = useUserEditModal();
    const formRef = useRef<HTMLFormElement>(null);
    const [selectType, setSelectType] = useState<string>('');
    const [showContratos, setShowContratos] = useState<boolean>(false);
    const [showFuncionario, setShowFuncionario] = useState<boolean>(false);
    const [users, setUsers] = useState<Usuario[]>([]);
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [userModalidade, setUserModalidade] = useState<UsuarioModalidade[]>([])
    const [funcionarios, setFuncionarios] = useState<DadosFuncionario[]>([])
    const [packs, setPacks] = useState<Packs[]>([])
    const [search, setSearch] = useState<string>('')
    const [openDadosPessoais, setOpenDadosPessoais] = useState<boolean>(false)
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [ativos, setAtivos] = useState<number>(0)
    const [renovacao, setRenovacao] = useState<number>(0)
    const [vencidos, setVencidos] = useState<number>(0)
    const [numAlunos, setNumAlunos] = useState<number>(0)
    const { user, setUser } = UserSession();
   
    const getUsersFunction = async () => {
        const response = await getUsers();
        const responsePacks = await getPacks();
        setUsers(response.usuarios)
        setContratos(response.contratos)
        setUserModalidade(response.modalidades)
        setFuncionarios(response.funcionarios)
        setPacks(responsePacks)
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
        const modalidade = userModalidade.filter(modalidade => modalidade.usuario_id === id)
        const pack = packs.find(pack => pack.id === contrato?.packs_id);
        
        showModal('Informações do Usuario', <Informacoes pack={pack} contrato={contrato} funcionario={funcionario} modalidade={modalidade} />)
    }

    const handleEditClickWithType = (id: number, title: string) => {
        const user = users.find(user => user.id === id);
        const contrato = contratos.find(contrato => contrato.usuario_id === id)
        const modalidade = userModalidade.filter(modalidade => modalidade.usuario_id === id)
        const funcionario = funcionarios.find(funcionario => funcionario.usuario_id === id)
        const pack = packs.find(pack => pack.id === contrato?.packs_id);

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
                    modalidade={modalidade} handleSubmitUpdate={handleSubmitUpdate} pack={pack} />
            ));
        }
    }

    const handleUserModalidadeEdit = (id: number, title: string) => {
        const user = users.find(user => user.id === id)
        const modalidade = userModalidade.filter(modalidade => modalidade.usuario_id === id);

        const handleSubmitUpdateModalidade = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (formRef.current) {
                const formdata = new FormData(formRef.current)
                const id = user?.id
                console.log(formdata)
                formdata.append('_method', 'PUT')

                if (id) {
                    const sendFormdata = async () => {
                        const response: any = await updateUserModalidade(id, formdata);
                        showModal('Sucesso', response)
                        console.log(formdata)
                    }
                    sendFormdata()
                }
            }
            getUsersFunction()
        }
        
        showModal(title, <ModalidadeUserForm modalidade={modalidade} handleSubmitUpdateModalidade={handleSubmitUpdateModalidade} formRef={formRef} />)
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
        alunosCount = ativosCount + renovacaoCount

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
                        <Table>
                            <TableCaption>Lista de usuários</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">ID</TableHead>
                                    <TableHead className="text-center">Nome do Aluno</TableHead>
                                    <TableHead className="text-center">Tipo do Usuario</TableHead>
                                    <TableHead className="text-center">Ações</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="text-center">{user.id}</TableCell>
                                        <TableCell className="text-center">{user.nome}</TableCell>
                                        <TableCell className="text-center">{user.tipo_usuario}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center space-x-2">
                                                <Button variant="imoogi" size="sm" onClick={() => handleDadosPessoais(user.id)}>Dados Pessoais</Button>
                                                <Button variant="imoogi" size="sm" onClick={() => handleInformacoes(user.id)}>Informações</Button>
                                                <Button variant="imoogi" size="sm" onClick={() => handleEditClickWithType(user.id, 'Editar Usuarios')}>Editar</Button>
                                                {user.tipo_usuario === 'aluno' && (
                                                    <Button variant="imoogi" size="sm" onClick={() => handleUserModalidadeEdit(user.id, 'Modalidade Vinculadas')}>Modalidades</Button>
                                                )}
                                                <Button variant="imoogi" size="sm" onClick={() => handleDeleteButton(user.id)}>Excluir</Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{handleStatusUser(user.id)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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

const UserForm = ({ selectType, user, contrato, modalidade, funcionario, pack, formRef, handleSubmitUpdate }: UserFormProps) => {

    const handleInputClick = () => {
        if (user && formRef?.current) {
            const form = formRef.current;
            (form['tipo_usuario'] as HTMLSelectElement).value = user.tipo_usuario.toString();
            (form['nome'] as HTMLInputElement).value = user.nome.toString();
            (form['email'] as HTMLInputElement).value = user.email.toString();
            (form['data_nascimento'] as HTMLInputElement).value = user.data_nascimento.toString();
            (form['cpf'] as HTMLInputElement).value = user.cpf.toString();
            (form['rg'] as HTMLInputElement).value = user.rg.toString();
            (form['telefone'] as HTMLInputElement).value = user.telefone.toString();
            (form['cep'] as HTMLInputElement).value = user.cep.toString();
            (form['logradouro'] as HTMLInputElement).value = user.logradouro.toString();
            (form['numero'] as HTMLInputElement).value = user.numero.toString();
            user.complemento ? (form['complemento'] as HTMLInputElement).value = user.complemento.toString() : ''
            if (contrato && modalidade) {
                (form['planos_id'] as HTMLSelectElement).value = contrato.planos_id.toString();
                {pack ? (form['packs_id'] as HTMLSelectElement).value = contrato.packs_id.toString() : ''}
                (form['data_inicio'] as HTMLInputElement).value = contrato.data_inicio.toString();
                (form['data_renovacao'] as HTMLInputElement).value = contrato.data_renovacao.toString();
                (form['data_vencimento'] as HTMLInputElement).value = contrato.data_vencimento.toString();
                (form['valor_plano'] as HTMLInputElement).value = contrato.valor_plano.toString();
                (form['desconto'] as HTMLInputElement).value = contrato.desconto.toString();
                (form['parcelas'] as HTMLInputElement).value = contrato.parcelas.toString();
                (form['observacoes'] as HTMLInputElement).value = contrato.observacoes.toString();
            }
            if (funcionario) {
                (form['tipo_funcionario'] as HTMLSelectElement).value = funcionario.tipo_funcionario.toString();
                (form['cargo'] as HTMLInputElement).value = funcionario.cargo.toString();
                (form['atividades'] as HTMLInputElement).value = funcionario.atividades.toString();
            }

        }
    }

    useEffect(() => {
        handleInputClick();
    }, [user, contrato, modalidade, funcionario])



    return (
        <form className="register-form" ref={formRef} onSubmit={handleSubmitUpdate}>
            <div className="form-component">
                <Usuarios  handleInputClick={handleInputClick} formRef={formRef} user={user} contrato={contrato} modalidade={modalidade}
                    funcionario={funcionario} /> {/* Manter aqui apenas se necessário */}
            </div>
            <div className="form-component">
                {selectType === 'aluno' && <Contratos user={user} modalidade={modalidade} handleInputClick={handleInputClick} contrato={contrato} />}
                {selectType === 'funcionario' && <Funcionario />}
            </div>
            <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                <button type='submit' className='submit-button'>Enviar</button>
            </div>
        </form>
    );
}

const ModalidadeUserForm = ({ modalidade,handleSubmitUpdateModalidade,formRef }: UserModalidadesProp) => {

    const [modalidades, setModalidades] = useState<Modalidade[]>([])
    const [inputModalidadeState, setInputModalidadeState] = useState<boolean>(false)
    const toogleInputModalidade = () => {
        setInputModalidadeState(prevState => !prevState);
    }


    useEffect(() => {
        const fetchModalidades = async () => {
            try {
                const modalidades = await getModalidade();
                setModalidades(modalidades);
            } catch (error) {
                console.error('Failed to fetch modalidades:', error);
            }
        };
        fetchModalidades()
    })

    return (
        <>
            <form className="register-form" onSubmit={handleSubmitUpdateModalidade} ref={formRef} >
                <div className="form-component" style={{display:'flex', alignItems:'flex-start', justifyContent:'flex-start'}}>
                    <div className="form-name-input">
                        <span>Modalidade 1</span>
                        <select name="modalidade_id[]" id="modalidade_id" >
                        <option value="" >Selecione</option>
                            {modalidades.map((modalidade) => (
                                <option value={modalidade.id}>
                                    {modalidade.nome_modalidade}
                                </option>
                            ))}
                        </select>
                        <button type='reset' className='insertMoreOne' onClick={toogleInputModalidade}> + 1 Modalidade</button>
                    </div>
                    <div className={`form-name-input modalidadeForm ${inputModalidadeState ? `flex` : 'none'}`} >
                        <span>Modalidade 2</span>
                        <select name="modalidade_id[]" id="modalidade_id" disabled = {!inputModalidadeState}>
                        <option value="" >Selecione</option>
                            {modalidades.map((modalidade) => (
                                <option value={modalidade.id}>
                                    {modalidade.nome_modalidade}
                                </option>
                            ))}
                        </select>
                    </div>
                   
                </div>
                <div className="form-name-input" style={{ gridColumn: '1 / -1' }}>
                        <button type='submit' className='submit-button'>Enviar</button>
                    </div>
            </form>
        </>
    )
}



export default Dashboard;
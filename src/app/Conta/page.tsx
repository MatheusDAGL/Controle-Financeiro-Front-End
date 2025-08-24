'use client'

import { useEffect, useState } from "react"
import { Conta } from "@/types/Conta"
import axios from 'axios';
import Form from "../Components/Form";
import Table from "../Components/Table";
import MenuDropdown from "../Components/MenuDropdown";
import { Pessoa } from "@/types/Pessoa";

export default function ContaPage() {

    const [contas, setContas] = useState<Conta[]>([]);
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pessoaId, setPessoaId] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    const [valor, setValor] = useState<string>("");
    const [dataVencimento, setDataVencimento] = useState<string>("");
    const [dataPagamento, setDataPagamento] = useState<string>("");

    const [editId, setEditId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Conta>>({});

    const handleEditChange = (key: keyof Conta, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    };


    const getContas = async () => {
        try {
            let token = localStorage.getItem("token");
            const res = await axios.get('https://localhost:443/ControleFinanceiro/api/Conta', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setContas(res.data);
        } catch (erro) {
            alert("Erro de carregamento");
        }
        setLoading(false);
    }


    const getPessoas = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://localhost:443/ControleFinanceiro/api/Pessoa", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setPessoas(res.data);
        } catch (err) {
            alert("Erro ao buscar pessoas" + err);
        }
    };

    const getNomePessoa = (id: string | number) => {
        const pessoa = pessoas.find(p => String(p.id) === String(id));
        return pessoa ? pessoa.nome : "Pessoa não encontrada";
    };
    useEffect(() => {
        getContas();
        getPessoas();
    }, []);

    const PostContas = async () => {
        try {
            let token = localStorage.getItem("token");
            await axios.post(
                "https://localhost:443/ControleFinanceiro/api/Conta",
                { pessoaId: pessoaId, descricao: descricao, valor: valor, dataVencimento: dataVencimento, dataPagamento: dataPagamento.trim() ? dataPagamento : null },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setPessoaId("");
            setDescricao("");
            setValor("");
            setDataVencimento("");
            setDataPagamento("");
        } catch (err: any) {
            if (err.response.status === 403 || err.response.status === 401) {
                alert("Você não tem permissão para realizar essa ação.");
            } else {
                alert("Erro ao adicionar conta")
            };
        };
        getContas();
    }

    const PutContas = async (id: number, updatedData: Partial<Conta>) => {
        try {
            let token = localStorage.getItem("token");
            await axios.put(
                "https://localhost:443/ControleFinanceiro/api/Conta",
                {
                    id,
                    pessoaId: updatedData.pessoaId,
                    descricao: updatedData.descricao,
                    valor: updatedData.valor,
                    dataVencimento: updatedData.dataVencimento,
                    dataPagamento: updatedData.dataPagamento
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
        } catch (err: any) {
            if (err.response.status === 403 || err.response.status === 401) {
                alert("Você não tem permissão para realizar essa ação.");
            } else {
                alert("Erro ao atualizar a conta")
            };
        }
        setEditId(null);
        getContas();
    };

    const DeleteContas = async (id: number) => {
        try {
            let token = localStorage.getItem("token");
            await axios.delete(
                'https://localhost:443/ControleFinanceiro/api/Conta/' + id,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
        } catch (err: any) {
            if (err.response.status === 403 || err.response.status === 401) {
                alert("Você não tem permissão para realizar essa ação.");
            } else {
                alert("Erro ao deletar conta")
            };
        }
        getContas();
    }

    return (
        <>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 pt-2 pl-2">
                <MenuDropdown />
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-6">

                <Form
                    loading={loading}
                    submitLabel="Adicionar Conta"
                    onSubmit={PostContas}
                    fields={[
                        {
                            name: "pessoaId",
                            placeholder: "Id da Pessoa",
                            value: pessoaId,
                            onChange: (e) => setPessoaId(e.target.value),
                        },
                        {
                            name: "descricao",
                            placeholder: "Descrição",
                            value: descricao,
                            onChange: (e) => setDescricao(e.target.value),
                        },
                        {
                            name: "valor",
                            placeholder: "Valor",
                            value: valor,
                            onChange: (e) => setValor(e.target.value),
                        },
                        {
                            name: "dataVencimento",
                            placeholder: "Data de Vencimento",
                            value: dataVencimento,
                            onChange: (e) => setDataVencimento(e.target.value),
                        },
                        {
                            name: "dataPagamento",
                            placeholder: "Data de Pagamento",
                            value: dataPagamento,
                            onChange: (e) => setDataPagamento(e.target.value),
                        }
                    ]}
                />

                <Table<Conta>
                    data={contas}
                    columns={[
                        { key: "pessoaId", label: "Nome da pessoa", editable: true, render: (valor) => getNomePessoa(valor) },
                        { key: "descricao", label: "Descrição", editable: true },
                        { key: "valor", label: "Valor", editable: true },
                        { key: "dataVencimento", label: "Vencimento", editable: true, render: (value) => new Date(value).toLocaleDateString("pt-BR") },
                        {
                            key: "dataPagamento", label: "Pagamento", editable: true, render: (value) => value
                                ? new Date(value).toLocaleDateString("pt-BR")
                                : "Em aberto"
                        },
                    ]}
                    loading={loading}
                    editId={editId}
                    editValues={editValues}
                    onEditChange={handleEditChange}
                    startEdit={(contas) => {
                        setEditId(contas.id);
                        setEditValues({
                            pessoaId: contas.pessoaId,
                            descricao: contas.descricao,
                            valor: contas.valor,
                            dataVencimento: contas.dataVencimento,
                            dataPagamento: contas.dataPagamento
                        });
                    }}
                    cancelEdit={() => {
                        setEditId(null);
                        setEditValues({});
                    }}
                    onSave={(id, data) => {
                        PutContas(id, data)
                    }}
                    onDelete={(id) => {
                        DeleteContas(id)
                    }}
                    chave="id"
                />

            </div>
        </>
    );
}
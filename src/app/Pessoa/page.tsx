'use client'

import { useEffect, useState } from "react"
import { Pessoa } from "@/types/Pessoa"
import axios from 'axios';
import Form from "../Components/Form";
import Table from "../Components/Table";
import MenuDropdown from "../Components/MenuDropdown";

export default function PessoaPage() {

    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nome, setNome] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [salario, setSalario] = useState<string>("");

    const [editId, setEditId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Pessoa>>({});

    const handleEditChange = (key: keyof Pessoa, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    };


    const getPessoas = async () => {
        try {
            let token = localStorage.getItem("token");
            const res = await axios.get('https://localhost:443/ControleFinanceiro/api/Pessoa', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setPessoas(res.data);
        } catch (erro) {
            alert("Erro de carregamento");
        }
        setLoading(false);
    }

    useEffect(() => {
        getPessoas();
    }, []);

    const PostPessoas = async () => {
        try {
            let token = localStorage.getItem("token");
            await axios.post(
                "https://localhost:443/ControleFinanceiro/api/Pessoa",
                { nome: nome, email: email, salario: salario },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setNome("");
            setEmail("");
            setSalario("");
        } catch (err: any) {
            if (err.response.status === 403 || err.response.status === 401) {
                alert("Você não tem permissão para realizar essa ação.");
            } else {
                alert("Erro ao adicionar pessoa")
            };
        };
        getPessoas();
    }

    const PutCidades = async (id: number, updatedData: Partial<Pessoa>) => {
        try {
            let token = localStorage.getItem("token");
            await axios.put(
                "https://localhost:443/ControleFinanceiro/api/Pessoa",
                {
                    id,
                    nome: updatedData.nome,
                    email: updatedData.email,
                    salario: updatedData.salario
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
                alert("Erro ao atualizar pessoa")
            };
        }
        setEditId(null);
        getPessoas();
    };

    const DeletePessoas = async (id: number) => {
        try {
            let token = localStorage.getItem("token");
            await axios.delete(
                'https://localhost:443/ControleFinanceiro/api/Pessoa/' + id,
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
                alert("Erro ao deletar pessoa")
            };
        }
        getPessoas();
    }

    return (
        <>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 pt-2 pl-2">
              <MenuDropdown />
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-6">

                <Form
                    loading={loading}
                    submitLabel="Adicionar Pessoa"
                    onSubmit={PostPessoas}
                    fields={[
                        {
                            name: "nome",
                            placeholder: "Nome",
                            value: nome,
                            onChange: (e) => setNome(e.target.value),
                        },
                        {
                            name: "email",
                            placeholder: "Email",
                            value: email,
                            onChange: (e) => setEmail(e.target.value),
                        },
                                                {
                            name: "salario",
                            placeholder: "Salário",
                            value: salario,
                            onChange: (e) => setSalario(e.target.value),
                        }
                    ]}
                />

                <Table<Pessoa>
                    data={pessoas}
                    columns={[
                        { key: "id", label: "Id", editable: false },
                        { key: "nome", label: "Nome", editable: true },
                        { key: "email", label: "Email", editable: true },
                        { key: "salario", label: "Salário", editable: true },
                    ]}
                    loading={loading}
                    editId={editId}
                    editValues={editValues}
                    onEditChange={handleEditChange}
                    startEdit={(pessoa) => {
                        setEditId(pessoa.id);
                        setEditValues({ nome: pessoa.nome, email: pessoa.email, salario: pessoa.salario });
                    }}
                    cancelEdit={() => {
                        setEditId(null);
                        setEditValues({});
                    }}
                    onSave={(id, data) => {
                        PutCidades(id, data)
                    }}
                    onDelete={(id) => {
                        DeletePessoas(id)
                    }}
                    chave="id"
                />

            </div>
        </>
    );
}
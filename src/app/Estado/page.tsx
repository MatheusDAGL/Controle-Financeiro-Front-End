'use client'

import { useEffect, useState } from "react"
import { Estado } from "@/types/Estado"
import axios from 'axios';
import Form from "../Components/Form";
import Table from "../Components/Table";
import MenuDropdown from "../Components/MenuDropdown";

export default function EstadoPage() {

    const [estados, setEstados] = useState<Estado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nome, setNome] = useState<string>("");
    const [sigla, setSigla] = useState<string>("");

    const [editId, setEditId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<Estado>>({});

    const handleEditChange = (key: keyof Estado, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    };


    const getEstados = async () => {
        try {
            let token = localStorage.getItem("token");
            const res = await axios.get('https://localhost:443/ControleFinanceiro/api/Estado', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setEstados(res.data);
        } catch (erro) {
            alert("Erro de carregamento");
        }
        setLoading(false);
    }

    useEffect(() => {
        getEstados();
    }, []);

    const PostEstados = async () => {
        if (!nome || !sigla) {
            alert("Preencha todos os campos");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "https://localhost:443/ControleFinanceiro/api/Estado",
                { nome, sigla },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setNome("");
            setSigla("");
            getEstados();
        } catch (err: any) {
            if (err.response.status === 403 || err.response.status === 401) {
                alert("Você não tem permissão para realizar essa ação.");
            } else {
                alert("Erro ao adicionar estado")
            };
        } finally {
            setLoading(false);
        }
    }

    const PutEstados = async (siglaOriginal: string, updatedData: Partial<Estado>) => {
        try {
            let token = localStorage.getItem("token");
            await axios.put(
                "https://localhost:443/ControleFinanceiro/api/Estado",
                {
                    sigla: updatedData.sigla,
                    nome: updatedData.nome
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
                alert("Erro ao atualizar estado")
            };
        }
        setEditId(null);
        getEstados();
    };

    const DeleteEstados = async (sigla: string) => {
        try {
            let token = localStorage.getItem("token");
            await axios.delete(
                'https://localhost:443/ControleFinanceiro/api/Estado/' + sigla,
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
                alert("Erro ao deletar o estado")
            };
        }
        getEstados();
    }

    return (
        <>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 pt-2 pl-2">
                <MenuDropdown />
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-6">

                <Form
                    loading={loading}
                    submitLabel="Adicionar Estado"
                    onSubmit={PostEstados}
                    fields={[
                        {
                            name: "nome",
                            placeholder: "Nome do estado",
                            value: nome,
                            onChange: (e) => setNome(e.target.value),
                        },
                        {
                            name: "sigla",
                            placeholder: "Sigla do estado",
                            value: sigla,
                            onChange: (e) => setSigla(e.target.value),
                        },
                    ]}
                />
                <Table<Estado>
                    data={estados}
                    columns={[
                        { key: "nome", label: "Nome do Estado", editable: true },
                        { key: "sigla", label: "Sigla do Estado", editable: true },
                    ]}
                    loading={loading}
                    editId={editId}
                    editValues={editValues}
                    onEditChange={handleEditChange}
                    startEdit={(estado) => {
                        setEditId(estado.sigla);
                        setEditValues({ nome: estado.nome, sigla: estado.sigla });
                    }}
                    cancelEdit={() => {
                        setEditId(null);
                        setEditValues({});
                    }}
                    onSave={(chave, data) => {
                        PutEstados(chave, data)
                    }}
                    onDelete={(sigla) => {
                        DeleteEstados(sigla)
                    }}
                    chave="sigla"
                />

            </div>
        </>
    );
}
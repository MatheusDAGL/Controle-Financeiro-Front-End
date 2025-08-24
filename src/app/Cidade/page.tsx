'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { Cidade } from "@/types/Cidade"
import axios from 'axios';
import Form from "../Components/Form";
import Table from "../Components/Table";
import MenuDropdown from "../Components/MenuDropdown";

export default function CidadePage() {

    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nome, setNome] = useState<string>("");
    const [sigla, setSigla] = useState<string>("");

    const [editId, setEditId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<Cidade>>({});

    const handleEditChange = (key: keyof Cidade, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    };


    const getCidades = async () => {
        try {
            let token = localStorage.getItem("token");
            const res = await axios.get('https://localhost:443/ControleFinanceiro/api/Cidade', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setCidades(res.data);
        } catch (erro) {
            alert("Erro de carregamento");
        }
        setLoading(false);
    }

    useEffect(() => {
        getCidades();
    }, []);

    const PostCidades = async () => {
        if (!nome || !sigla) {
            alert("Preencha todos os campos");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "https://localhost:443/ControleFinanceiro/api/Cidade",
                { nome: nome, estadoSigla: sigla },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setNome("");
            setSigla("");
            getCidades();
        } catch (err: any) {
            if (err.response.status === 403 || err.response.status === 401) {
                alert("Você não tem permissão para realizar essa ação.");
            } else {
                alert("Erro ao adicionar cidade")
            };
        } finally {
            setLoading(false);
        }
    }

    const PutCidades = async (id: number, updatedData: Partial<Cidade>) => {
        try {
            let token = localStorage.getItem("token");
            await axios.put(
                "https://localhost:443/ControleFinanceiro/api/Cidade",
                {
                    id,
                    nome: updatedData.nome,
                    estadoSigla: updatedData.estadoSigla
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
                alert("Erro ao atualizar cidade")
            };
        }
        setEditId(null);
        getCidades();
    };

    const DeleteCidades = async (id: number) => {
        try {
            let token = localStorage.getItem("token");
            await axios.delete(
                'https://localhost:443/ControleFinanceiro/api/Cidade/' + id,
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
                alert("Erro ao deletar cidade")
            };
        }
        getCidades();
    }

    return (
        <>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 pt-2 pl-2">
                <MenuDropdown />
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-6">

                <Form
                    loading={loading}
                    submitLabel="Adicionar Cidade"
                    onSubmit={PostCidades}
                    fields={[
                        {
                            name: "nome",
                            placeholder: "Nome da cidade",
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

                <Table<Cidade>
                    data={cidades}
                    columns={[
                        { key: "id", label: "Id", editable: false },
                        { key: "nome", label: "Nome da Cidade", editable: true },
                        { key: "estadoSigla", label: "Sigla do Estado", editable: true },
                    ]}
                    loading={loading}
                    editId={editId}
                    editValues={editValues}
                    onEditChange={handleEditChange}
                    startEdit={(cidade) => {
                        setEditId(cidade.id);
                        setEditValues({ nome: cidade.nome, estadoSigla: cidade.estadoSigla });
                    }}
                    cancelEdit={() => {
                        setEditId(null);
                        setEditValues({});
                    }}
                    onSave={(id, data) => {
                        PutCidades(id, data)
                    }}
                    onDelete={(id) => {
                        DeleteCidades(id)
                    }}
                    chave="id"
                />

            </div>
        </>
    );
}
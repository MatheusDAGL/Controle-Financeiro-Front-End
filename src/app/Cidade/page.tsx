'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { Cidade } from "@/types/Cidade"
import axios from 'axios';
import { Pencil, Trash, Check, X } from "lucide-react";

export default function CidadePage() {

    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nome, setNome] = useState<string>("");
    const [sigla, setSigla] = useState<string>("");

    // Estados para edição inline
    const [editId, setEditId] = useState<number | null>(null);
    const [editNome, setEditNome] = useState<string>("");
    const [editSigla, setEditSigla] = useState<string>("");

    const handleNome = (e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value);
    const handleSigla = (e: ChangeEvent<HTMLInputElement>) => setSigla(e.target.value);

    const handleEditNome = (e: ChangeEvent<HTMLInputElement>) => setEditNome(e.target.value);
    const handleEditSigla = (e: ChangeEvent<HTMLInputElement>) => setEditSigla(e.target.value);

    // GET
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

    // POST
    const PostCidades = async () => {
        try {
            let token = localStorage.getItem("token");
            await axios.post(
                "https://localhost:443/ControleFinanceiro/api/Cidade",
                { nome: nome, estadoSigla: sigla },
                { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setNome("");
            setSigla("");
        } catch (err: any) {
            alert("Erro ao adicionar cidade");
        };
        getCidades();
    }

    // PUT
    const PutCidades = async (id: number, novoNome: string, novoSigla: string) => {
        try {
            let token = localStorage.getItem("token");
            await axios.put(
                'https://localhost:443/ControleFinanceiro/api/Cidade',
                { id, nome: novoNome, estadoSigla: novoSigla },
                { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
            );
        } catch (err: any) {
            alert("Erro ao atualizar cidade");
        }
        setEditId(null); // sai do modo edição
        getCidades();
    }

    // DELETE
    const DeleteCidades = async (id: number) => {
        try {
            let token = localStorage.getItem("token");
            await axios.delete(
                'https://localhost:443/ControleFinanceiro/api/Cidade/' + id,
                { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
            );
        } catch (err: any) {
            alert("Erro ao deletar cidade");
        }
        getCidades();
    }

    // Ativa modo edição
    const startEdit = (cidade: Cidade) => {
        setEditId(cidade.id);
        setEditNome(cidade.nome);
        setEditSigla(cidade.estadoSigla);
    }

    // Cancela edição
    const cancelEdit = () => setEditId(null);

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                {/* Formulário de cadastro */}
                <form className="flex flex-col space-y-4 w-full max-w-md" onSubmit={e => e.preventDefault()}>
                    <input
                        placeholder="Nome da cidade"
                        type="text"
                        value={nome}
                        onChange={handleNome}
                        className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        placeholder="Sigla do estado"
                        type="text"
                        value={sigla}
                        onChange={handleSigla}
                        className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={PostCidades}
                        type="button"
                        disabled={loading}
                        className={`w-full rounded-lg px-4 py-3 text-white font-semibold transition duration-200 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Carregando..." : "Adicionar Cidade"}
                    </button>
                </form>

                {/* Lista de cidades */}
                <div className="mt-8 w-full max-w-3xl">
                    {loading && "Carregando..."}
                    {!loading && cidades.length > 0 && (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Nome da Cidade</th>
                                    <th className="px-4 py-2 font-semibold">Sigla do Estado</th>
                                    <th className="px-4 py-2 font-semibold text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cidades.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-2">
                                            {editId === item.id ? (
                                                <input
                                                    value={editNome}
                                                    onChange={handleEditNome}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            ) : (
                                                item.nome
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {editId === item.id ? (
                                                <input
                                                    value={editSigla}
                                                    onChange={handleEditSigla}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            ) : (
                                                item.estadoSigla
                                            )}
                                        </td>
                                        <td className="px-4 py-2 flex gap-2 justify-center">
                                            {editId === item.id ? (
                                                <>
                                                    <button
                                                        onClick={() => PutCidades(item.id, editNome, editSigla)}
                                                        className="text-green-500 hover:text-green-700"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="px-4 text-blue-500 hover:text-blue-700"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => DeleteCidades(item.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && cidades.length === 0 && "Não há cidades para exibir."}
                </div>
            </div>
        </>
    );
}

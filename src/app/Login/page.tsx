'use client';

import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleUsuario = (e: ChangeEvent<HTMLInputElement>) => setUsuario(e.target.value);
  const handleSenha = (e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value);

  const handleFazerLogin = async () => {
    setErro(""); 
    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:443/ControleFinanceiro/api/Usuario/Login",
        {
          login:usuario, senha:senha 
        })

      localStorage.setItem("token", response.data.token);

      router.push("/Home");
    } catch (err: any) {
      setErro("Erro ao tentar fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Fazer Login
        </h1>

        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            placeholder="Nome de usuário"
            type="text"
            value={usuario}
            onChange={handleUsuario}
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={handleSenha}
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {erro && (
            <div className="text-red-600 text-sm text-center">{erro}</div>
          )}

          <button
            onClick={handleFazerLogin}
            type="button"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-3 text-white font-semibold transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Carregando..." : "Fazer Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

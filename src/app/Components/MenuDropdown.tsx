"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dropdown() {
  const [cadastroIsOpen, csetIsOpen] = useState(false);
  const [lancamentoIsOpen, lsetIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex gap-4">
      <div className="cursor-pointer relative inline-block text-left">
        <button
          onClick={() => csetIsOpen(!cadastroIsOpen)}
          className="inline-flex w-full justify-center rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={cadastroIsOpen}
        > Cadastro
        </button>

        {cadastroIsOpen && (
          <ul
            className="absolute mt-2 w-24 origin-center rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 text-black flex flex-col items-center text-center"
            aria-labelledby="dropdownMenuLink"
          >
            <li
              onClick={() => router.push("/Cidade")}>
              Cidade
            </li>
            <li
              onClick={() => router.push("/Estado")}>
              Estado
            </li>
            <li
              onClick={() => router.push("/Pessoa")}>
              Pessoa
            </li>
          </ul>
        )}
      </div>
      <div className="cursor-pointer relative inline-block text-left">
        <button
          onClick={() => lsetIsOpen(!lancamentoIsOpen)}
          className="inline-flex w-full justify-center rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={lancamentoIsOpen}
        > Lançamento
        </button>

        {lancamentoIsOpen && (
          <ul
            className="absolute mt-2 w-full origin-center rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 text-black flex flex-col items-center text-center"
            aria-labelledby="dropdownMenuLink"
          >
            <li className="px-4"
              onClick={() => router.push("/Conta")}>
              Conta
            </li>
          </ul>
        )}
      </div>

      <div className="cursor-pointer relative inline-block text-left">
        <button 
          onClick={() => router.push("/Login")}
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-800 focus:outline-none"
        > Sair
        </button>
      </div>
    </div>
  );
}

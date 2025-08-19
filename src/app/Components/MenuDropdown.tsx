"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full justify-center rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      > Cadastro
      </button>

      {isOpen && (
        <ul
          className="absolute mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          aria-labelledby="dropdownMenuLink"
        >
          <li
          onClick={()=>router.push("/Cidade")}>
              Cidade
          </li>
          <li
          onClick={()=>router.push("/Estado")}>
              Estado
          </li>
          <li
          onClick={()=>router.push("/Pessoa")}>
              Pessoa
          </li>
        </ul>
      )}
    </div>
  );
}

'use client'

import { ChangeEvent } from "react";

type Field = {
  name: string; 
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

type GenericFormProps = {
  fields: Field[];
  loading: boolean;
  submitLabel?: string;
  onSubmit: () => void;
};

export default function Form({
  fields,
  loading,
  submitLabel = "Enviar",
  onSubmit
}: GenericFormProps) {
  return (
    <form
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl flex flex-col space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      {fields.map((field) => (
        <input
          key={field.name}
          placeholder={field.placeholder}
          type={field.type || "text"}
          value={field.value}
          onChange={field.onChange}
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ))}
      
      <button
        onClick={onSubmit}
        type="button"
        disabled={loading}
        className={`w-full rounded-lg px-4 py-3 text-white font-semibold transition duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Carregando..." : submitLabel}
      </button>
    </form>
  );
}
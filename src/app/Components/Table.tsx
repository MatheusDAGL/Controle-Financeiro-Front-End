"use client";

import { Pencil, Trash, Check, X } from "lucide-react";
import React from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  editable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  editId: any;
  editValues: Partial<T>;
  onEditChange: (key: keyof T, value: string) => void;
  startEdit: (item: T) => void;
  cancelEdit: () => void;
  onSave: (id: any, updatedData: Partial<T>) => void;
  onDelete: (id: any) => void;
  chave: keyof T;
}

export default function GenericTable<T extends { id: any }>({
  data,
  columns,
  loading,
  editId,
  editValues,
  onEditChange,
  startEdit,
  cancelEdit,
  onSave,
  onDelete,
  chave
}: GenericTableProps<T>) {
  return (
    <div className="mt-8 w-full max-w-5xl bg-white rounded-2xl shadow-md p-4">
      {loading && <p>Carregando...</p>}

      {!loading && data.length > 0 && (
        <table className="w-full text-left text-gray-700 border-collapse">
          <thead className="bg-gray-500">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2 text-white">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-2 text-white text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={String(item[chave])} className="border-t">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-2">
                    {editId === item[chave] && col.editable ? (
                      <input
                        value={String(editValues[col.key] ?? "")}
                        onChange={(e) => onEditChange(col.key, e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : col.render ? (
                      col.render(item[col.key], item)
                    ) : (
                      String(item[col.key] ?? "")
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 flex gap-2 justify-center">
                  {editId === item[chave] ? (
                    <>
                      <button
                        onClick={() => onSave(item[chave], editValues)}
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
                        onClick={() => onDelete(item[chave])}
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

      {!loading && data.length === 0 && <p>Não há dados para exibir.</p>}
    </div>
  );
}

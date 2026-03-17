"use client";

import { useEffect, useState } from "react";
import { IncomeForm } from "../../components/IncomeForm";
import { Income } from "../interfaces/income";

export default function ReceitasPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);

  // useEffect com array vazio [] roda uma única vez quando o componente monta
  // Aqui buscamos as receitas salvas no banco para popular a lista inicial
  useEffect(() => {
    fetch("/api/incomes")
      .then((res) => res.json())
      .then((data) => setIncomes(data));
  }, []);

  const handleAddIncome = async (data: {
    type: string;
    day: string;
    amount: string;
    note: string;
  }) => {
    // Salva no banco via API
    const res = await fetch("/api/incomes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Enviamos o mês e ano atuais junto com a receita para filtrar depois
      body: JSON.stringify({
        ...data,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      }),
    });

    const saved = await res.json();

    // Atualiza o estado local com o _id retornado pelo banco
    setIncomes((prev) => [
      ...prev,
      {
        ...data,
        _id: saved.insertedId,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
    ]);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/incomes/${id}`, { method: "DELETE" });
    // Remove do estado local para a UI atualizar sem precisar recarregar
    setIncomes((prev) => prev.filter((inc) => inc._id !== id));
  };

  return (
    <div className="p-10 text-black bg-gray-200 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-4">Receitas</h1>

      <IncomeForm onSubmit={handleAddIncome} />

      <div className="mt-8 bg-white border border-gray-300 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Receitas adicionadas</h2>

        {incomes.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhuma receita adicionada.</p>
        )}

        <ul className="space-y-2">
          {incomes.map((inc) => (
            <li
              key={inc._id}
              className="bg-gray-100 p-3 border border-gray-300 rounded text-sm flex justify-between items-center"
            >
              <div>
                <strong>{inc.type}</strong> – dia {inc.day} – R$ {inc.amount}
                {inc.note && <div className="text-gray-600">{inc.note}</div>}
              </div>
              <button
                onClick={() => handleDelete(inc._id!)}
                className="text-red-500 hover:text-red-700 text-xs ml-4"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

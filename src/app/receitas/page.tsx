"use client";

import { useState } from "react";
import { IncomeForm } from "../../components/IncomeForm";

export default function ReceitasPage() {
  const [incomes, setIncomes] = useState<
    { type: string; day: string; amount: string; note: string }[]
  >([]);

  const handleAddIncome = (data: {
    type: string;
    day: string;
    amount: string;
    note: string;
  }) => {
    setIncomes((prev) => [...prev, data]);
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
        {incomes.map((inc, idx) => (
          <li
            key={idx}
            className="bg-gray-100 p-3 border border-gray-300 rounded text-sm"
          >
            <strong>{inc.type}</strong> – dia {inc.day} – R$ {inc.amount}
            {inc.note && <div className="text-gray-600">{inc.note}</div>}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}

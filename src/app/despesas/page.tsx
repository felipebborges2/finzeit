"use client";

import { useState } from "react";
import { ExpenseForm } from "@/components/expenseForm";

export default function DespesasPage() {
  const [items, setItems] = useState<
    {
      type: string;
      day: string;
      amount: string;
      paymentMethod: string;
      installments: string;
      note: string;
      isFixed?: boolean;
    }[]
  >([]);

  const handleAdd = (data: any) => {
    setItems((prev) => [...prev, data]);
  };

  return (
    <div className="p-10 text-black bg-gray-200 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-4">Despesas</h1>

      <ExpenseForm onSubmit={handleAdd} />

      <div className="mt-8 bg-white border border-gray-300 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Despesas adicionadas</h2>

        {items.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhuma despesa adicionada.</p>
        )}

        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="bg-gray-100 p-3 border border-gray-300 rounded text-sm"
            >
              <strong>{item.type}</strong> – dia {item.day} – R$ {item.amount}
              {item.note && <div className="text-gray-600">{item.note}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

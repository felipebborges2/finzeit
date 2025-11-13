"use client";

import React, { useState } from "react";

interface IncomeFormProps {
  onSubmit: (data: {
    type: string;
    day: string;
    amount: string;
    note: string;
  }) => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    type: "",
    day: "",
    amount: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);

    setForm({
      type: "",
      day: "",
      amount: "",
      note: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-white text-black cursor-pointer"
        required
      >
        <option value="">Tipo de receita</option>
        <option value="salario">Salário</option>
        <option value="bolsa">Bolsa</option>
        <option value="presente">Presente</option>
        <option value="freelance">Freelance</option>
        <option value="investimentos">Investimentos</option>
        <option value="outros">Outros</option>
      </select>

      <input
        name="day"
        type="number"
        min={1}
        max={31}
        value={form.day}
        onChange={handleChange}
        placeholder="Dia (1-31)"
        className="w-full p-2 border rounded bg-white text-black"
        required
      />

      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Valor"
        className="w-full p-2 border rounded bg-white text-black"
        required
      />

      <input
        name="note"
        type="text"
        value={form.note}
        onChange={handleChange}
        placeholder="Observações (opcional)"
        className="w-full p-2 border rounded bg-white text-black"
      />

      <button
        type="submit"
        className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
      >
        Adicionar receita
      </button>
    </form>
  );
};

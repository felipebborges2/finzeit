'use client';

import { useEffect, useState } from 'react';

export const LimitsForm = ({ existingTypes }: { existingTypes: string[] }) => {
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch("/api/user/limits")
      .then(res => res.json())
      .then(data => setLimits(data));
  }, []);

  const handleChange = (type: string, value: string) => {
    setLimits((prev) => ({
      ...prev,
      [type]: Number(value),
    }));
  };

  const salvar = async () => {
    const res = await fetch("/api/user/limits", {
      method: "POST",
      body: JSON.stringify(limits),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setMensagem("Limites salvos com sucesso!");
      setErro(false);
    } else {
      setMensagem("Erro ao salvar limites.");
      setErro(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold uppercase mb-6">💸 Definir Limites por Tipo de Gasto</h2>

      {existingTypes.map((type) => (
        <div key={type} className="mb-4">
          <label className="block mb-1 capitalize font-semibold text-sm text-gray-700">
            💰 {type}
          </label>
          <div className="flex items-center rounded-md shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 text-sm text-gray-600 bg-gray-100 border-r border-gray-300 rounded-l-md">
              R$
            </span>
            <input
              type="number"
              className="w-full p-2 rounded-r-md focus:outline-none"
              value={limits[type] ?? ""}
              onChange={(e) => handleChange(type, e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        onClick={salvar}
        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md shadow"
      >
        Salvar Limites
      </button>

      {mensagem && (
        <p className={`mt-3 text-sm font-medium ${erro ? "text-red-600" : "text-green-600"}`}>
          {mensagem}
        </p>
      )}
    </div>
  );
};

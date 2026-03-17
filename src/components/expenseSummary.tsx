import React from "react";
import { Expense } from "@/app/interfaces/expense";

interface ExpenseSummaryProps {
  expenses: Expense[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
  totalIncome: number;
  limits: Record<string, number>;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  expenses,
  year,
  month,
  onDelete,
  totalIncome,
  limits,
}) => {
  const filteredMonthly = expenses;

  const totalMonthly = filteredMonthly.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const yearlyExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year;
  });

  const totalByType: Record<string, number> = {};
  yearlyExpenses.forEach((exp) => {
    if (!totalByType[exp.type]) {
      totalByType[exp.type] = 0;
    }
    totalByType[exp.type] += exp.amount;
  });

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const monthName = (monthNumber: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    return months[monthNumber] || "";
  };

  // saldo = receitas - despesas do mês selecionado
  const balance = totalIncome - totalMonthly;

  // Agrupa o total gasto por categoria no mês atual (filteredMonthly já está filtrado por mês)
  const spentByType: Record<string, number> = {};
  filteredMonthly.forEach((exp) => {
    spentByType[exp.type] = (spentByType[exp.type] ?? 0) + exp.amount;
  });

  // Gera alertas para categorias que têm limite definido e estão acima de 80%
  const alerts = Object.entries(limits)
    .filter(([, limit]) => limit > 0)
    .map(([type, limit]) => {
      const spent = spentByType[type] ?? 0;
      const ratio = spent / limit; // 0.0 a 1.0+ (pode passar de 1 se ultrapassou)
      return { type, spent, limit, ratio };
    })
    .filter(({ ratio }) => ratio >= 0.8); // só mostra se gastou 80% ou mais

  return (
    <div className="flex flex-col gap-4">

      {/* Card de saldo: receitas / despesas / saldo lado a lado */}
      <div className="bg-white border-2 border-black p-4 rounded-md mt-4 text-black flex justify-between gap-2 text-center">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Receitas</p>
          <p className="text-lg font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
        </div>
        <div className="flex-1 border-x border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Despesas</p>
          <p className="text-lg font-bold text-red-600">R$ {totalMonthly.toFixed(2)}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Saldo</p>
          {/* Cor dinâmica: verde se saldo positivo, vermelho se negativo */}
          <p className={`text-lg font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Alertas de limite por categoria */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          {alerts.map(({ type, spent, limit, ratio }) => {
            const exceeded = ratio >= 1;
            return (
              <div
                key={type}
                className={`p-3 rounded-md border text-sm font-medium flex justify-between items-center ${
                  exceeded
                    ? "bg-red-100 border-red-400 text-red-700"
                    : "bg-yellow-100 border-yellow-400 text-yellow-700"
                }`}
              >
                <span>
                  {exceeded ? "Limite ultrapassado" : "Próximo do limite"} —{" "}
                  <strong className="capitalize">{type}</strong>
                </span>
                <span>
                  R$ {spent.toFixed(2)} / R$ {limit.toFixed(2)}{" "}
                  ({Math.round(ratio * 100)}%)
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista de despesas do mês */}
      <div className="bg-white border-2 border-black p-4 rounded-md text-black max-h-[50vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">
          Total de {monthName(month)}: R$ {totalMonthly.toFixed(2)}
        </h2>

        <ul className="space-y-2 text-sm">
          {filteredMonthly.map((exp, index) => (
            <li
              key={`${exp._id}-${exp.date}-${index}`}
              className="bg-black rounded-md text-white p-3 shadow-lg border-l-4 border-black flex items-center justify-between"
            >
              <div>
                <span>
                  • {capitalize(exp.type)} –{" "}
                  {new Date(exp.date).toLocaleDateString()} – R${" "}
                  {exp.amount.toFixed(2)}
                </span>
                {exp.note && <span className="block mt-1">{exp.note}</span>}
              </div>

              {exp.isFixed ? (
                <button
                  onClick={() => {
                    if (exp._id) {
                      onDelete(String(exp._id));
                    } else {
                      alert(
                        "Este gasto fixo é gerado automaticamente e não pode ser cancelado."
                      );
                    }
                  }}
                  className="text-white px-4 py-2 rounded-md text-xs bg-red-700 cursor-pointer my-2 h-9 hover:bg-red-600 transition-colors duration-300"
                >
                  Cancelar assinatura
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (exp._id) {
                      onDelete(String(exp._id));
                    }
                  }}
                  className="text-white px-4 py-2 rounded-md text-xs bg-red-600 cursor-pointer my-2 h-9 hover:bg-red-500 transition-colors duration-300"
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Resumo anual agrupado por tipo */}
      <div className="p-4 bg-white rounded-md mt-4 text-black border-2 border-black overflow-y-auto">
        <h2 className="text-xl font-bold">Resumo Anual por Tipo ({year})</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {Object.entries(totalByType).map(([type, total]) => (
            <li
              className="bg-black text-white px-4 py-2 rounded-md my-4"
              key={type}
            >
              • {capitalize(type)} – R$ {total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

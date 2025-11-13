import React from "react";
import { Expense } from "@/app/interfaces/expense";

interface ExpenseSummaryProps {
  expenses: Expense[];
  year: number;
  month: number;
  onDelete: (id: string) => void;
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({
  expenses,
  year,
  month,
  onDelete,
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
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[monthNumber] || "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border-2 border-black p-4 rounded-md mt-4 text-black max-h-[50vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">
          Total de {monthName(month)}: R$ {totalMonthly.toFixed(2)}
        </h2>

        <div>
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
      </div>

      <div className="p-4 bg-white rounded-md mt-4 text-black border-2 border-black max-h[50vh] overflow-y-auto">
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

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface Expense {
  type: string;
  amount: number;
  date: string;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a0522d",
  "#8a2be2",
  "#00ced1",
  "#ff1493",
  "#2e8b57",
  "#ff6347",
  "#20b2aa",
  "#9370db",
];

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// ✅ Tooltip personalizado
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const value = item.value as number;
    const name = String(item.payload.name);

    return (
      <div className="bg-white border border-gray-400 p-2 rounded shadow text-sm">
        <strong>{name.charAt(0).toUpperCase() + name.slice(1)}</strong>
        <br />
        <span>R$ {value.toFixed(2).replace(".", ",")}</span>
      </div>
    );
  }

  return null;
};

export const ExpenseByTypeChart = ({
  expenses,
  year,
}: {
  expenses: Expense[];
  year: number;
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  // Filtra os dados pelo mês selecionado
  const filtered = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === selectedMonth;
  });

  // Agrupa os gastos por tipo
  const data = Object.entries(
    filtered.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.type] = (acc[cur.type] || 0) + cur.amount;
      return acc;
    }, {})
  ).map(([type, value]) => ({ name: type, value }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-full border-2 border-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Gastos por Tipo – {months[selectedMonth]} / {year}
        </h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="p-2 border rounded text-black"
        >
          {months.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhum gasto neste mês.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              tick={{ style: { fontWeight: "bold"} }}
              tickFormatter={(name) =>
                name.charAt(0).toUpperCase() + name.slice(1)
              }
            />

            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

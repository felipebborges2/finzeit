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
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface Expense {
  date: string;
  amount: number;
  type: string;
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50",
  "#a0522d", "#8a2be2", "#00ced1", "#ff1493",
  "#2e8b57", "#ff6347", "#20b2aa", "#9370db",
];

const monthMap: Record<string, string> = {
  jan: "Janeiro", fev: "Fevereiro", mar: "Março", abr: "Abril",
  mai: "Maio", jun: "Junho", jul: "Julho", ago: "Agosto",
  set: "Setembro", out: "Outubro", nov: "Novembro", dez: "Dezembro",
};

// ✅ Tooltip personalizado com checagem segura
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0);

    const formattedLabel = typeof label === "string"
      ? label.replace(".", "").toLowerCase()
      : "";

    const fullMonth = monthMap[formattedLabel] || String(label);

    return (
      <div className="bg-white border border-gray-400 p-2 rounded shadow text-sm">
        <strong>{fullMonth}</strong>
        <div>Total: <strong>R$ {total.toFixed(2).replace(".", ",")}</strong></div>
        <br />
        {payload.map((entry, index) => {
          const name =
            typeof entry.name === "string"
              ? entry.name.charAt(0).toUpperCase() + entry.name.slice(1)
              : String(entry.name ?? "");

          return (
            <div key={index} style={{ color: entry.color }}>
              {name}: R$ {(entry.value as number).toFixed(2).replace(".", ",")}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export const MonthlyExpensesChart = ({
  expenses,
  year,
}: {
  expenses: Expense[];
  year: number;
}) => {
  const allTypes = Array.from(new Set(expenses.map((e) => e.type)));

  const monthlyTotals = Array.from({ length: 12 }, (_, month) => {
    const monthData: any = {
      name: new Date(0, month).toLocaleString("pt-BR", { month: "short" }),
    };

    allTypes.forEach((type) => {
      monthData[type] = expenses
        .filter((e) => {
          const d = new Date(e.date);
          return (
            d.getFullYear() === year &&
            d.getMonth() === month &&
            e.type === type
          );
        })
        .reduce((sum, e) => sum + e.amount, 0);
    });

    return monthData;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl w-[93vw] mx-auto flex flex-col border-2 border-black">
      <h2 className="text-xl font-bold mb-4 flex self-center border-b-2 border-green-500">
        Gastos por Mês {year}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={monthlyTotals}>
          <XAxis
            dataKey="name"
            tick={{ style: { fontWeight: "bold" } }}
            tickFormatter={(monthAbbreviation: string) => {
              const key = monthAbbreviation.replace(".", "").toLowerCase();
              return monthMap[key] || monthAbbreviation;
            }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          {allTypes.map((type, index) => (
            <Bar
              key={type}
              dataKey={type}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

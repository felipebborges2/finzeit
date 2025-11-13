"use client";

import React, { useState } from "react";
import { CalendarViewProps } from "../app/interfaces/calendarProps";
import { Expense } from "../app/interfaces/expense";
import { monthName } from "../app/utils/monthName";

export const CalendarView: React.FC<CalendarViewProps> = ({
  year,
  month,
  expenses,
}) => {
  const [localMonth, setLocalMonth] = useState(month);

  const isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysInMonth =
    localMonth === 1 // fevereiro
      ? isLeapYear(year)
        ? 29
        : 28
      : new Date(year, localMonth + 1, 0).getDate();

  const expensesByDay = expenses.reduce<Record<number, Expense[]>>(
    (acc, expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();

      // Garante que só pega despesas do mês selecionado localmente
      if (expenseMonth === localMonth && expenseYear === year) {
        const day = expenseDate.getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(expense);
      }

      return acc;
    },
    {}
  );

  const monthNames = [
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

  return (
    <div className="border-black border-2 p-6 rounded-md flex justify-center flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold border-b-2 border-green-500">
          Gastos Diários em {monthNames[localMonth]}
        </h2>

        <select
          value={localMonth}
          onChange={(e) => setLocalMonth(Number(e.target.value))}
          className="border p-1 rounded bg-white text-black"
        >
          {monthNames.map((name, idx) => (
            <option key={idx} value={idx}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dailyExpenses = expensesByDay[day] || [];
          const total = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);

          return (
            <div
              key={day}
              className="border p-2 rounded shadow-sm bg-gray-100 text-sm"
            >
              <div className="font-bold">Dia {day}</div>
              {dailyExpenses.length > 0 ? (
                <div>
                  <div>Total: R$ {total.toFixed(2)}</div>
                  {dailyExpenses.map((exp, idx) => (
                    <div key={idx} className="text-xs text-gray-600">
                      - {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}{" "}
                      {exp.note && `(${exp.note})`}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">Sem gastos</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

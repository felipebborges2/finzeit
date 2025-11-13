"use client";

import { useEffect, useState } from "react";
import { YearSelector } from "@/components/yearSelector";
import { MonthButtons } from "@/components/monthButton";
import { ExpenseForm } from "@/components/expenseForm";
import { ExpenseSummary } from "@/components/expenseSummary";
import { ExpenseByTypeChart } from "@/components/expenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/monthlyExpensesChart";
import { CalendarView } from "@/components/calendarView";
import { AuthButton } from "@/components/AuthButton";
import { Expense, AddExpenseData } from "./interfaces/expense";
import { UserCard } from "@/components/UserCard";
import Image from "next/image";

import {
  generateInstallments,
  saveExpenses,
  filterExpensesByMonthYear,
  getFixedExpensesForMonth,
} from "./utils/expense";

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  const handleAddExpense = async (data: AddExpenseData) => {
    const newExpenses = generateInstallments(
      data,
      selectedYear,
      selectedMonth!
    );
    const saved = await saveExpenses(newExpenses);
    setExpenses((prev) => [...prev, ...saved]);
  };

  const mappedExpenses: Expense[] = expenses.map((expense) => ({
    ...expense,
    _id: expense._id ?? "",
  }));

  const fixedExpensesForYear = Array.from({ length: 12 }, (_, month) => {
    const date = new Date(selectedYear, month, 1);
    return getFixedExpensesForMonth(mappedExpenses, date);
  }).flat();

  const allExpensesWithFixes = [...mappedExpenses, ...fixedExpensesForYear];

  const handleDelete = async (id: string) => {
    const now = new Date(selectedYear, selectedMonth ?? 0, 1);
    const canceledAt = now.toISOString();

    const targetExpense = mappedExpenses.find((e) => e._id === id);
    const isFixed = targetExpense?.isFixed;

    if (isFixed) {
      await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ canceledAt }),
      });

      setExpenses((prev) =>
        prev.map((expense) =>
          expense._id === id ? { ...expense, canceledAt } : expense
        )
      );
    } else {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    }
  };

  const now = new Date(selectedYear, selectedMonth ?? 0, 1);
  const fixedExpenses = getFixedExpensesForMonth(mappedExpenses, now);

  const filteredExpenses = [
    ...filterExpensesByMonthYear(mappedExpenses, selectedYear, selectedMonth!),
    ...fixedExpenses,
  ];

  const expensesForChart = allExpensesWithFixes.filter((e) => {
    if (!e.isFixed) return true;
    const date = new Date(e.date);
    const canceledAt = e.canceledAt ? new Date(e.canceledAt) : null;
    return !canceledAt || date < canceledAt;
  });

  return (
<main className="flex-1 bg-gray-200 h-full text-black flex flex-col gap-4 p-10 pt-6 overflow-x-hidden">
      <div className="flex items-center gap-3">
  <Image
    src="/finzeit-logo.png"
    alt="FinZeit Logo"
    width={100}
    height={100}
    className="rounded"
  />
</div>

      {/* 👤 Cartão de usuário personalizado */}
      <UserCard />

      <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />

      <div className="flex gap-6">
        <div className="w-[45vw]">
          {selectedYear && (
            <MonthButtons
              selectedMonth={selectedMonth}
              onSelect={setSelectedMonth}
            />
          )}
          {selectedMonth !== null && (
            <ExpenseForm onSubmit={handleAddExpense} />
          )}
        </div>

        <div className="w-[50vw]">
          {selectedMonth !== null && (
            <ExpenseSummary
              expenses={filteredExpenses}
              year={selectedYear}
              month={selectedMonth}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <div>
        {selectedMonth !== null && (
          <CalendarView
            expenses={filteredExpenses}
            year={selectedYear}
            month={selectedMonth}
          />
        )}
      </div>

      <div className="flex gap-4 mt-4 flex-col">
        {selectedMonth !== null && (
          <div className="flex-1">
            <ExpenseByTypeChart expenses={expensesForChart} year={selectedYear} />
          </div>
        )}
        {selectedMonth !== null && (
          <MonthlyExpensesChart
            expenses={expensesForChart}
            year={selectedYear}
          />
        )}
      </div>
    </main>
  );
}

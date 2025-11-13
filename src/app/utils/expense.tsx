import { Expense, AddExpenseData } from "../interfaces/expense";

export async function saveExpenses(expenses: Expense[]): Promise<Expense[]> {
  const savedExpenses: Expense[] = [];

  for (const expense of expenses) {
    const response = await fetch("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const saved = await response.json();
    savedExpenses.push({ ...expense, _id: saved.insertedId });
  }

  return savedExpenses;
}

export function generateInstallments(
  data: AddExpenseData,
  selectedYear: number,
  selectedMonth: number
): Expense[] {
  const baseDate = new Date(selectedYear, selectedMonth, parseInt(data.day));

  if (data.isFixed) {
    return [
      {
        type: data.type,
        date: baseDate.toISOString(),
        amount: parseFloat(data.amount),
        paymentMethod: data.paymentMethod,
        note: data.note,
        isFixed: true,
        startDate: baseDate.toISOString().split("T")[0],
        active: true,
        frequency: "monthly",
        canceledAt: undefined, // ✅ define o campo como presente, mas vazio
      },
    ];
  }

  const totalInstallments = data.installments ? parseInt(data.installments) : 1;
  const valuePerInstallment = parseFloat(data.amount) / totalInstallments;

  return Array.from({ length: totalInstallments }, (_, i) => {
    const installmentDate = new Date(baseDate);
    installmentDate.setMonth(baseDate.getMonth() + i);

    return {
      type: data.type,
      date: installmentDate.toISOString(),
      amount: parseFloat(valuePerInstallment.toFixed(2)),
      paymentMethod: data.paymentMethod,
      installments: totalInstallments,
      note: data.note,
    };
  });
}


export function filterExpensesByMonthYear(
  expenses: Expense[],
  year: number,
  month: number
): Expense[] {
  return expenses.filter((expense) => {
    if (expense.isFixed) return false; // evita duplicação com os fixos gerados
    const date = new Date(expense.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

export function getFixedExpensesForMonth(
  expenses: Expense[],
  targetDate: Date
): Expense[] {
  return expenses
    .filter((expense) => {
      if (!expense.isFixed || !expense.active || !expense.startDate) return false;

      const startDate = new Date(expense.startDate);
      const canceledAt = expense.canceledAt ? new Date(expense.canceledAt) : null;

      const isStarted =
        startDate.getFullYear() < targetDate.getFullYear() ||
        (startDate.getFullYear() === targetDate.getFullYear() &&
          startDate.getMonth() <= targetDate.getMonth());

          const isNotCanceled =
          !canceledAt ||
          targetDate.getTime() < new Date(canceledAt).setHours(0, 0, 0, 0);
        

      return isStarted && isNotCanceled;
    })
    .map((expense) => {
      const start = new Date(expense.startDate ?? "");
      const day = isNaN(start.getDate()) ? 1 : start.getDate();

      return {
        ...expense,
        date: new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          day
        ).toISOString(),
        _id: expense._id,
      };
    });
}


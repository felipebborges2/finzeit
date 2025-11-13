export interface Expense {
  _id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  installments?: number;
  note?: string;
}

export interface MappedExpense extends Omit<Expense, "_id"> {
  id: string;
}

export interface AddExpenseData {
  type: string;
  day: string;
  amount: string;
  paymentMethod: string;
  installments?: string;
  note?: string;
  isFixed?: boolean; // ✅ esta é a linha que vai eliminar o erro
}


export interface Expense {
  _id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  installments?: number;
  note?: string;

  // Novos campos para gastos fixos
  isFixed?: boolean;
  startDate?: string;
  active?: boolean;
  frequency?: "monthly";
}

export interface MappedExpense extends Omit<Expense, "_id"> {
  id: string;
}

export interface Expense {
  _id?: string;
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  note?: string;
  installments?: number;
  isFixed?: boolean;
  startDate?: string;
  active?: boolean;
  frequency?: "monthly"; // ✅ tipo mais seguro e restrito
  canceledAt?: string;
}


// Interface principal que representa uma despesa no banco de dados
export interface Expense {
  _id?: string;
  userId?: string;         // email do usuário dono da despesa
  type: string;
  date: string;
  amount: number;
  paymentMethod: string;
  note?: string;
  installments?: number;
  isFixed?: boolean;       // true = despesa recorrente (assinatura, aluguel, etc.)
  startDate?: string;      // data de início das despesas fixas (YYYY-MM-DD)
  active?: boolean;        // se a despesa fixa ainda está ativa
  frequency?: "monthly";   // frequência da recorrência (só mensal por enquanto)
  canceledAt?: string;     // data de cancelamento (soft delete para despesas fixas)
}

// Interface usada pelo formulário de adição — campos vêm como string do input HTML
export interface AddExpenseData {
  type: string;
  day: string;
  amount: string;
  paymentMethod: string;
  installments?: string;
  note?: string;
  isFixed?: boolean;
}

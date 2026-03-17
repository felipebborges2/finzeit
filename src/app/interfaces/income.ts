// Interface que representa uma receita no banco de dados
export interface Income {
  _id?: string;
  userId?: string;   // email do usuário dono da receita
  type: string;      // tipo: salario, freelance, etc.
  day: string;       // dia do mês em que a receita entra
  amount: string;    // valor como string (vem do input HTML)
  note: string;
  month: number;     // mês (0-11, padrão JavaScript)
  year: number;
}

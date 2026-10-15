// Esse arquivo vai guardar os formatos dos dados do app para que qualquer tela possa importar sem precisar recriar.

/**
 * ============================================================================
 * TIPAGENS GLOBAIS DO MYFINANCES
 * Centraliza todas as interfaces de dados financeiros do aplicativo.
 * ============================================================================
 */

/**
 * Representa uma transação financeira (Receita ou Despesa).
 * Salva no AsyncStorage sob a chave '@myfinance:transactions'.
 */

export interface Transaction {
  id: string; // Identificador único (timestamp em string)
  description: string; // Nome da categoria principal (ex: "Mercado", "Salário", "Aluguel" )
  detail?: string; // Detalhe opcional (ex: "Compra da semana")
  value: number; // Valor numérico da transação 
  type: 'income' | 'expense'; // 'income' = Entrada | 'expense' = Saída
  date: string; // Data no formato "DD/MM/YYYY" (ex: "01/01/2023")
  time?: string; // Hora no formato "HH:MM" (ex: "14:30") (Opcional para retrocompatibilidade)
}

/**
 * Representa uma conta fixa mensal (Recorrente).
 * Salva no AsyncStorage sob a chave '@myfinance:fixed_bills'.
 */

export interface FixedBill {
  id: string; // Identificador único (timestamp em string)
  title: string; // Nome da conta (ex: "Aluguel", "Internet", "Energia")
  value: number; // Valor mensal previsto
  dueDay: number; // Dia do vencimento (1 a 31)
}

/**
 * Status possíveis para uma conta fixa no mês selecionado.
 */

export type BillStatus = 'paid' | 'pending' | 'overdue'; // 'paid' = Paga | 'pending' = Pendente | 'overdue' = Atrasada

/**
 * Mapa de controle de pagamentos das contas fixas.
 * Chave no formato: "ID_MES_ANO" (ex: "17123456_9_2026": true).
 */

export interface BillPaymentsMap {
  [key: string]: boolean; // true = Paga | false = Pendente
}

/**
 * Representa um ativo na carteira de investimentos.
 * Salvo no AsyncStorage sob a chave '@myfinance:investments'.
 */

export interface Investment {
  id: string; // Identificador único (timestamp em string)
  name: string; // Nome do ativo (ex: "BTC", "CDB Itaú"
  amount: number; // Valor inicialmente investido (Aporte)
  currentValue: number; // Valor bruto atual do ativo (ex: 1500.00)
  type: 'fixed' | 'variable' | 'crypto'; // 'fixed' = Renda Fixa | 'variable' = Renda Variável | 'crypto' = Criptomoeda
}
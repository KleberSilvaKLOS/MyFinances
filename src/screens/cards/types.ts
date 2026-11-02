/**
 * ============================================================================
 * TIPAGENS DA GESTÃO DE CARTÕES DE CRÉDITO E PARCELAMENTOS
 * ============================================================================
 */

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closingDay: number; // Dia de fechamento da fatura
  dueDay: number;     // Dia de vencimento da fatura
  color: string;
}

export interface CardPurchase {
  id: string;
  cardId: string;
  description: string;
  totalValue: number;
  installmentCount: number; // Ex: 10 (em 10x)
  installmentValue: number; // Ex: 150.00
  purchaseDate: string;     // Formato DD/MM/AAAA
}

export interface MonthlyInstallmentItem {
  purchaseId: string;
  description: string;
  currentInstallment: number;
  totalInstallments: number;
  value: number;
}

export interface InvoiceDetails {
  month: number;
  year: number;
  total: number;
  items: MonthlyInstallmentItem[];
}

export const CARD_COLORS = [
  '#820ad1', // Roxo (Nubank)
  '#ff7a00', // Laranja (Inter)
  '#1e293b', // Preto / Dark Slate
  '#1d4ed8', // Azul Royal
  '#047857', // Verde Esmeralda
];
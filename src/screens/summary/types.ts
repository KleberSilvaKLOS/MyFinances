/**
 * ============================================================================
 * TIPAGENS DA TELA DE RESUMO
 * ============================================================================
 */

import { Transaction } from '../../@types/finance';

/**
 * Total consolidado por categoria de despesa.
 */
export interface CategorySummary {
  name: string;
  total: number;
  percentage: number;
  color: string;
}

/**
 * Estrutura para os gráficos de barra ou donut do resumo.
 */
export interface SummaryChartItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

/**
 * Balanço calculado do período selecionado.
 */
export interface PeriodBalance {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export const SUMMARY_COLORS = [
  '#3870d8',
  '#13ec6d',
  '#ef4444',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#64748b',
];

export type { Transaction };
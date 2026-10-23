// Constantes visuais e tipagens locais

/**
 * ============================================================================
 * TIPAGENS E CONSTANTES DA TELA HOME
 * ============================================================================
 */

import { Transaction, FixedBill } from '../../@types/finance';

/**
 * Paleta de cores utilizada para colorir as fatias do gráfico de despesas (Donut).
 */
export const CHART_COLORS = ['#3870d8', '#13ec6d', '#ef4444', '#f59e0b', '#8b5cf6'];

/**
 * Formato dos dados exigido pela biblioteca react-native-chart-kit.
 */
export interface ChartItem {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export type { Transaction, FixedBill };
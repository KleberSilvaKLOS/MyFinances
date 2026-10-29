/**
 * ============================================================================
 * TIPAGENS E CONSTANTES DA TELA DE GASTOS / LANÇAMENTOS
 * ============================================================================
 */

import { Transaction } from '../../@types/finance';

/**
 * Sugestões base para o sistema de autocomplete da categoria.
 */
export const DEFAULT_SUGGESTIONS: string[] = [
  'Alimentação',
  'Mercado',
  'Transporte',
  'Combustível',
  'Saúde',
  'Lazer',
  'Salário',
  'Pix',
  'Investimentos',
  'Educação',
];

export type { Transaction };
/**
 * ============================================================================
 * TIPAGENS DA TELA DE CONTAS FIXAS
 * ============================================================================
 */

import { FixedBill } from '../../@types/finance';

/**
 * Mapa de pagamentos indexado pela chave única "ID_MES_ANO".
 * Ex: { "1729001234_9_2026": true }
 */
export type PaymentsMap = Record<string, boolean>;

export type { FixedBill };
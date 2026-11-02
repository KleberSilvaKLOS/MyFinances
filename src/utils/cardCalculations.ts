/**
 * ============================================================================
 * UTILITÁRIO: cardCalculations
 * Centraliza o cálculo e a projeção de parcelamentos ativos de todos os cartões.
 * ============================================================================
 */

import { CreditCard, CardPurchase } from '../screens/cards/types';

export interface ActiveCardInstallment {
  purchaseId: string;
  cardId: string;
  cardName: string;
  cardColor: string;
  description: string;
  currentInstallment: number;
  totalInstallments: number;
  value: number;
  dueDay: number;
}

/**
 * Retorna todas as parcelas ativas de todos os cartões cadastrados
 * para o mês/ano de referência (padrão: mês corrente).
 */
export function calculateAllCardsActiveInstallments(
  cards: CreditCard[],
  purchases: CardPurchase[],
  targetDate: Date = new Date()
): { items: ActiveCardInstallment[]; total: number } {
  const targetMonth = targetDate.getMonth();
  const targetYear = targetDate.getFullYear();
  const items: ActiveCardInstallment[] = [];
  let total = 0;

  purchases.forEach((p) => {
    const card = cards.find((c) => c.id === p.cardId);
    if (!card) return;

    const parts = p.purchaseDate.split('/').map(Number);
    const day = parts[0];
    let firstM = parts[1] - 1;
    let firstY = parts[2];

    // Se a compra foi feita no dia ou após o fechamento da fatura,
    // a 1ª parcela será cobrada no mês seguinte.
    if (day >= card.closingDay) {
      firstM += 1;
      if (firstM > 11) {
        firstM = 0;
        firstY += 1;
      }
    }

    // Diferença em meses entre o mês da fatura em análise e o mês da 1ª parcela
    const monthDiff = (targetYear - firstY) * 12 + (targetMonth - firstM);

    // Se a diferença estiver dentro do intervalo de parcelas contratadas
    if (monthDiff >= 0 && monthDiff < p.installmentCount) {
      const installmentItem: ActiveCardInstallment = {
        purchaseId: p.id,
        cardId: card.id,
        cardName: card.name,
        cardColor: card.color,
        description: p.description,
        currentInstallment: monthDiff + 1,
        totalInstallments: p.installmentCount,
        value: p.installmentValue,
        dueDay: card.dueDay,
      };

      items.push(installmentItem);
      total += p.installmentValue;
    }
  });

  return { items, total };
}
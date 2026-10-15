// Aqui ficam as funções puras de formatação (que estavam repetidas em todas as telas).

/**
 * ============================================================================
 * UTILITÁRIOS DE FORMATAÇÃO (MOEDA E DATA)
 * ============================================================================
 */

/**
 * Converte um número para o padrão monetário brasileiro (R$).
 *
 * @param val - Valor numérico a ser formatado.
 * @returns String formatada (ex: "R$ 1.250,00").
 */

export function formatCurrency(val: number): string {
  return Number(val || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Exibe o valor formatado em R$ ou a máscara de privacidade (••••••).
 *
 * @param val - Valor numérico.
 * @param isVisible - Estado de visibilidade (olhinho aberto ou fechado).
 * @returns Valor em R$ ou máscara oculta.
 */
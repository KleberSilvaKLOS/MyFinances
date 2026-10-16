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

export function formatPrivateValue(val: number, isVisible: boolean): string {
  return isVisible ? formatCurrency(val) : '••••••';
}

/**
 * Convert uma string de valor digitada pelo usuário (Com vírgula) em numero válido.
 *
 * @param rawValue - Texto digitado no input (ex: "150,50").
 * @returns Número float (ex: 150.5) ou 0 se inválido.
 */

export function parseCurrency(rawValue: string): number {
  if (!rawValue) return 0;
  const parsed = parseFloat(rawValue.replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}
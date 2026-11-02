/**
 * Converte um número para o padrão monetário brasileiro (R$).
 */
export function formatCurrency(val: number): string {
  return Number(val || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Exibe o valor formatado em R$ ou a máscara de privacidade (••••••).
 */
export function formatPrivateValue(val: number, isVisible: boolean): string {
  return isVisible ? formatCurrency(val) : '••••••';
}

/**
 * Converte uma string de valor digitada no input (ex: "150,50") em número (150.5).
 */
export function parseCurrencyInput(rawValue: string): number {
  if (!rawValue) return 0;
  const parsed = parseFloat(rawValue.replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}
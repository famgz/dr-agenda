export function toReal(
  cents: number | string | undefined | null,
  style: 'decimal' | 'currency' | 'percent' | undefined = 'currency',
): string {
  cents = Number(cents);
  if (!cents || isNaN(cents)) return '';
  const realAmount = cents / 100;
  return realAmount.toLocaleString('pt-BR', {
    style,
    currency: 'BRL',
  });
}

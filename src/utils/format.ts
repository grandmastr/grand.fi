/**
 * Formats a USD value with 2 decimal places
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a token amount with appropriate decimal places
 */
export const formatAmount = (value: string): string => {
  const num = parseFloat(value);
  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';

  return num < 1 ? num.toFixed(4) : num.toFixed(2);
};

/**
 * Helper function to convert rem to pixels
 */
export const remToPx = (rem: number): number => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

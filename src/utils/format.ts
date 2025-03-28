/**
* Formats a number as a currency value in USD
* @param value - The number to format
* @returns Formatted currency string (e.g. "$123.45")
*/
const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a BigInt value based on the token's decimals
 * @param value - The BigInt value to format
 * @param decimals - The number of decimals the token uses
 * @param precision - The number of decimal places to show in the output (optional, default: 4)
 * @returns Formatted number string (e.g., "123.4567")
 */
export const formatUnits = (value: bigint, decimals: number, precision: number = 4): string => {
  if (typeof value !== 'bigint' || typeof decimals !== 'number' || decimals < 0) {
    return '0.0'; // Return default or throw error
  }
  const divisor = 10n ** BigInt(decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  if (fractionalPart === 0n) {
    return integerPart.toString();
  }

  // Pad fractional part with leading zeros if necessary
  const fractionalString = fractionalPart.toString().padStart(decimals, '0');
  // Trim to desired precision
  const trimmedFractional = fractionalString.slice(0, precision);
  // Remove trailing zeros from the fractional part unless precision is 0
  const finalFractional = precision > 0 ? trimmedFractional.replace(/0+$/, '') : '';

  if (!finalFractional.length) {
    return integerPart.toString();
  }

  return `${integerPart}.${finalFractional}`;
};


export { formatCurrencyValue }; // Keep original export if needed elsewhere, or adjust exports

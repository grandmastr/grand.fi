/**
 * Wallet Address Abbreviation Utility
 *
 * This module provides a utility for creating human-readable abbreviated forms
 * of blockchain wallet addresses.
 */

/**
 * Creates an abbreviated version of a wallet address
 *
 * Formats a blockchain wallet address into a shortened, user-friendly format
 * showing the first 6 and last 4 characters with ellipsis in between.
 * For example: "0x1234567890abcdef1234567890abcdef12345678" becomes "0x1234...5678"
 *
 * @param {string} [walletAddress] - The full wallet address to abbreviate
 * @returns {string} The abbreviated address or empty string if no address provided
 */
const createWalletAbbr = (walletAddress?: string): string => {
  if (!walletAddress) return '';

  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
};

export default createWalletAbbr;

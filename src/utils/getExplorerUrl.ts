/**
 * Blockchain Explorer URL Utilities
 * 
 * This module provides utility functions for generating and opening blockchain explorer URLs
 * for wallet addresses across multiple blockchain ecosystems.
 * 
 * @module Utils/Explorer
 */
import { Chain } from '@lifi/sdk';

/**
 * Generates a blockchain explorer URL for a wallet address
 * 
 * Detects the appropriate explorer URL based on the blockchain type:
 * - For EVM chains: Uses the blockExplorerUrls from chain metadata
 * - For Solana: Uses Solana Explorer
 * - For Bitcoin: Uses Blockchain.com Explorer
 * 
 * @param {string} address - The wallet address to view in the explorer
 * @param {Chain} [chain] - The blockchain chain object from useChains
 * @returns {string | undefined} The explorer URL for the address, or undefined if not available
 */
export const getExplorerUrl = (address: string, chain?: Chain): string | undefined => {
  if (!address || !chain) return undefined; 

  // For EVM chains, use the blockExplorerUrls from metamask
  if (chain.metamask?.blockExplorerUrls?.[0]) {
    return `${chain.metamask.blockExplorerUrls[0]}/address/${address}`;
  }

  // For Solana
  if (chain.key === 'sol') {
    return `https://explorer.solana.com/address/${address}`;
  }

  // For Bitcoin
  if (chain.key === 'btc') {
    return `https://www.blockchain.com/explorer/addresses/btc/${address}`;
  }

  // Fallback for chains with standard explorer format
  return undefined;
};

/**
 * Opens the blockchain explorer for a wallet address in a new browser tab
 * 
 * This is a convenience function that generates the explorer URL and opens it
 * in a new tab with secure window settings.
 * 
 * @param {string} address - The wallet address to view in the explorer
 * @param {Chain} [chain] - The blockchain chain object from useChains
 * @returns {void}
 */
export const openInExplorer = (address: string, chain?: Chain): void => {
  const url = getExplorerUrl(address, chain);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

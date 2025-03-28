/**
 * Token Consolidation Utility
 *
 * This module provides a utility for consolidating tokens across multiple blockchain networks.
 * It transforms a chain-specific token map into a unified list of tokens with network information.
 */
import { ConsolidatedToken, TokensResponse } from '@/types/tokens';

/**
 * Consolidates tokens from multiple chains into a unified token list
 *
 * Merges duplicate tokens (identified by symbol) across different blockchain networks
 * into single token objects with multiple network entries. This is useful for:
 * - Creating unified token selectors in the UI
 * - Preventing duplicate token entries in lists
 * - Maintaining cross-chain token relationships
 *
 * The function uses a Map with O(1) lookups to efficiently process potentially
 * large token lists across multiple chains.
 *
 * @param {TokensResponse['tokens']} tokensMap - Map of tokens organized by chainId
 * @returns {ConsolidatedToken[]} Array of consolidated tokens with network information
 */
const consolidateTokens = (
  tokensMap: TokensResponse['tokens'],
): ConsolidatedToken[] => {
  if (!tokensMap) {
    return [];
  }
  // Using a map for O(1) lookups by symbols to have and maintain unique tokens regardless of network
  const tokensBySymbol = new Map<string, ConsolidatedToken>();

  // Since keys are strings, and chainIds are numbers, there's a need to parse them into integers for accurate typing
  const chainIds: number[] = Object.keys(tokensMap).map((chainId) =>
    parseInt(chainId),
  );

  // Process tokens from each chain
  for (const chainId of chainIds) {
    const tokensForChain = tokensMap[chainId];

    for (const token of tokensForChain) {
      const { symbol, address, chainId: _chainId, ...restToken } = token;

      if (tokensBySymbol.has(symbol)) {
        // If this token already exists, simply update the networks list
        const existingToken = tokensBySymbol.get(symbol);
        existingToken?.networks.push({
          chainId,
          address,
        });
      } else {
        // Set a new token entry
        tokensBySymbol.set(symbol, {
          ...restToken,
          symbol,
          address: token.address,
          networks: [
            {
              chainId: _chainId,
              address,
            },
          ],
        });
      }
    }
  }

  // Returns a list of consolidated tokens
  return Array.from(tokensBySymbol.values());
};

export default consolidateTokens;

/**
 * Token Consolidation Utility
 *
 * This module provides a utility for consolidating tokens across multiple blockchain networks.
 * It transforms a chain-specific token map into a unified list of tokens with network information.
 */
import {
  ConsolidatedToken,
  TokenNetwork,
  TokensResponse,
} from '@/types/tokens';

/**
 * Creates a unique key for a token combining symbol and chainId to handle same-symbol tokens
 * @param symbol Token symbol
 * @param chainId Chain ID
 * @returns Unique token identifier
 */
const createTokenKey = (symbol: string, chainId: number): string => {
  return `${symbol}-${chainId}`;
};

/**
 * Consolidates tokens from multiple chains into a unified token list
 *
 * Merges tokens across different blockchain networks while handling:
 * - Tokens with the same symbol on different chains
 * - Missing or invalid token data
 * - Network information preservation
 *
 * @param {TokensResponse['tokens']} tokensMap - Map of tokens organized by chainId
 * @returns {ConsolidatedToken[]} Array of consolidated tokens with network information
 */
const consolidateTokens = (
  tokensMap: TokensResponse['tokens'],
): ConsolidatedToken[] => {
  if (!tokensMap || typeof tokensMap !== 'object') {
    return [];
  }

  // Using a map with composite key (symbol-chainId) for unique token identification
  const tokensByKey = new Map<string, ConsolidatedToken>();

  // Convert string chainIds to numbers and validate
  const chainIds = Object.keys(tokensMap)
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id));

  // Process tokens from each chain
  for (const chainId of chainIds) {
    const tokensForChain = tokensMap[chainId];
    if (!Array.isArray(tokensForChain)) continue;

    for (const token of tokensForChain) {
      if (!token.symbol || !token.address) continue;

      const tokenKey = createTokenKey(token.symbol, chainId);
      const { chainId: tokenChainId, ...tokenData } = token;

      if (tokensByKey.has(tokenKey)) {
        // Update existing token's networks
        const existingToken = tokensByKey.get(tokenKey);
        if (existingToken) {
          const networkExists = existingToken.networks.some(
            (n: TokenNetwork) =>
              n.chainId === chainId && n.address === token.address,
          );
          if (!networkExists) {
            existingToken.networks.push({
              chainId,
              address: token.address,
            });
          }
        }
      } else {
        // Create new token entry with required fields
        const consolidatedToken: ConsolidatedToken = {
          ...tokenData,
          networks: [
            {
              chainId,
              address: token.address,
            },
          ],
          id: tokenKey,
          sortKey: token.symbol.toLowerCase(),
        };
        tokensByKey.set(tokenKey, consolidatedToken);
      }
    }
  }

  return Array.from(tokensByKey.values());
};

export default consolidateTokens;

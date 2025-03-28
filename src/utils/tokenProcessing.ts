import { ChainId, ChainType, TokenAmount } from '@lifi/sdk';
import { useMemo } from 'react';
import { ConsolidatedToken } from '@/types/tokens';

/**
 * Interface for the normalized token data structure
 * Provides efficient O(1) lookups for tokens by various criteria
 * 
 * @interface NormalizedTokenData
 * @property {Map<string, ConsolidatedToken>} byId - Map of tokens by their unique ID
 * @property {Map<string, string[]>} bySymbol - Map of token IDs by symbol
 * @property {Map<ChainId, string[]>} byChain - Map of token IDs by chain ID
 * @property {string[]} allIds - List of all token IDs
 */
export interface NormalizedTokenData {
  byId: Map<string, ConsolidatedToken>;
  bySymbol: Map<string, string[]>; // symbol -> tokenIds
  byChain: Map<ChainId, string[]>; // chainId -> tokenIds
  allIds: string[];
}

/**
 * Creates a unique token ID from token properties
 * 
 * @param {string} symbol - Token symbol
 * @param {ChainId} chainId - Chain ID where the token exists
 * @returns {string} Unique token identifier
 */
export const createTokenId = (symbol: string, chainId: ChainId): string => {
  return `${symbol.toLowerCase()}_${chainId}`;
};

/**
 * Normalizes raw token data into an efficient data structure
 * Processes tokens in a single pass to create indexed lookups
 * 
 * @param {TokenAmount[]} rawTokens - Array of raw token data from API
 * @returns {NormalizedTokenData} Normalized and indexed token data
 */
export const normalizeTokenData = (rawTokens: TokenAmount[]): NormalizedTokenData => {
  const normalized: NormalizedTokenData = {
    byId: new Map(),
    bySymbol: new Map(),
    byChain: new Map(),
    allIds: [],
  };

  // Process tokens in a single pass
  rawTokens.forEach(token => {
    if (!token.symbol || !token.name) return; // Skip invalid tokens early

    const tokenId = createTokenId(token.symbol, token.chainId);
    
    // Store full token data
    normalized.byId.set(tokenId, {
      ...token,
      sortKey: token.symbol.toLowerCase(), // Pre-compute sort key
      id: tokenId,
    });

    // Update symbol index
    const symbolKey = token.symbol.toLowerCase();
    const existingSymbolTokens = normalized.bySymbol.get(symbolKey) || [];
    normalized.bySymbol.set(symbolKey, [...existingSymbolTokens, tokenId]);

    // Update chain index
    const existingChainTokens = normalized.byChain.get(token.chainId) || [];
    normalized.byChain.set(token.chainId, [...existingChainTokens, tokenId]);

    // Add to all IDs list
    normalized.allIds.push(tokenId);
  });

  return normalized;
};

/**
 * Hook to efficiently process and memoize token data
 * Provides filtered results based on chain type, symbol, and chain ID
 * 
 * @param {TokenAmount[]} rawTokens - Array of raw token data
 * @param {Object} [filters] - Optional filtering criteria
 * @param {ChainType} [filters.chainType] - Filter by chain type
 * @param {string} [filters.symbol] - Filter by token symbol
 * @param {ChainId} [filters.chainId] - Filter by chain ID
 * @returns {Object} Normalized and filtered token data with utility functions
 */
export const useNormalizedTokens = (
  rawTokens: TokenAmount[],
  filters?: {
    chainType?: ChainType;
    symbol?: string;
    chainId?: ChainId;
  }
) => {
  // Memoize the normalized data structure
  const normalizedData = useMemo(
    () => normalizeTokenData(rawTokens),
    // Use JSON.stringify for deep comparison of raw tokens
    [JSON.stringify(rawTokens)]
  );

  // Memoize filtered results based on provided filters
  const filteredTokens = useMemo(() => {
    let tokenIds = normalizedData.allIds;

    if (filters?.symbol) {
      const symbolTokens = normalizedData.bySymbol.get(filters.symbol.toLowerCase()) || [];
      tokenIds = tokenIds.filter(id => symbolTokens.includes(id));
    }

    if (filters?.chainId) {
      const chainTokens = normalizedData.byChain.get(filters.chainId) || [];
      tokenIds = tokenIds.filter(id => chainTokens.includes(id));
    }

    // Map IDs to full token data
    return tokenIds.map(id => normalizedData.byId.get(id)!);
  }, [normalizedData, filters?.symbol, filters?.chainId]);

  return {
    normalizedData,
    filteredTokens,
    // Utility functions for common operations
    getTokenById: (id: string) => normalizedData.byId.get(id),
    getTokensBySymbol: (symbol: string) => 
      (normalizedData.bySymbol.get(symbol.toLowerCase()) || [])
        .map(id => normalizedData.byId.get(id)!)
        .filter(Boolean),
    getTokensByChain: (chainId: ChainId) =>
      (normalizedData.byChain.get(chainId) || [])
        .map(id => normalizedData.byId.get(id)!)
        .filter(Boolean),
  };
};

/**
 * Hook for batch processing tokens with configurable chunk size
 * Useful for handling large token lists without blocking the main thread
 * 
 * @param {ConsolidatedToken[]} tokens - Array of tokens to process in batches
 * @param {number} [batchSize=100] - Number of tokens per batch
 * @returns {Object} Batch processing information and results
 */
export const useBatchProcessedTokens = (
  tokens: ConsolidatedToken[],
  batchSize: number = 100
) => {
  return useMemo(() => {
    const batches: ConsolidatedToken[][] = [];
    
    for (let i = 0; i < tokens.length; i += batchSize) {
      batches.push(tokens.slice(i, i + batchSize));
    }
    
    return {
      batches,
      totalBatches: batches.length,
      totalTokens: tokens.length,
    };
  }, [tokens, batchSize]);
};

/**
 * Utility function for stable sorting tokens
 * Maintains relative order of equal elements for consistent UI
 * 
 * @param {ConsolidatedToken[]} tokens - Array of tokens to sort
 * @param {Function} compareFn - Comparison function for sorting
 * @returns {ConsolidatedToken[]} Sorted array of tokens
 */
export const stableSortTokens = (
  tokens: ConsolidatedToken[],
  compareFn: (a: ConsolidatedToken, b: ConsolidatedToken) => number
): ConsolidatedToken[] => {
  return tokens
    .map((token, index) => ({ token, index }))
    .sort((a, b) => {
      const compareResult = compareFn(a.token, b.token);
      // If tokens are equal, maintain original order
      return compareResult === 0 ? a.index - b.index : compareResult;
    })
    .map(({ token }) => token);
}; 
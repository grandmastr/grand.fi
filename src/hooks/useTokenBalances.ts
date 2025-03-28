import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { ChainType, TokenAmount, getTokenBalancesByChain } from '@lifi/sdk';
import { formatUnits } from 'viem';
import { ConsolidatedToken } from '@/types/tokens';
import { useTokens } from '@/hooks';
import { useChainTypes } from '@/hooks';

/**
 * Interface for a token balance
 */
export interface TokenBalance {
  chainId: number;
  amount: string;
  formattedAmount: string;
  valueUSD: number;
}

/**
 * Interface for a token with its balances
 */
export interface TokenWithBalance extends ConsolidatedToken {
  balances: Record<number, TokenBalance>;
  totalValueUSD: number;
}

/**
 * Interface for balance fetching progress
 */
export interface BalanceProgress {
  processed: number;
  total: number;
  percentage: number;
}

/**
 * Extract connected chain types from accounts
 */
export const useConnectedChainTypes = (accounts: { chainType: ChainType }[]) => {
  return useMemo(() => {
    return Array.from(
      new Set(accounts.map((account) => account.chainType))
    ) as ChainType[];
  }, [accounts]);
};

/**
 * Extract wallet addresses grouped by chain type
 */
export const useWalletAddresses = (accounts: { address?: string; chainType: ChainType }[]) => {
  return useMemo(() => {
    const addresses: Record<ChainType, string[]> = {} as Record<ChainType, string[]>;

    // Initialize with empty arrays for all chain types
    Object.values(ChainType).forEach((chainType) => {
      addresses[chainType as ChainType] = [];
    });

    // Populate with connected wallets
    accounts.forEach((account) => {
      if (
        account.address &&
        !addresses[account.chainType].includes(account.address)
      ) {
        addresses[account.chainType].push(account.address);
      }
    });

    return addresses;
  }, [accounts]);
};

/**
 * Group tokens with the same symbol to consolidate balances
 */
export const groupTokensBySymbol = (tokens: TokenWithBalance[]): TokenWithBalance[] => {
  const grouped: Record<string, TokenWithBalance> = {};
  
  tokens.forEach((token: TokenWithBalance) => {
    const key = token.symbol;
    if (!grouped[key]) {
      grouped[key] = { ...token, balances: { ...token.balances } };
    } else {
      grouped[key].totalValueUSD += token.totalValueUSD;
      Object.keys(token.balances).forEach((chainKey: string) => {
        const numericChainKey = Number(chainKey);
        if (grouped[key].balances[numericChainKey]) {
          grouped[key].balances[numericChainKey].valueUSD += token.balances[numericChainKey].valueUSD;
        } else {
          grouped[key].balances[numericChainKey] = token.balances[numericChainKey];
        }
      });
    }
  });
  
  return Object.values(grouped);
};

/**
 * Create a map of chainId -> token[] for easier lookup
 */
export const organizeTokensByChain = (tokens: ConsolidatedToken[]): Record<number, ConsolidatedToken[]> => {
  const tokensByChain: Record<number, ConsolidatedToken[]> = {};
  
  tokens.forEach((token) => {
    token.networks.forEach((network) => {
      const { chainId } = network;
      if (!tokensByChain[chainId]) {
        tokensByChain[chainId] = [];
      }
      tokensByChain[chainId].push(token);
    });
  });
  
  return tokensByChain;
};

/**
 * Filter tokens for a specific chain
 */
export const prepareTokensForChain = (
  tokens: ConsolidatedToken[], 
  chainId: number
): any[] => {
  return tokens
    .map((token) => {
      const network = token.networks.find((n) => n.chainId === chainId);
      if (!network) return null;

      return {
        address: network.address,
        chainId,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
        logoURI: token.logoURI,
        priceUSD: token.priceUSD,
        coinKey: token.coinKey,
      };
    })
    .filter(Boolean);
};

/**
 * Process token balances and update tokens with balance information
 */
export const processTokenBalances = (
  chainId: number,
  balances: Record<number, TokenAmount[]>,
  enrichedTokens: TokenWithBalance[]
): TokenWithBalance[] => {
  if (!balances[chainId]) return enrichedTokens;
  
  const updatedTokens = [...enrichedTokens];
  
  balances[chainId].forEach((balance: TokenAmount) => {
    if (!balance.amount || balance.amount === 0n) return;

    const matchingToken = updatedTokens.find((token) =>
      token.networks.some(
        (n) =>
          n.chainId === chainId &&
          n.address.toLowerCase() === balance.address.toLowerCase()
      )
    );

    if (matchingToken) {
      const formattedAmount = formatUnits(balance.amount, balance.decimals);
      const valueUSD = parseFloat(formattedAmount) * parseFloat(balance.priceUSD || '0');

      if (!matchingToken.balances[chainId]) {
        matchingToken.balances[chainId] = {
          chainId,
          amount: balance.amount.toString(),
          formattedAmount,
          valueUSD,
        };
      } else {
        const existingBalance = matchingToken.balances[chainId];
        matchingToken.balances[chainId].valueUSD = existingBalance.valueUSD + valueUSD;
      }

      matchingToken.totalValueUSD += valueUSD;
    }
  });
  
  return updatedTokens;
};

/**
 * Sort tokens by their total USD value in descending order
 */
export const sortTokensByValue = (tokens: TokenWithBalance[]): TokenWithBalance[] => {
  return [...tokens].sort((a, b) => b.totalValueUSD - a.totalValueUSD);
};

/**
 * Hook to fetch balances for a specific wallet on a specific chain
 */
export const useFetchChainBalances = () => {
  return useCallback(async (
    walletAddress: string,
    chainId: number,
    tokensOnChain: any[]
  ): Promise<Record<number, TokenAmount[]>> => {
    if (!tokensOnChain.length) {
      return { [chainId]: [] };
    }
    
    try {
      // Create batch structure for getTokenBalancesByChain
      const batchTokensByChain = { [chainId]: tokensOnChain };
      
      // Get balances
      return await getTokenBalancesByChain(walletAddress, batchTokensByChain);
    } catch (err) {
      console.error(`Error fetching balances for chain ${chainId}:`, err);
      return { [chainId]: [] };
    }
  }, []);
};

/**
 * Main hook to fetch and attach balances to tokens
 * Optimized for handling thousands of tokens
 */
export const useTokenBalances = () => {
  const { accounts } = useAccount();
  const { data: tokens, isLoading: tokensLoading } = useTokens();
  const { groupedChains } = useChainTypes();
  const [tokensWithBalances, setTokensWithBalances] = useState<TokenWithBalance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<{ processed: number; total: number }>({ processed: 0, total: 0 });

  // Use extracted hooks
  const connectedChainTypes = useConnectedChainTypes(accounts);
  const walletAddresses = useWalletAddresses(accounts);
  const fetchChainBalances = useFetchChainBalances();

  // Fetch and attach balances to tokens
  useEffect(() => {
    // Skip if no tokens or no accounts
    if (tokensLoading || !tokens || !tokens.length || !accounts.length) {
      return;
    }

    const fetchAllBalances = async () => {
      setIsLoadingBalances(true);
      setError(null);

      try {
        // Set total tokens to track progress
        setProgress({ processed: 0, total: tokens.length });

        // Clone tokens to add balance information
        const enrichedTokens: TokenWithBalance[] = tokens.map((token) => ({
          ...token,
          balances: {},
          totalValueUSD: 0,
        }));

        // Organize tokens by chain
        const tokensByChain = organizeTokensByChain(tokens);

        // Process each ecosystem in parallel
        const allPromises: Promise<void>[] = [];
        
        for (const ecosystem of connectedChainTypes) {
          const wallets = walletAddresses[ecosystem];

          // Skip if no wallets for this ecosystem
          if (!wallets.length) continue;

          // Get chains for this ecosystem
          const ecosystemChains = groupedChains[ecosystem] || [];

          // Skip if no chains for this ecosystem
          if (!ecosystemChains.length) continue;

          // Get chain IDs for this ecosystem
          const chainIds = ecosystemChains.map((chain) => chain.id);

          // Process each wallet in this ecosystem
          for (const walletAddress of wallets) {
            // Process each chain separately
            for (const chainId of chainIds) {
              const chainTokens = tokensByChain[chainId];
              if (!chainTokens || chainTokens.length === 0) continue;

              // Process in batches
              const BATCH_SIZE = 20;
              
              for (let i = 0; i < chainTokens.length; i += BATCH_SIZE) {
                const batchTokens = prepareTokensForChain(
                  chainTokens.slice(i, i + BATCH_SIZE),
                  chainId
                );
                
                if (!batchTokens.length) continue;

                const promise = (async () => {
                  try {
                    // Get balances for this batch
                    const batchBalances = await fetchChainBalances(
                      walletAddress, 
                      chainId, 
                      batchTokens
                    );

                    // Update processed count
                    setProgress((prev) => ({
                      ...prev,
                      processed: prev.processed + batchTokens.length,
                    }));

                    // Process token balances
                    const updatedTokens = processTokenBalances(
                      chainId,
                      batchBalances,
                      enrichedTokens
                    );

                    // Group and sort tokens
                    const groupedTokens = groupTokensBySymbol(updatedTokens);
                    const sortedTokens = sortTokensByValue(groupedTokens);
                    
                    // Update state
                    setTokensWithBalances(sortedTokens);
                  } catch (error) {
                    console.error('Error processing batch:', error);
                  }
                })();
                
                allPromises.push(promise);
              }
            }
          }
        }

        // Wait for all promises to complete
        await Promise.all(allPromises);
        setIsLoadingBalances(false);
      } catch (error) {
        console.error('Error fetching balances:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setIsLoadingBalances(false);
      }
    };

    fetchAllBalances();
  }, [
    accounts,
    connectedChainTypes,
    fetchChainBalances,
    groupedChains,
    tokens,
    tokensLoading,
    walletAddresses,
  ]);

  // Calculate percentage for progress
  const calculatedProgress = useMemo(() => {
    if (progress.total === 0) return undefined;
    return {
      processed: progress.processed,
      total: progress.total,
      percentage: Math.round((progress.processed / progress.total) * 100),
    };
  }, [progress.processed, progress.total]);

  // Return in format that matches what components are expecting
  return {
    tokensWithBalances,
    isLoading: isLoadingBalances || tokensLoading,
    error,
    progress: calculatedProgress,
  };
};

export default useTokenBalances;

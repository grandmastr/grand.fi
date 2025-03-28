import { useState, useEffect, useMemo } from 'react';
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
 * Custom hook to fetch and attach balances to tokens from useTokens hook
 * Optimized for handling thousands of tokens
 */
export const useTokenBalances = () => {
  const { accounts } = useAccount();
  const { data: tokens, isLoading: tokensLoading } = useTokens();
  const { groupedChains } = useChainTypes();
  const [tokensWithBalances, setTokensWithBalances] = useState<
    TokenWithBalance[]
  >([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });

  // Get connected chain types from accounts
  const connectedChainTypes = useMemo(() => {
    return Array.from(
      new Set(accounts.map((account) => account.chainType)),
    ) as ChainType[];
  }, [accounts]);

  // Extract wallet addresses and chain types to avoid circular reference
  const walletAddresses = useMemo(() => {
    const addresses: Record<ChainType, string[]> = {} as Record<
      ChainType,
      string[]
    >;

    // Initialize with empty arrays for all chain types
    Object.values(ChainType).forEach((chainType) => {
      addresses[chainType as ChainType] = [];
    });

    // Populate with connected wallets
    accounts.forEach((account) => {
      // Add type guard to check if address is defined
      if (
        account.address &&
        !addresses[account.chainType].includes(account.address)
      ) {
        addresses[account.chainType].push(account.address);
      }
    });

    return addresses;
  }, [accounts]);

  // Fetch and attach balances to tokens
  useEffect(() => {
    // Skip if no tokens or no accounts
    if (tokensLoading || !tokens || !tokens.length || !accounts.length) {
      return;
    }

    const fetchBalances = async () => {
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

        const groupTokens = (tokens: TokenWithBalance[]): TokenWithBalance[] => {
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

        // Group tokens by chain for easier access
        const tokensByChain: Record<number, typeof tokens> = {};

        // Organize tokens by chain
        tokens.forEach((token) => {
          token.networks.forEach((network) => {
            const { chainId } = network;
            if (!tokensByChain[chainId]) {
              tokensByChain[chainId] = [];
            }
            tokensByChain[chainId].push(token);
          });
        });

        // Process each ecosystem in parallel
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
            try {
              // Create a map of chainId -> token[] for this ecosystem
              const relevantTokensByChain: Record<number, any[]> = {};

              // Filter for chains in this ecosystem
              chainIds.forEach((chainId) => {
                if (tokensByChain[chainId]) {
                  relevantTokensByChain[chainId] = tokensByChain[chainId]
                    .map((token) => {
                      const network = token.networks.find(
                        (n) => n.chainId === chainId,
                      );
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
                }
              });

              // Process tokens in batches to avoid rate limiting
              const BATCH_SIZE = 20;
              const batchPromises: Promise<void>[] = [];

              // Process each chain separately
              for (const chainId of chainIds) {
                const chainTokens = relevantTokensByChain[chainId];
                if (!chainTokens || chainTokens.length === 0) continue;

                // Process in batches concurrently
                for (let i = 0; i < chainTokens.length; i += BATCH_SIZE) {
                  const batchTokens = chainTokens.slice(i, i + BATCH_SIZE);
                  const promise = (async () => {
                    try {
                      // Create batch structure for getTokenBalancesByChain
                      const batchTokensByChain = { [chainId]: batchTokens };
                      
                      // Get balances for this batch
                      const batchBalances = await getTokenBalancesByChain(walletAddress, batchTokensByChain);

                      if (batchBalances[chainId]) {
                        // Update processed count
                        setProgress((prev) => ({
                          ...prev,
                          processed: prev.processed + batchTokens.length,
                        }));

                        batchBalances[chainId].forEach((balance: TokenAmount) => {
                          if (!balance.amount || balance.amount === 0n) return;

                          const matchingToken = enrichedTokens.find((token) =>
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
                        // Immediately update the tokensWithBalances state with current enrichedTokens sorted by decreasing balance
                        const groupedTokens = groupTokens(enrichedTokens);
                        const sortedTokens = groupedTokens.sort((a: TokenWithBalance, b: TokenWithBalance) => b.totalValueUSD - a.totalValueUSD);
                        setTokensWithBalances(sortedTokens);
                      }
                    } catch (err) {
                      console.error(`Error fetching batch balances for chain ${chainId}:`, err);
                    }
                    // Removed the 50ms delay to allow concurrent execution
                  })();
                  batchPromises.push(promise);
                }
              }

              // Wait for all batch fetches concurrently
              await Promise.all(batchPromises);
            } catch (err) {
              console.error(`Error processing wallet ${walletAddress}:`, err);
              continue;
            }
          }
        }

        // Final update at the end of fetchBalances
        const finalGroupedTokens = groupTokens(enrichedTokens);
        const finalSortedTokens = finalGroupedTokens.sort((a: TokenWithBalance, b: TokenWithBalance) => b.totalValueUSD - a.totalValueUSD);
        setTokensWithBalances(finalSortedTokens);
      } catch (err) {
        console.error('Error fetching token balances:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch token balances'),
        );
      } finally {
        setIsLoadingBalances(false);
      }
    };

    fetchBalances();
  }, [
    tokens,
    tokensLoading,
    accounts,
    connectedChainTypes,
    walletAddresses,
    groupedChains,
  ]);

  return {
    tokensWithBalances,
    isLoading: tokensLoading || isLoadingBalances,
    error,
    progress:
      progress.total > 0
        ? {
            processed: progress.processed,
            total: progress.total,
            percentage: Math.round((progress.processed / progress.total) * 100),
          }
        : undefined,
  };
};

export default useTokenBalances;

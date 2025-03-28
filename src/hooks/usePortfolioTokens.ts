import { useEffect, useState } from 'react';
import { Token, TokenAmount, getTokens, getTokenBalances } from '@lifi/sdk';
import { useAccount } from 'wagmi';
import { useChains } from '@/hooks/useChains';
import { getBalance } from '@/utils/portfolio/fetchTokenBalancesBatched';

interface TokenLoadingState {
  loading: boolean;
  progress: { completed: number; total: number };
  error: Error | null;
}

const BATCH_SIZE = 10;
const FETCH_DELAY = 500;

export function usePortfolioTokens() {
  const { address } = useAccount();
  const { chains, isSuccess: chainsLoaded } = useChains();
  const [loadingState, setLoadingState] = useState<TokenLoadingState>({
    loading: false,
    progress: { completed: 0, total: 0 },
    error: null
  });
  const [tokenBalances, setTokenBalances] = useState<TokenAmount[]>([]);

  useEffect(() => {
    if (!address || !chains.length || !chainsLoaded) {
      console.log('Prerequisites not met:', { address, chainCount: chains.length, chainsLoaded });
      return;
    }

    const fetchBalances = async () => {
      console.log('Starting to fetch balances for address:', address);
      setLoadingState(prev => ({ ...prev, loading: true, error: null }));
      setTokenBalances([]);

      try {
        console.log('Fetching tokens for chains:', chains.map(chain => chain.id));
        const tokensResponse = await getTokens({
          chains: chains.map(chain => chain.id)
        });
        console.log('Tokens response:', tokensResponse);

        const totalTokens = Object.values(tokensResponse.tokens)
          .reduce((sum, chainTokens) => sum + (chainTokens?.length || 0), 0);
        console.log('Total tokens to process:', totalTokens);

        setLoadingState(prev => ({
          ...prev,
          progress: { completed: 0, total: totalTokens }
        }));

        let completed = 0;

        for (const chain of chains) {
          console.log('Processing chain:', chain.id, chain.name);
          const chainTokens = tokensResponse.tokens[chain.id];
          if (!chainTokens?.length) {
            console.log('No tokens for chain:', chain.id);
            continue;
          }
          console.log('Token count for chain:', chain.id, chainTokens.length);

          for (let i = 0; i < chainTokens.length; i += BATCH_SIZE) {
            try {
              const batch = chainTokens.slice(i, i + BATCH_SIZE);
              console.log(`Processing batch ${i / BATCH_SIZE + 1} for chain ${chain.id}, size:`, batch.length);
              const balances = await getTokenBalances(address, batch);
              console.log('Received balances:', balances);

              const validBalances = balances.filter(token => {
                const balance = getBalance(token);
                const isValid = balance > 0 && token.priceUSD && parseFloat(token.priceUSD) > 0;
                if (isValid) {
                  console.log('Valid token found:', {
                    symbol: token.symbol,
                    balance,
                    priceUSD: token.priceUSD,
                    value: balance * parseFloat(token.priceUSD)
                  });
                }
                return isValid;
              });

              console.log('Valid balances in this batch:', validBalances.length);

              if (validBalances.length > 0) {
                setTokenBalances(prev => {
                  const newBalances = [...prev, ...validBalances];
                  const sortedBalances = newBalances.sort((a, b) => {
                    const aValue = getBalance(a) * parseFloat(a.priceUSD || '0');
                    const bValue = getBalance(b) * parseFloat(b.priceUSD || '0');
                    return bValue - aValue;
                  });
                  console.log('Updated token balances count:', sortedBalances.length);
                  return sortedBalances;
                });
              }

              completed += batch.length;
              setLoadingState(prev => ({
                ...prev,
                progress: { completed, total: totalTokens }
              }));

              if (i + BATCH_SIZE < chainTokens.length) {
                await new Promise(resolve => setTimeout(resolve, FETCH_DELAY));
              }
            } catch (error) {
              console.error(`Error fetching balances for chain ${chain.id}, batch ${i}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching token balances:', error);
        setLoadingState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Failed to fetch token balances')
        }));
      } finally {
        console.log('Finished fetching all balances');
        setLoadingState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBalances();
  }, [address, chains, chainsLoaded]);

  return {
    tokens: tokenBalances,
    loading: loadingState.loading,
    progress: loadingState.progress,
    error: loadingState.error
  };
}

import { useQuery } from '@tanstack/react-query';
import { useAccount } from '@lifi/wallet-management';
import { getTokens } from '@lifi/sdk';
import { TokensResponse, ConsolidatedToken, Token } from '@/types/tokens';
import consolidateTokens from '@/utils/consolidateTokens';

export function useTokenList() {
  const { accounts } = useAccount();

  // Get unique chain types from connected accounts
  const connectedChainTypes = Array.from(
    new Set(
      accounts
        .filter((account) => account.isConnected)
        .map((account) => account.chainType),
    ),
  );

  return useQuery<ConsolidatedToken[]>({
    queryKey: ['tokenList', connectedChainTypes],
    queryFn: async () => {
      // If no accounts connected, return empty list
      if (!connectedChainTypes.length) {
        return [];
      }

      // Fetch tokens for connected chain types
      const { tokens: sdkTokens } = await getTokens({
        chainTypes: connectedChainTypes,
      });

      // Transform SDK tokens to our internal token format
      const tokens: TokensResponse['tokens'] = {};
      for (const [chainId, chainTokens] of Object.entries(sdkTokens)) {
        tokens[parseInt(chainId)] = chainTokens.map((token) => ({
          address: token.address,
          decimals: token.decimals,
          symbol: token.symbol,
          chainId: parseInt(chainId),
          coinKey: token.coinKey || token.symbol,
          name: token.name,
          logoURI: token.logoURI || '',
          priceUSD: token.priceUSD || '0',
        }));
      }

      // Use existing consolidateTokens utility
      return consolidateTokens(tokens);
    },
    // Refetch when window regains focus or network reconnects
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Cache for 1 hour
    staleTime: 1000 * 60 * 60,
  });
}

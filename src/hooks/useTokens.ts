import { consolidateTokens } from '@/utils';
import type { TokensResponse } from '@/types/tokens';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from '@lifi/wallet-management';
import { ChainType } from '@lifi/sdk';

/**
 * Fetches tokens from LI.FI API for specified chain types
 * @param chainTypes Array of chain types to fetch tokens for
 * @returns The consolidated tokens
 */
export async function fetchTokens(chainTypes: string[] | undefined) {
  if (!(chainTypes && chainTypes.length)) return [];

  const apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL;

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_LIFI_API_URL environment variable.');
  }

  const API_ENDPOINT = `${apiUrl}/tokens`;
  const params = new URLSearchParams({ chainTypes: chainTypes.join(',') });
  const url = `${API_ENDPOINT}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      `Error fetching token list from LI.FI API: ${response.status}`,
    );
    throw new Error(`Failed to fetch token list: ${response.status}`);
  }

  const data: TokensResponse = await response.json();
  const tokensResponse = data.tokens;
  return consolidateTokens(tokensResponse || {});
}

// React Query hook
export const useTokens = () => {
  const { accounts } = useAccount();
  const chainTypes: ChainType[] = accounts.map((account) => account.chainType);

  return useQuery({
    queryKey: ['tokens', chainTypes.length],
    queryFn: () => fetchTokens(chainTypes),
  });
};

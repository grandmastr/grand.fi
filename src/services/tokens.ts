import { ChainType, TokensResponse as LiFiTokensResponse } from '@lifi/sdk';
import { consolidateTokens } from '@/utils';
import { TokensResponse } from '@/types/tokens';

/**
 * Fetches and returns consolidated tokens from the LI.FI API
 * @returns {Promise<any>} The consolidated tokens
 * @throws {Error} If API URL is missing or fetch fails
 */
export async function fetchTokens() {
  const apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL;

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_LIFI_API_URL environment variable.');
  }

  const API_ENDPOINT = `${apiUrl}/tokens`;
  const chainTypes: string[] = [ChainType.EVM, ChainType.UTXO, ChainType.SVM];
  const params = new URLSearchParams({ chainTypes: chainTypes.join(',') });
  const url = `${API_ENDPOINT}?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `Failed to fetch token list: ${response.status}`;
      console.error(
        `Error fetching token list from LI.FI API: ${response.status}`,
      );
      throw new Error(errorMessage);
    }

    const data: LiFiTokensResponse = await response.json();
    if (!data || !data.tokens) {
      throw new Error('Invalid token data received from API');
    }

    // Convert LiFi tokens to our local token format with proper type handling
    const localTokensResponse: TokensResponse = {
      tokens: Object.entries(data.tokens).reduce(
        (acc, [chainId, tokens]) => {
          const numericChainId = parseInt(chainId, 10);
          acc[numericChainId] = tokens
            .filter((token) => token.logoURI && token.address && token.symbol)
            .map((token) => ({
              address: token.address,
              decimals: token.decimals,
              symbol: token.symbol,
              chainId: token.chainId,
              coinKey: token.coinKey || '',
              name: token.name,
              logoURI: token.logoURI || '',
              priceUSD: token.priceUSD,
            }));
          return acc;
        },
        {} as { [chainId: number]: TokensResponse['tokens'][number] },
      ),
    };

    return consolidateTokens(localTokensResponse.tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
}

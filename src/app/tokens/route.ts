import { consolidateTokens } from '@/utils';
import type { TokensResponse } from '@/types/tokens';
import { ChainType } from '@lifi/sdk';

export const dynamic = 'force-static';

const apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL;

if (!apiUrl) {
  throw new Error('Missing NEXT_PUBLIC_LIFI_API_URL environment variable.');
}

const API_ENDPOINT = `${apiUrl}/tokens`;
const chainTypes: string[] = [ChainType.EVM, ChainType.UTXO];
const params = new URLSearchParams({ chainTypes: chainTypes.join(',') });
const url = `${API_ENDPOINT}?${params.toString()}`;

export async function GET(): Promise<Response> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error fetching token list from LI.FI API: ${response.status}`);
      return Response.json(
        { error: 'Failed to fetch token list', status: response.status },
        { status: response.status },
      );
    }

    const data: TokensResponse = await response.json();
    const tokensResponse = data.tokens;
    // Ensure consolidateTokens handles potential undefined input
    const tokens = consolidateTokens(tokensResponse || {});

    return Response.json(tokens);
  } catch (error) {
    console.error('Internal server error in /tokens route:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { TokenAmount } from '@lifi/sdk';

// Define a TypeScript interface for a Token
export interface Token {
  address: string;
  decimals: number;
  symbol: string;
  chainId: number;
  coinKey: string;
  name: string;
  logoURI: string;
  priceUSD: string;
}

// Define a TypeScript interface for the tokens object structure
export interface TokensResponse {
  tokens: {
    [chainId: number]: Token[];
  };
}

export interface ConsolidatedToken extends TokenAmount {
  id: string;
  sortKey: string;
}

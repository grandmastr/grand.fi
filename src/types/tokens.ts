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

// Define a network entry for consolidated tokens
export interface TokenNetwork {
  chainId: number;
  address: string;
}

export interface ConsolidatedToken extends Token {
  id: string;
  symbol: string;
  address: string;
  coinKey: string;
  sortKey: string;
  priceUSD: string;
  decimals: number;
  name: string;
  logoURI: string;
  networks: TokenNetwork[];
}

import { Token, TokenAmount, getTokenBalances } from '@lifi/sdk';
import { formatUnits } from 'viem';

const BATCH_SIZE = 7;
const FETCH_DELAY = 500;
const MAX_RETRIES = 3;

/**
 * Format token balance with proper decimals
 */
export function getBalance(token: TokenAmount): number {
  if (!token.amount) return 0;
  return parseFloat(formatUnits(token.amount, token.decimals));
}

/**
 * Sleep utility for rate limiting
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch token balances in batches with rate limiting and retries
 * @param account Wallet address
 * @param chainTokens Map of chain IDs to tokens
 * @param onProgress Optional callback for progress updates
 * @returns Array of tokens with balances
 */
export async function fetchTokenBalancesBatched(
  account: string,
  chainTokens: Record<string, Token[]>,
  onProgress?: (completed: number, total: number) => void
): Promise<TokenAmount[]> {
  let completed = 0;
  const total = Object.values(chainTokens).reduce((sum, tokens) => sum + tokens.length, 0);
  const allBalances: TokenAmount[] = [];

  for (const [chainId, tokens] of Object.entries(chainTokens)) {
    // Process tokens in batches
    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
      const batch = tokens.slice(i, i + BATCH_SIZE);
      let retryCount = 0;
      let success = false;

      while (retryCount < MAX_RETRIES && !success) {
        try {
          const balances = await getTokenBalances(account, batch);
          allBalances.push(...balances);
          completed += batch.length;
          
          if (onProgress) {
            onProgress(completed, total);
          }

          success = true;
        } catch (error) {
          retryCount++;
          const isRPCError = error instanceof Error && 
            (error.message.includes('403') || 
             error.message.includes('429') || 
             error.message.includes('rate limit'));

          if (isRPCError) {
            console.error(`RPC rate limit error for chain ${chainId}, batch ${i}. Attempt ${retryCount}/${MAX_RETRIES}:`, error);
            // Exponential backoff for RPC errors
            await sleep(FETCH_DELAY * Math.pow(2, retryCount));
          } else {
            console.error(`Error fetching balances for chain ${chainId}, batch ${i}:`, error);
            if (retryCount === MAX_RETRIES) {
              // Skip this batch after max retries
              completed += batch.length;
              if (onProgress) {
                onProgress(completed, total);
              }
            }
            await sleep(FETCH_DELAY);
          }
        }
      }

      if (i + BATCH_SIZE < tokens.length) {
        await sleep(FETCH_DELAY);
      }
    }
  }

  return allBalances.filter(token => token.amount && token.amount > BigInt(0));
}

/**
 * Calculate cumulative balance for tokens across chains
 * @param balances Array of token balances
 * @returns Array of cumulative balances
 */
export function calculateCumulativeBalances(balances: TokenAmount[]): TokenAmount[] {
  const symbolMap = new Map<string, TokenAmount>();

  for (const balance of balances) {
    const existing = symbolMap.get(balance.symbol);
    if (existing) {
      const existingBalance = existing.amount || BigInt(0);
      const newBalance = balance.amount || BigInt(0);
      existing.amount = existingBalance + newBalance;
    } else {
      symbolMap.set(balance.symbol, { ...balance });
    }
  }

  return Array.from(symbolMap.values());
} 
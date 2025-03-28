import { test, expect } from '@playwright/test';
import { ChainType } from '@lifi/sdk';
  
const mockTokens = [
  { symbol: 'ETH', priceUSD: '3500', chainId: 1, address: '0x123' },
  { symbol: 'USDC', priceUSD: '1', chainId: 1, address: '0x456' }
];

const fetchTokens = async (chainTypes: ChainType[]): Promise<any[]> => {
  if (chainTypes.length === 0) return [];
  
  if (!process.env.NEXT_PUBLIC_LIFI_API_URL) {
    throw new Error('Missing NEXT_PUBLIC_LIFI_API_URL');
  }
  
  const url = `${process.env.NEXT_PUBLIC_LIFI_API_URL}/tokens?chainTypes=${chainTypes.join(',')}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch token list');
    }
    const data = await response.json();
    return data.tokens || [];
  } catch (error) {
    throw new Error(`Error fetching token list from LI.FI API: ${error}`);
  }
};

// Tests for the fetchTokens function
test.describe('fetchTokens function', () => {
  // Original fetch to restore after tests
  const originalFetch = global.fetch;
  
  test.beforeEach(() => {
    // Mock fetch for each test
    global.fetch = async (url: RequestInfo | URL) => {
      return {
        ok: true,
        json: async () => ({ tokens: mockTokens })
      } as Response;
    };
    
    // Set environment variable
    process.env.NEXT_PUBLIC_LIFI_API_URL = 'https://li.fi/api';
  });
  
  test.afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });
  
  test('should fetch tokens from the API for specified chain types', async () => {
    let requestedUrl = '';
    global.fetch = async (url: RequestInfo | URL) => {
      requestedUrl = url.toString();
      return {
        ok: true,
        json: async () => ({ tokens: mockTokens })
      } as Response;
    };
    
    await fetchTokens([ChainType.EVM]);
    
    expect(requestedUrl).toBe('https://li.fi/api/tokens?chainTypes=EVM');
  });
  
  test('should return empty array when no chain types are provided', async ({ page }) => {
    // Create a spy for fetch
    let fetchCalled = false;
    global.fetch = async (url: RequestInfo | URL) => {
      fetchCalled = true;
      return {
        ok: true,
        json: async () => ({ tokens: mockTokens })
      } as Response;
    };
    
    const result = await fetchTokens([]);
    
    expect(fetchCalled).toBe(false);
    expect(result).toEqual([]);
  });
  
  test('should throw an error when the API request fails', async () => {
    global.fetch = async () => {
      return {
        ok: false,
        status: 500
      } as Response;
    };
    
    let errorThrown = false;
    try {
      await fetchTokens([ChainType.EVM]);
    } catch (error) {
      errorThrown = true;
      expect(String(error)).toContain('Failed to fetch token list');
    }
    
    expect(errorThrown).toBe(true);
  });
  
  test('should throw an error when API URL is missing', async () => {
    // Temporarily remove the API URL
    const savedUrl = process.env.NEXT_PUBLIC_LIFI_API_URL;
    delete process.env.NEXT_PUBLIC_LIFI_API_URL;
    
    let errorThrown = false;
    try {
      await fetchTokens([ChainType.EVM]);
    } catch (error) {
      errorThrown = true;
      expect(String(error)).toContain('Missing NEXT_PUBLIC_LIFI_API_URL');
    }
    
    // Restore API URL
    process.env.NEXT_PUBLIC_LIFI_API_URL = savedUrl;
    expect(errorThrown).toBe(true);
  });
}); 
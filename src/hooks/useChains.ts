import { useEffect, useMemo, useState } from 'react';
import {
  ChainId,
  ChainType,
  ExtendedChain,
  getChains,
  TokenAmount,
} from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';

/**
 * Chain data access interface
 * Provides access to blockchain chains and utility functions
 */
export interface ChainProps {
  chains: ExtendedChain[];
  isSuccess: boolean;
  getChainById: (id: ChainId) => ExtendedChain | undefined;
}

/**
 * Chain grouping interface
 * Organizes chains by their type (EVM, SVM, UTXO)
 */
export interface ChainGroups {
  groupedChains: {
    [chainType in ChainType]?: ExtendedChain[];
  };
}

// Utility function to get human readable balance
const getBalance = (tokenBalance: Partial<TokenAmount>): number => {
  return tokenBalance?.amount && tokenBalance?.decimals
    ? Number(formatUnits(tokenBalance.amount, tokenBalance.decimals))
    : 0;
};

/**
 * Fetches supported blockchain chains from LI.FI API
 *
 * Retrieves chains of type EVM, SVM (Solana), and UTXO (Bitcoin)
 * Falls back to an empty array on error
 *
 * @returns {Promise<{chains: ExtendedChain[]}>} Object containing array of chains
 */
const getChainsQuery = async (): Promise<{ chains: ExtendedChain[] }> => {
  try {
    const chains = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO],
    });
    return { chains };
  } catch (error) {
    console.warn('Error fetching chains, using fallback data:', error);
    return { chains: [] };
  }
};

/**
 * Hook for accessing blockchain chain data
 *
 * Provides:
 * - List of supported chains
 * - Success state of chain fetching
 * - Utility to find chain by ID
 *
 * @returns {ChainProps} Chain data and utility functions
 */
export const useChains = (): ChainProps => {
  const { data, isSuccess } = useQuery({
    queryKey: ['connected_chains'],
    queryFn: getChainsQuery,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Retrieves a chain by its ID
   *
   * @param {ChainId} id - The ID of the chain to retrieve
   * @returns {ExtendedChain | undefined} The chain with the specified ID or undefined if not found
   */
  const getChainById = (id: ChainId): ExtendedChain | undefined => {
    return data?.chains?.find((chain) => chain.id === id);
  };

  return {
    getChainById,
    chains: data?.chains || [],
    isSuccess,
  };
};

/**
 * A hook for accessing chains grouped by their type
 * Uses Object.groupBy to organize chains into EVM, SVM (Solana), and UTXO (Bitcoin) categories
 * @returns {ChainGroups} Object containing chains grouped by type
 */
export const useChainTypes = (): ChainGroups => {
  const { chains } = useChains();

  // Group chains by their chainType property
  const groupedChains = useMemo(() => {
    const groups: { [key in ChainType]?: ExtendedChain[] } = {};
    chains.forEach((chain) => {
      if (!groups[chain.chainType]) {
        groups[chain.chainType] = [];
      }
      groups[chain.chainType]?.push(chain);
    });
    return groups;
  }, [chains]);

  return { groupedChains };
};

/**
 * EVM Wallet Provider
 *
 * Provides wallet connection functionality for Ethereum Virtual Machine (EVM) compatible blockchains.
 * Implements Wagmi for EVM wallet connections, supporting MetaMask, Coinbase, and WalletConnect.
 *
 * This provider ensures only one EVM wallet can be connected at a time, fulfilling the
 * one-wallet-per-ecosystem requirement.
 */
'use client';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { useChains } from '@/hooks/useChains';
import type { ExtendedChain } from '@lifi/sdk';
import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from '@lifi/wallet-management';
import { type FC, type PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

/**
 * Default Wagmi configuration for supported EVM wallets
 * Creates a configuration with predefined wallet connectors and settings
 */
const { config, connectors } = createDefaultWagmiConfig({
  coinbase: defaultCoinbaseConfig,
  metaMask: defaultMetaMaskConfig,
  walletConnect: defaultWalletConnectConfig,
  lazy: true,
});

/**
 * EVM Provider Component
 *
 * Wraps the application with WagmiProvider to enable EVM wallet connections.
 * Uses chains data from the useChains hook to synchronize supported chains with Wagmi.
 *
 * @param {PropsWithChildren} props - React children to be wrapped with the provider
 * @returns {React.ReactElement} Provider component with children
 */
export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useChains();

  // Synchronize the Wagmi configuration with the current chains
  useSyncWagmiConfig(config, connectors, chains as ExtendedChain[]);

  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      {children}
    </WagmiProvider>
  );
};

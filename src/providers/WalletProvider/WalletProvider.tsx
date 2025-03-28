/**
 * Multi-Chain Wallet Provider
 *
 * Root provider component that orchestrates wallet connections across multiple blockchain ecosystems:
 * - Ethereum Virtual Machine (EVM): Ethereum, Polygon, BSC, etc.
 * - Solana Virtual Machine (SVM): Solana
 * - UTXO: Bitcoin
 *
 * This provider architecture ensures that one wallet from each ecosystem can be connected
 * simultaneously, while enforcing that only one wallet per ecosystem is active at any time.
 */
'use client';
import { type FC, type PropsWithChildren, useMemo } from 'react';
import { createConfig, EVM, Solana, UTXO } from '@lifi/sdk';
import type { WalletManagementConfig } from '@lifi/wallet-management';
import { WalletManagementProvider } from '@lifi/wallet-management';
import { EVMProvider } from './EVMProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { publicRPCList } from '@/const/rpcList';
import getApiUrl from '@/utils/getApiUrl';

/**
 * Main Wallet Provider Component
 *
 * Initializes LI.FI SDK configuration and nests the blockchain-specific providers
 * in the correct order to enable multi-chain wallet connections.
 *
 * @param {PropsWithChildren} props - React children to be wrapped with the providers
 * @returns {React.ReactElement} Nested provider components with children
 */
export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  // Initialize LI.FI SDK with support for all required blockchain ecosystems
  createConfig({
    apiUrl: getApiUrl(),
    providers: [EVM(), Solana(), UTXO()],
    integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR || 'grand.fi',
    rpcUrls: {
      ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS || '{}'),
      ...publicRPCList,
    },
    preloadChains: true,
  });

  // Nest providers to enable simultaneous connections to different ecosystems
  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <WalletMenuProvider>{children}</WalletMenuProvider>
        </SVMProvider>
      </UTXOProvider>
    </EVMProvider>
  );
};

/**
 * Wallet Menu Provider Component
 *
 * Provides the UI components for wallet selection and management.
 * Configures supported wallets with their specific settings.
 *
 * @param {PropsWithChildren} props - React children to be wrapped with the provider
 * @returns {React.ReactElement} Provider component with children
 */
const WalletMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const config: WalletManagementConfig = useMemo(() => {
    return {
      locale: 'en',
      metaMask: defaultMetaMaskConfig,
      coinbase: defaultCoinbaseConfig,
      walletConnect: defaultWalletConnectConfig,
    };
  }, []);

  return (
    <WalletManagementProvider config={config}>
      {children}
    </WalletManagementProvider>
  );
};

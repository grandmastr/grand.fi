/**
 * UTXO Wallet Provider
 *
 * Provides wallet connection functionality for Bitcoin and other UTXO-based blockchains.
 * Implements Bigmi for Bitcoin wallet connections, supporting standard Bitcoin wallets.
 *
 * This provider ensures only one UTXO wallet can be connected at a time, fulfilling the
 * one-wallet-per-ecosystem requirement.
 */
'use client';
import { createDefaultBigmiConfig } from '@lifi/wallet-management';
import React, { type FC, type PropsWithChildren } from 'react';
import { useReconnect, BigmiProvider } from '@bigmi/react';

/**
 * Default Bigmi configuration for Bitcoin wallets
 * Creates a configuration with optimized settings for UTXO chains
 */
const { config } = createDefaultBigmiConfig({
  bigmiConfig: {
    ssr: true,
    multiInjectedProviderDiscovery: false,
  },
});

/**
 * UTXO Provider Component
 *
 * Wraps the application with BigmiProvider to enable Bitcoin/UTXO wallet connections.
 * Uses the useReconnect hook to handle wallet reconnection logic.
 *
 * @param {PropsWithChildren} props - React children to be wrapped with the provider
 * @returns {React.ReactElement} Provider component with children
 */
export const UTXOProvider: FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  useReconnect(config);

  return (
    <BigmiProvider config={config} reconnectOnMount={true}>
      {children}
    </BigmiProvider>
  );
};

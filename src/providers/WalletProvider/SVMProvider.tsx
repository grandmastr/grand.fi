/**
 * Solana Virtual Machine (SVM) Wallet Provider
 *
 * Provides wallet connection functionality for Solana blockchain.
 * Implements Solana wallet adapter to enable connections to Solana-compatible wallets.
 *
 * This provider ensures only one Solana wallet can be connected at a time,
 * fulfilling the one-wallet-per-ecosystem requirement.
 *
 */
'use client';

import type { Adapter } from '@solana/wallet-adapter-base';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter';
import React, { type FC, type PropsWithChildren } from 'react';

/**
 * Solana RPC endpoint for the Mainnet network
 * Uses the official Solana cluster API URL
 */
const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet);

/**
 * Configured wallet adapters for Solana connections
 */
const wallets: Adapter[] = [
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    },
  }),
];

/**
 * Solana Provider Component
 *
 * Provides Solana wallet connection capabilities to the application.
 * Wraps children with ConnectionProvider for RPC connection and WalletProvider
 * for wallet functionality.
 *
 * @param {PropsWithChildren} props - React children to be wrapped with the provider
 * @returns {React.ReactElement} Provider component with children
 */
export const SVMProvider: FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

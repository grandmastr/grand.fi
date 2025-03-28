import { APP_NAME } from '@/const/metadata';
import type { CoinbaseWalletParameters } from 'wagmi/connectors';

/**
 * Default configuration parameters for Coinbase Wallet connection
 *
 * Specifies the application name to be displayed in the Coinbase Wallet
 * interface when users connect to the application.
 *
 * @property {string} appName - The name of the application shown in Coinbase Wallet
 *                              Uses the APP_NAME constant defined in application metadata
 */
export const defaultCoinbaseConfig: CoinbaseWalletParameters = {
  appName: APP_NAME,
};

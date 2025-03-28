import { APP_NAME } from '@/const/metadata';
import type { MetaMaskParameters } from 'wagmi/connectors';

/**
 * Default configuration parameters for MetaMask wallet connection
 *
 * Specifies the metadata that will be displayed in the MetaMask interface
 * when users connect to the application.
 */
export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: APP_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://grand.fi',
  },
};

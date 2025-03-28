import { APP_NAME, APP_DESCRIPTION } from '@/const/metadata';
import type { WalletConnectParameters } from 'wagmi/connectors';

/**
 * Default configuration parameters for WalletConnect integration
 *
 * Configures the WalletConnect v2 connection for the application,
 * including project identification, metadata, and UI customization.
 */
export const defaultWalletConnectConfig: WalletConnectParameters = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'https://grand.fi',
    icons: [],
  },
  qrModalOptions: {
    themeVariables: {
      '--wcm-z-index': '3000',
    },
  },
};

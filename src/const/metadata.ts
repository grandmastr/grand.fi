import { Metadata } from 'next';

/**
 * Application name used throughout the application
 * Displayed in browser tabs, wallet connections, and other interfaces
 */
export const APP_NAME = 'Grand.Fi';

/**
 * Short description of the application
 * Used in metadata and wallet connection interfaces
 */
export const APP_DESCRIPTION = 'Multi-Chain Wallet';

/**
 * Next.js metadata configuration
 *
 * Defines metadata properties used by Next.js for SEO and page rendering
 */
const METADATA: Metadata = {
  title: {
    default: 'APP_NAME', // NOTE: This appears to be a bug, should be APP_NAME variable instead of string
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default METADATA;

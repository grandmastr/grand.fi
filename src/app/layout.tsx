import React, { JSX } from 'react';
import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import METADATA from '@/const/metadata';
import { fonts } from '@/fonts/fonts';
import { ReactQueryProvider, ThemeProvider, WalletProvider } from '@/providers';
import { App, Navbar } from '@/components';

/**
 * Application metadata exported for Next.js
 * Imported from central metadata configuration
 */
export const metadata: Metadata = METADATA;

/**
 * Viewport configuration for responsive design
 */
export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

/**
 * Root layout component for the application
 *
 * Provides the foundational structure and provider context for all pages.
 * Implements a provider hierarchy:
 * 1. MUI cache provider for server components
 * 2. React Query for data fetching
 * 3. Theme provider for styling
 * 4. Wallet provider for blockchain connections
 * 5. App component with toast notifications
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page components from Next.js routing
 * @returns {JSX.Element} The complete HTML document structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fonts.map((f) => f.variable).join(' ')}>
        <AppRouterCacheProvider>
          <ReactQueryProvider>
            <ThemeProvider>
              <WalletProvider>
                <App>
                  <Navbar />
                  {children}
                </App>
              </WalletProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

/**
 * React Query Provider
 * 
 * Configures and provides the TanStack Query client for the application.
 * This provider handles data fetching, caching, and state management for asynchronous operations.
 * 
 * Key features:
 * - Prevents refetching on window focus for better user experience
 * - Disables automatic retry on failed requests
 * - Sets a 5-minute stale time for query results
 * 
 * @module Providers
 */
'use client';
import { type FC, type PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * React Query Provider Component
 * 
 * Initializes and provides the QueryClient with application-specific configuration.
 * Uses React's useState to ensure the QueryClient instance persists across re-renders.
 * 
 * @param {PropsWithChildren} props - React children to be wrapped with the provider
 * @returns {React.ReactElement} QueryClientProvider with configured client
 */
export const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  /**
   * Store QueryClient in state to ensure it persists across re-renders
   * This prevents creating a new client instance on each render
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

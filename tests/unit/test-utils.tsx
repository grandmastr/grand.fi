import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, ReactQueryProvider, WalletProvider } from '@/providers';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// Create a custom render function that includes all providers
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ReactQueryProvider>
        <ThemeProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </AppRouterCacheProvider>
  );
}

// Custom render with all providers
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 
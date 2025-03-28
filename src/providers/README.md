# Providers

This directory contains React context providers that manage global state and provide functionality to the component tree.

## Structure

- `ReactQueryProvider.tsx` - React Query provider setup and configuration
- `WalletProvider/` - Wallet connection and state management
- `ThemeProvider/` - Theme and styling context
- `index.ts` - Provider exports and composition

## Guidelines

- Keep provider logic focused and specific
- Document the context shape and available hooks
- Include TypeScript types for context values
- Provide meaningful default values
# Hooks

This directory contains React hooks that encapsulate reusable stateful logic across the application. These hooks follow React's composition pattern and provide clean abstractions for common functionality.

## Structure

- `wallet/` - Hooks for wallet connection, balances, and transaction management
- `contracts/` - Hooks for interacting with smart contracts
- `data/` - Hooks for data fetching and caching
- `ui/` - Hooks for UI state management and interactions
- `form/` - Hooks for form handling and validation

## Usage

Hooks should be imported and used in components to manage state and side effects:

```typescript
import { useWalletConnection } from 'src/hooks/wallet';
import { useTokenBalance } from 'src/hooks/contracts';
```

## Guidelines

- Follow the `use` prefix naming convention
- Keep hooks focused on a single responsibility
- Document parameters, return values, and side effects
- Include TypeScript types for parameters and return values
- Write unit tests for complex hooks
- Handle loading, error, and edge cases appropriately 
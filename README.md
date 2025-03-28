# Multi-Chain Wallet Integration

A React-based frontend application that enables users to connect wallets for multiple blockchain protocols (EVM, Solana, and UTXO) and displays their wallet balances. The solution is implemented using TypeScript and Next.js.

## Table of Contents

- [Objectives](#objectives)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Design Decisions and Assumptions](#design-decisions-and-assumptions)
- [Challenges and Constraints](#challenges-and-constraints)
- [Security Considerations](#security-considerations)

## Objectives

The main objective of this project is to create a user-friendly interface that allows users to:

1. Connect wallets from different blockchain ecosystems (EVM, Solana, and Bitcoin)
2. View a consolidated list of supported tokens across all chains
3. Display wallet balances for each connected wallet
4. Provide a seamless user experience for managing multi-chain assets

## Features

### Wallet Connectivity

- **EVM Wallets**: Connect to Ethereum and other EVM-compatible chains using MetaMask, Coinbase Wallet, or WalletConnect
- **Solana Wallets**: Connect to Solana blockchain using WalletConnect
- **Bitcoin Wallets**: Connect to Bitcoin and other UTXO-based chains using Bigmi
- One wallet from each ecosystem can be connected simultaneously

### Token List

- Fetches a comprehensive list of supported tokens from the LI.FI API
- Consolidates tokens across multiple chains to avoid duplication
- Displays token information including symbol, name, and supported networks
- Implements virtualized rendering for optimal performance with large token lists

### Balance Display

- Shows total balance for each connected wallet in USD
- Dynamically updates when wallets are connected or disconnected
- Provides loading states during balance fetching
- Displays wallet address with explorer links

## Technical Architecture

### Core Technologies

- **React 19**: For building the user interface
- **TypeScript**: For type-safe code with strict null checking and advanced type features
- **Next.js 15**: For server-side rendering, API routes, and optimized builds
- **Material UI**: For UI components and styling with custom theme support
- **React Query**: For data fetching, caching, and state management
- **Tanstack Virtual**: For virtualized rendering of large lists
- **Jest & React Testing Library**: For unit and component testing

### Blockchain Integration

- **Wagmi v2**: For EVM wallet connections (Ethereum, Polygon, etc.)
  - Implements EIP-1193 compliant provider interface
  - Handles account and chain switching events
  - Manages connection persistence across sessions
  - Supports multiple connector types (injected, WalletConnect, Coinbase)
- **Solana Wallet Adapter**: For Solana blockchain connections
  - Supports Phantom, Solflare, and other Solana wallets
  - Handles transaction signing and message verification
  - Manages connection state and wallet capabilities
  - Implements proper error handling for failed connections
- **Bigmi**: For Bitcoin/UTXO wallet connections
  - Provides UTXO-based transaction construction
  - Handles BIP-standard derivation paths
  - Manages address formats and validation
  - Supports multiple Bitcoin wallet implementations
- **LI.FI SDK**: For cross-chain functionality and data
  - Provides unified token list across multiple chains
  - Handles token price and balance aggregation
  - Normalizes chain and token data across ecosystems
  - Implements efficient caching and data refresh strategies

### Architecture Overview

The application follows a provider-based architecture with clear separation of concerns:

1. **WalletProvider**: Root provider that orchestrates wallet connections across multiple blockchain ecosystems

   - **EVMProvider**: Handles Ethereum and other EVM-compatible chains
     - Implements Wagmi configuration with connector management
     - Synchronizes chain configurations with application state
     - Handles EIP-1193 events and connection lifecycle
   - **SVMProvider**: Handles Solana blockchain
     - Configures RPC endpoints and network selection
     - Manages wallet adapter connection state
     - Handles Solana-specific transaction signing
   - **UTXOProvider**: Handles Bitcoin and other UTXO-based chains
     - Manages Bitcoin wallet connections and state
     - Handles UTXO-specific address formats and validation
     - Provides transaction construction utilities

2. **Data Flow Architecture**:
   - **Unidirectional Data Flow**: State changes propagate down through component tree
   - **Wallet Connection Lifecycle**:
     1. User initiates connection through UI
     2. Appropriate provider handles connection request
     3. Connection state is updated and propagated
     4. UI reflects connected state and displays balances
   - **Token Data Pipeline**:
     1. Token data fetched from LI.FI API at application startup
     2. Data normalized and consolidated across chains
     3. Virtualized rendering for efficient display
     4. Periodic refresh to maintain data accuracy
   - **Balance Calculation Pipeline**:
     1. Wallet connection triggers balance fetching
     2. Chain-specific balance queries executed in parallel
     3. Results aggregated and formatted for display
     4. Periodic refresh to maintain accuracy

### State Management

- **React Query**: Used for server state management, implementing advanced patterns:
  - **Optimistic Updates**: For immediate UI feedback during blockchain operations
  - **Query Invalidation Strategy**: Targeted invalidation to minimize refetching
  - **Prefetching**: Strategic data prefetching for common user flows
  - **Caching Configuration**: Custom staleTime and cacheTime for different data types:
    - Token list: Long cache (5 minutes)
    - Balances: Short cache (30 seconds)
    - Chain data: Medium cache (2 minutes)
  - **Retry Logic**: Custom retry strategies for different API endpoints
- **Library-provided State Management**: The project leverages state management provided by libraries:

  - **Wallet Connection State**:
    - Managed through @lifi/wallet-management
    - Handles connection persistence across sessions
    - Manages wallet capabilities and feature detection
  - **UI Theming**: Through MUI's ThemeProvider with custom theme configuration
  - **Blockchain Data**: Through specialized SDKs with normalized interfaces thanks to @lifi/wallet-management

- **Component State**: Local state using React hooks for UI-specific state:
  - **Loading States**: Granular loading states for different operations
  - **Error Handling**: Contextual error states with recovery options
  - **Form Management**: Controlled inputs with validation
  - **UI Interactions**: State for expanding/collapsing sections, modals, etc.

### Code Organization

- **Feature-based Structure**: Components organized by feature rather than type
- **Component Composition**: Complex UI elements built from smaller, reusable components
- **Separation of Concerns**:
  - Providers handle wallet connections and blockchain interactions
  - Hooks encapsulate data fetching and business logic
  - Components focus on rendering and user interactions
  - Utilities handle common operations and data transformations

## Setup and Installation

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_LIFI_API_URL=https://li.quest/v1
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_WIDGET_INTEGRATOR=grand.fi
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

## Running the Application

```bash
# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

The project uses Playwright for both unit and component testing. This allows us to test both business logic and UI components in a real browser environment, providing more reliable test results.

### Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/unit/hooks/useTokens.test.tsx

# Show last test report
npx playwright show-report
```

### Test Structure

- `tests/unit/` - Contains all unit tests
  - `tests/unit/components/` - Component-specific tests
  - `tests/unit/hooks/` - Custom hook tests
  - `tests/unit/test-utils.tsx` - Common test utilities and fixtures

### Custom Hook Tests

We've implemented comprehensive tests for some custom hooks:

### Mock Patterns

Tests follow consistent patterns for mocking external dependencies:

- API calls are mocked using Playwright's route interception
- Wallet providers are mocked with consistent interfaces
- Environment variables are carefully controlled during tests
- UI interactions are tested with realistic user behavior simulation

## Design Decisions and Assumptions

### Provider Architecture

- **Decision**: Implemented a nested provider architecture to allow simultaneous connections to different blockchain ecosystems.
- **Rationale**: This approach ensures that one wallet from each ecosystem can be connected at the same time, while maintaining isolation between different wallet types.
- **Technical Implementation**:
  - Providers are composed in a specific order to ensure proper dependency resolution
  - Each provider implements a consistent interface for wallet operations
  - Event propagation is handled to ensure state consistency across providers
  - Connection persistence is managed through local storage with encryption for sensitive data

### Token Consolidation

- **Decision**: Consolidated tokens across multiple chains based on their symbol.
- **Rationale**: This prevents duplicate tokens in the UI and provides a cleaner user experience, while still maintaining information about which networks each token is available on.
- **Technical Implementation**:
  - Uses a Map data structure for O(1) lookups by symbol
  - Handles edge cases like tokens with same symbol but different implementations
  - Preserves chain-specific metadata while consolidating display information
  - Implements efficient memory usage patterns for large token lists

### Virtualized Rendering

- **Decision**: Implemented virtualized rendering for the token list using @tanstack/react-virtual.
- **Rationale**: This optimizes performance when displaying large lists of tokens, ensuring smooth scrolling and reduced memory usage.
- **Technical Implementation**:
  - Only renders visible items plus a small overscan buffer
  - Implements efficient item height calculation and caching
  - Uses memoization to prevent unnecessary re-renders
  - Handles dynamic height adjustments for responsive layouts

### React Query for Data Fetching

- **Decision**: Used React Query for data fetching and state management.
- **Rationale**: Provides built-in caching, refetching, and loading states, which are essential for handling blockchain data that may change over time.
- **Technical Implementation**:
  - Implements custom query hooks for different data types
  - Uses staleTime and cacheTime configurations optimized for each data type
  - Implements retry logic with exponential backoff
  - Uses query invalidation strategies to minimize unnecessary refetching

### Component Composition

- **Decision**: Built complex UI components from smaller, reusable components.
- **Rationale**: Improves maintainability, testability, and reusability of the codebase.
- **Technical Implementation**:
  - Implements presentational and container component pattern
  - Uses composition over inheritance
  - Leverages React.memo for performance optimization
  - Implements prop drilling alternatives for deeply nested components

### Error Handling

- **Decision**: Implemented comprehensive error handling at multiple levels.
- **Rationale**: Blockchain operations can fail for various reasons, and proper error handling ensures a good user experience even when things go wrong.
- **Technical Implementation**:
  - Uses React Error Boundaries for component-level error handling
  - Implements custom error types for different blockchain operations
  - Provides user-friendly error messages with recovery options
  - Logs detailed error information for debugging

### Assumptions

- Users have at least one compatible wallet extension installed
- Users have basic understanding of blockchain wallets and how to use them
- The application will primarily be used on desktop devices, with responsive support for mobile
- Token prices and balances need to be updated periodically but not in real-time
- Network connectivity may be intermittent, requiring robust error handling

## Challenges and Constraints

### Cross-Chain Compatibility

- **Challenge**: Different blockchain ecosystems have different wallet connection mechanisms and data structures.
- **Solution**:
  - Implemented separate providers for each ecosystem with a unified interface
  - Created abstraction layers to normalize wallet interactions
  - Implemented chain-specific error handling and recovery mechanisms
  - Used TypeScript interfaces to ensure consistent implementation across providers

### Performance Optimization

- **Challenge**: Displaying and updating large lists of tokens can be performance-intensive.
- **Solution**:
  - Implemented virtualized rendering for token lists
  - Used efficient data structures for token consolidation
  - Implemented memoization for expensive calculations
  - Optimized component re-rendering with React.memo and useMemo
  - Implemented lazy loading for non-critical components

### Balance Calculation

- **Challenge**: Calculating balances across multiple chains and tokens requires multiple API calls.
- **Solution**:
  - Implemented batched requests to minimize API calls
  - Used React Query for efficient caching and refetching
  - Implemented parallel fetching for different chains
  - Added fallback mechanisms for failed requests
  - Optimized balance calculation algorithms for large token sets

### Testing Complexity

- **Challenge**: Testing wallet connections requires mocking complex blockchain interactions.
- **Solution**:
  - Implemented comprehensive mocking strategies for wallet providers
  - Created test utilities for common blockchain operations
  - Used Synpress for real wallet integration testing
  - Implemented snapshot testing for complex UI components
  - Created isolated test environments for different blockchain ecosystems

### State Management Complexity

- **Challenge**: Managing state across multiple blockchain ecosystems and UI components.
- **Solution**:
  - Used React Query for server state management
  - Leveraged library-provided state management for wallet connections
  - Implemented clear state boundaries between different parts of the application
  - Used TypeScript to ensure type safety across state transitions
  - Implemented debugging tools for state inspection during development

## Security Considerations

### Wallet Connection Security

- Implemented proper disconnection handling to prevent session persistence
- Used secure storage for connection state with encryption
- Implemented permission checks before executing wallet operations
- Added timeout handling for wallet connection requests

### Data Privacy

- Minimized storage of sensitive wallet information
- Implemented address obfuscation in the UI
- Used secure communication channels for API requests
- Avoided storing private keys or seed phrases

### Error Handling

- Implemented secure error logging that doesn't expose sensitive information
- Added fallback mechanisms for failed connections
- Provided clear user guidance for security-related errors
- Implemented rate limiting for repeated failed operations

### Third-Party Dependencies

- Regularly updated dependencies to include security patches
- Used trusted and well-maintained wallet connection libraries
- Implemented integrity checks for loaded resources
- Minimized dependency footprint to reduce attack surface

## Future Enhancements

The following features and improvements would enhance the application but were not included in the initial implementation due to time constraints or scope limitations:

### Enhanced UI/UX Design

- **Design System Implementation**: Create a comprehensive design system with consistent components, typography, and spacing
- **Dark/Light Mode Toggle**: Add support for user-selectable theme preferences
- **Responsive Mobile Optimization**: Enhance mobile experience with touch-optimized interactions
- **Animation and Transitions**: Add subtle animations for state changes and user interactions
- **Accessibility Improvements**: Implement ARIA attributes and keyboard navigation

### Advanced Wallet Features

- **Transaction History**: Display transaction history for connected wallets
- **NFT Support**: Add ability to view and manage NFTs across chains
- **Multiple Wallets Per Ecosystem**: Support connecting multiple wallets from the same ecosystem
- **Hardware Wallet Support**: Add dedicated support for hardware wallets like Ledger and Trezor
- **Custom RPC Configuration**: Allow users to specify custom RPC endpoints

### Performance Optimizations

- **Server-Side Rendering Optimization**: Improve SSR performance for initial page load
- **Code Splitting**: Implement more granular code splitting for faster loading
- **Web Worker Implementation**: Move heavy computations to web workers
- **Service Worker for Offline Support**: Add offline capabilities for basic functionality
- **Progressive Web App (PWA)**: Convert to a full PWA with installable capabilities

### Developer Experience

- **Storybook Integration**: Add Storybook for component documentation and visual testing
- **Enhanced Documentation**: Create comprehensive API documentation with examples
- **E2E Test Coverage**: Increase end-to-end test coverage for critical user flows
- **Performance Monitoring**: Implement performance monitoring and analytics
- **CI/CD Pipeline Improvements**: Enhance CI/CD pipeline with automated performance testing

### Backend and API Enhancements

- **Caching Layer**: Implement a server-side caching layer for token and price data
- **WebSocket Integration**: Add real-time updates for prices and balances
- **Custom API Endpoints**: Create optimized API endpoints for common operations
- **Rate Limiting and Throttling**: Implement more sophisticated rate limiting
- **Analytics Integration**: Add anonymous usage analytics for feature prioritization

## Future Improvements

- [ ] Expand test coverage across all components
- [ ] Add integration tests for key user flows
- [ ] Implement better E2E testing
- [ ] Add performance testing benchmarks

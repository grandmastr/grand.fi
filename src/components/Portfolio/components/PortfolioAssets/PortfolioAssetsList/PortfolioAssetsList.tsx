'use client';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Box, Skeleton, Stack, Typography, useTheme, LinearProgress, Chip } from '@mui/material';
import { TokenWithBalance } from '@/hooks/useTokenBalances';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';
import { WalletAvatar } from '../../../components/PortfolioWallet/PortfolioWallet.style';
import { PortfolioAssetsListSkeleton } from './PortfolioAssetsListSkeleton';

/**
 * Props interface for the PortfolioAssetsList component
 */
interface PortfolioAssetsListProps {
  /** Array of tokens with balances to display in the list */
  tokens?: TokenWithBalance[];
  /** Whether the data is currently loading */
  isLoading?: boolean;
  /** Progress information */
  progress?: {
    processed: number;
    total: number;
    percentage: number;
    round?: number;
    tokensLoaded?: number;
  };
}

/**
 * Formats a USD value with 2 decimal places
 */
const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a token amount with appropriate decimal places
 */
const formatAmount = (value: string): string => {
  const num = parseFloat(value);
  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';

  return num < 1
    ? num.toFixed(4)
    : num.toFixed(2);
};

/**
 * Helper function to convert rem to pixels
 */
const remToPx = (rem: number): number => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * Individual row to display a token
 * Wrapped in React.memo to prevent unnecessary re-renders
 */
const TokenRow = React.memo(({
  token,
  virtualRow,
  theme
}: {
  token: TokenWithBalance,
  virtualRow: any,
  theme: any
}) => {
  // Get first balance for display, safely handle undefined case
  const balanceEntries = Object.entries(token.balances || {});
  const hasBalances = balanceEntries.length > 0;
  const firstBalance = hasBalances ? balanceEntries[0][1] : undefined;

  return (
    <PortfolioBox
      key={virtualRow.key}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4.5rem',
        transform: `translateY(${virtualRow.start}px)`,
        padding: theme.spacing(2),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ height: '100%' }}
      >
        <TokenLogo token={token} />

        <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="body1" fontWeight="500" noWrap>
            {token.symbol}
          </Typography>
          <Typography variant="caption" color="grey.400" noWrap>
            {token.name}
          </Typography>
        </Stack>

        <Stack alignItems="flex-end" sx={{ minWidth: '6.25rem' }}>
          <Typography variant="body1" fontWeight="500" color="text.primary">
            {formatUSD(token.totalValueUSD)}
          </Typography>
          <Typography variant="caption" color="primary.main" noWrap>
            {token.networkCount > 1
              ? `On ${token.networkCount} networks`
              : firstBalance
                ? `${formatAmount(firstBalance.formattedAmount)} ${token.symbol}`
                : `0 ${token.symbol}`}
          </Typography>
        </Stack>
      </Stack>
    </PortfolioBox>
  );
});

TokenRow.displayName = 'TokenRow';

/**
 * Token logo component with loading/error handling
 */
const TokenLogo = ({ token }: { token: TokenWithBalance }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!token.logoURI || imageError) {
    return (
      <WalletAvatar
        sx={{
          width: '2rem',
          height: '2rem',
          fontSize: '0.57rem',
          backgroundColor: 'grey.200',
          color: 'text.primary',
        }}
      >
        <Typography variant={'h2'}>{token.symbol?.[0] || '?'}</Typography>
      </WalletAvatar>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <Skeleton variant="circular" width="2rem" height="2rem" animation="wave" />
      )}
      <WalletAvatar
        src={token.logoURI}
        alt={token.symbol}
        sx={{
          width: '2rem',
          height: '2rem',
          display: imageLoaded ? 'flex' : 'none',
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageLoaded(true);
          setImageError(true);
        }}
      />
    </>
  );
};

/**
 * Virtualized list of portfolio assets with resilient rendering
 * that handles loading states properly and persists through remounts
 */
export const PortfolioAssetsList = ({
  tokens = [],
  isLoading = false,
  progress
}: PortfolioAssetsListProps) => {
  const theme = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const [itemSizePx, setItemSizePx] = useState(0);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  // Preserve tokens between renders if we have any
  const hasTokens = tokens.length > 0;
  const [cachedTokens, setCachedTokens] = useState<TokenWithBalance[]>([]);

  // Update cached tokens when we get new ones
  useEffect(() => {
    if (hasTokens) {
      setCachedTokens(tokens);
    }
  }, [tokens, hasTokens]);

  // Decide what tokens to display - use cached if available and current is empty
  const tokensToDisplay = useMemo(() => {
    return hasTokens ? tokens : cachedTokens;
  }, [tokens, hasTokens, cachedTokens]);

  // Calculate item size in pixels once on component mount
  useEffect(() => {
    const itemHeightRem = 4.5;
    const itemHeightPx = remToPx(itemHeightRem);
    const spacingPx = parseFloat(theme.spacing(1));
    setItemSizePx(itemHeightPx + spacingPx);
  }, [theme]);

  // Initialize the virtualizer hook with pixel values
  const virtualizer = useVirtualizer({
    count: tokensToDisplay.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemSizePx || 72,
    overscan: 5,
  });

  // Show loading state only if we don't have any tokens to show
  if (isLoading && tokensToDisplay.length === 0) {
    return <PortfolioAssetsListSkeleton itemCount={7} />;
  }

  // We have tokens to show, or are still loading with cached tokens
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '50rem' }}>
      <Box
        ref={parentRef}
        sx={{
          flexGrow: 1,
          width: '100%',
          overflow: 'auto',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '0rem',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '0.25rem',
          },
        }}
      >
        <Box
          sx={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const token = tokensToDisplay[virtualRow.index];
            if (!token) return null;

            return (
              <TokenRow
                key={virtualRow.key}
                token={token}
                virtualRow={virtualRow}
                theme={theme}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default PortfolioAssetsList;

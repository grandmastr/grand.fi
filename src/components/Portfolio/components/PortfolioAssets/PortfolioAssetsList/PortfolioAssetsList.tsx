'use client';
import { useMemo, useRef, useState } from 'react';
import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { ConsolidatedToken } from '@/types/tokens';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';
import { WalletAvatar } from '../../../components/PortfolioWallet/PortfolioWallet.style';
// Removed balance-related imports

/**
 * @description Props interface for the PortfolioAssetsList component.
 */
interface PortfolioAssetsListProps {
  /**
   * @description Array of consolidated tokens to display in the list.
   */
  tokens?: ConsolidatedToken[];
  /**
   * @description Whether the token list itself is loading (initial fetch).
   */
  isLoading?: boolean;
}

/**
 * @description Skeleton loader for the asset list.
 */
export const PortfolioAssetsListSkeleton = ({ itemCount = 5 }: { itemCount?: number }) => {
  const theme = useTheme();
  return (
    <Box sx={{ height: '800px', width: '100%', overflow: 'auto' }}>
      {Array(itemCount).fill(0).map((_, index) => (
        <PortfolioBox
          key={`asset-skeleton-${index}`}
          sx={{ padding: theme.spacing(2), marginBottom: theme.spacing(1), height: '72px' }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ height: '100%' }}>
            <Skeleton variant="circular" width={32} height={32} animation="wave" />
            <Stack sx={{ flexGrow: 1 }} spacing={0.5}>
              <Skeleton variant="text" width="30%" height={24} animation="wave" />
              <Skeleton variant="text" width="50%" height={16} animation="wave" />
            </Stack>
          </Stack>
        </PortfolioBox>
      ))}
    </Box>
  );
};

/**
 * @description Token logo component.
 */
const TokenLogo = ({ token }: { token: ConsolidatedToken }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!token.logoURI || imageError) {
    return (
      <WalletAvatar sx={{ width: 32, height: 32, fontSize: '0.57rem' }}>
        <Typography variant={'h2'}>{token.symbol?.[0] || '?'}</Typography>
      </WalletAvatar>
    );
  }

  return (
    <>
      {!imageLoaded && <Skeleton variant="circular" width={32} height={32} animation="wave" />}
      <WalletAvatar
        src={token.logoURI}
        alt={token.symbol}
        sx={{ width: 32, height: 32, display: imageLoaded ? 'flex' : 'none' }}
        onLoad={() => setImageLoaded(true)}
        onError={() => { setImageLoaded(true); setImageError(true); }}
      />
    </>
  );
};

// Removed DisplayToken interface

/**
 * @function PortfolioAssetsList
 * @description Virtualized list showing portfolio assets (icon, name, symbol, network count).
 */
const PortfolioAssetsList = ({
  tokens = [],
  isLoading: isTokenListLoading = false
}: PortfolioAssetsListProps) => {
  const theme = useTheme();

  // Filter out tokens without essential info
  const validTokens = useMemo(
    () => tokens.filter((token) => Boolean(token.name) && Boolean(token.symbol)),
    [tokens],
  );

  // Sort alphabetically by symbol as a default
  const sortedTokens = useMemo(() => {
     return [...validTokens].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [validTokens]);


  const parentRef = useRef<HTMLDivElement>(null);
  const itemHeight = 72;
  const itemSpacing = theme.spacing(1);
  const itemTotalHeight = itemHeight + (typeof itemSpacing === 'string' ? parseInt(itemSpacing) : itemSpacing);

  const virtualizer = useVirtualizer({
    count: sortedTokens.length, // Use sorted list length
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemTotalHeight,
    overscan: 10,
  });

  // Show skeleton ONLY if the initial token list is loading
  if (isTokenListLoading) {
    return <PortfolioAssetsListSkeleton itemCount={7} />;
  }

  // Show empty state only if the initial token list was empty
  if (validTokens.length === 0) {
    return (
      <PortfolioBox sx={{ padding: theme.spacing(3), textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No assets found.
        </Typography>
      </PortfolioBox>
    );
  }

  // Render the virtualized list
  return (
    <Box
      ref={parentRef}
      sx={{
        height: '800px',
        width: '100%',
        overflow: 'auto',
        position: 'relative',
        '&::-webkit-scrollbar': { width: '0' },
        '&::-webkit-scrollbar-thumb': { borderRadius: '4px' },
      }}
    >
      <Box sx={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const token = sortedTokens[virtualRow.index];
          if (!token.name) return null;

          return (
            <PortfolioBox
              key={virtualRow.key}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${itemHeight}px`,
                transform: `translateY(${virtualRow.start}px)`,
                padding: theme.spacing(2),
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Left side: Token Info */}
              <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
                <TokenLogo token={token} />
                <Stack spacing={0.5}>
                  <Typography variant="body1" fontWeight="500">
                    {token.symbol}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {token.name}
                  </Typography>
                </Stack>
              </Stack>

              {/* Right side: REMOVED Balance/Price */}
              {/* <Stack alignItems="flex-end" spacing={0.5}>
                <Typography variant="body1" fontWeight="500">
                  {formatCurrencyValue(totalTokenUSD)}
                </Typography>
                 <Typography variant="caption" color="text.secondary">
                    @{formatCurrencyValue(parseFloat(token.priceUSD || '0'))}
                 </Typography>
              </Stack> */}
            </PortfolioBox>
          );
        })}
      </Box>
    </Box>
  );
};

export default PortfolioAssetsList;

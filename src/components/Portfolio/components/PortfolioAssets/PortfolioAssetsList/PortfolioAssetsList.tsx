'use client';
import { useMemo, useRef, useState } from 'react';
import { Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { ConsolidatedToken } from '@/types/tokens';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';
import { WalletAvatar } from '../../../components/PortfolioWallet/PortfolioWallet.style';

/**
 * Props interface for the PortfolioAssetsList component
 */
interface PortfolioAssetsListProps {
  /** Array of consolidated tokens to display in the list */
  tokens?: ConsolidatedToken[];
  /** Whether the data is currently loading */
  isLoading?: boolean;
}

/**
 * Skeleton loader for the asset list
 * Displays placeholder animations while asset data is loading
 *
 * @param {Object} props - Component props
 * @param {number} [props.itemCount=5] - Number of skeleton items to display
 */
export const PortfolioAssetsListSkeleton = ({ itemCount = 5 }: { itemCount?: number }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '50rem',
        width: '100%',
        overflow: 'auto',
      }}
    >
      {Array(itemCount).fill(0).map((_, index) => (
        <PortfolioBox
          key={`asset-skeleton-${index}`}
          sx={{
            padding: theme.spacing(2),
            marginBottom: theme.spacing(2),
            height: '4.5rem',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ height: '100%' }}
          >
            <Skeleton variant="circular" width={32} height={32} animation="wave" />

            <Stack sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="30%" height={'1.5rem'} animation="wave" />
              <Skeleton variant="text" width="50%" height={'1rem'} animation="wave" />
            </Stack>

            <Skeleton variant="text" width={'3.75rem'} height={'1.5rem'} animation="wave" />
          </Stack>
        </PortfolioBox>
      ))}
    </Box>
  );
};

/**
 * Token logo component with loading/error handling
 */
const TokenLogo = ({ token }: { token: ConsolidatedToken }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!token.logoURI || imageError) {
    return (
      <WalletAvatar
        sx={{
          width: 32,
          height: 32,
          fontSize: '0.57rem',
        }}
      >
        <Typography variant={'h2'}>{token.symbol?.[0] || '?'}</Typography>
      </WalletAvatar>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <Skeleton variant="circular" width={32} height={32} animation="wave" />
      )}
      <WalletAvatar
        src={token.logoURI}
        alt={token.symbol}
        sx={{
          width: 32,
          height: 32,
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
 * Virtualized list of portfolio assets
 *
 * @param {PortfolioAssetsListProps} props - Component props
 */
const PortfolioAssetsList = ({
  tokens = [],
  isLoading = false
}: PortfolioAssetsListProps) => {
  const theme = useTheme();

  const validTokens = useMemo(
    () => tokens.filter((token) => Boolean(token.name)),
    [tokens],
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const itemHeight = 72;
  const itemSpacing = theme.spacing(1);
  const itemTotalHeight = itemHeight + parseInt(itemSpacing);

  // Initialize the virtualizer hook
  const virtualizer = useVirtualizer({
    count: validTokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemTotalHeight,
    overscan: 5,
  });

  // Show skeleton loader if data is loading
  if (isLoading) {
    return <PortfolioAssetsListSkeleton itemCount={7} />;
  }

  // If no tokens are available after loading, show an empty state
  if (!isLoading && validTokens.length === 0) {
    return (
      <PortfolioBox sx={{ padding: theme.spacing(3), textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No assets found for your connected wallets
        </Typography>
      </PortfolioBox>
    );
  }

  return (
    <Box
      ref={parentRef}
      sx={{
        height: '50rem',
        width: '100%',
        overflow: 'auto',
        position: 'relative',
        '&::-webkit-scrollbar': {
          width: '0',
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
          const token = validTokens[virtualRow.index];

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
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ height: '100%' }}
              >
                <TokenLogo token={token} />

                <Stack>
                  <Typography variant="body1" fontWeight="500">
                    {token.symbol}
                  </Typography>
                  <Typography variant="caption" color="grey.400">
                    Available on {token.networks.length} network
                    {token.networks.length !== 1 ? 's' : ''}
                  </Typography>
                </Stack>
              </Stack>
            </PortfolioBox>
          );
        })}
      </Box>
    </Box>
  );
};

export default PortfolioAssetsList;

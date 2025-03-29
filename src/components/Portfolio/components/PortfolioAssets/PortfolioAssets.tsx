'use client';

import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';
import { PortfolioAssetsList } from './PortfolioAssetsList';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import PortfolioAssetsSkeleton from './PortfolioAssetsSkeleton';
import { useAccount } from '@lifi/wallet-management';

/**
 * Loading indicator component that shows a circular progress
 */
const BalanceLoadingIndicator = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'end',
      py: 2,
    }}
  >
    <Tooltip title="Indexing wallet balances...">
      <CircularProgress size={24} sx={{ mr: 2 }} />
    </Tooltip>
  </Box>
);

/**
 * @function PortfolioAssets
 */
const PortfolioAssets = () => {
  const { tokensWithBalances, isLoading, error, progress } = useTokenBalances();
  const {accounts} = useAccount();

  if (!accounts.length) return null;

  if (error) {
    return (
      <PortfolioBox sx={{ padding: 3, textAlign: 'center' }}>
        <Typography color="error">
          Failed to load token list: {error.message}
        </Typography>
      </PortfolioBox>
    );
  }

  // Show skeleton loader when initially loading with no tokens available
  if (isLoading && !tokensWithBalances?.length) {
    return <PortfolioAssetsSkeleton />;
  }

  return (
    <>
      <PortfolioAssetsList
        tokens={tokensWithBalances}
        isLoading={isLoading}
        progress={
          progress
            ? {
              processed: progress.processed,
              total: progress.total,
              percentage: progress.percentage || 0,
              tokensLoaded: tokensWithBalances?.length || 0,
            }
            : undefined
        }
      />
      {/*{!(isLoading || tokensWithBalances?.length) && (*/}
      {/*  <Box sx={{ padding: 3, textAlign: 'center' }}>*/}
      {/*    <Typography color="text.secondary">*/}
      {/*      No tokens found. Connect a wallet to view your balances.*/}
      {/*    </Typography>*/}
      {/*  </Box>*/}
      {/*)}*/}
    </>
  );
};

export default PortfolioAssets;

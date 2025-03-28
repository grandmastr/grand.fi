'use client';

import { Typography } from '@mui/material';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';
import { PortfolioAssetsList } from './PortfolioAssetsList';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import PortfolioAssetsSkeleton from './PortfolioAssetsSkeleton';

/**
 * Interface for the progress object returned by useTokenBalances
 */
interface BalanceLoadingProgressProps {
  progress: {
    processed: number;
    total: number;
    percentage: number;
  };
}

/**
 * @function PortfolioAssets
 * @description Client component that fetches and displays portfolio assets with balances
 */
const PortfolioAssets = () => {
  const { tokensWithBalances, isLoading, error, progress } = useTokenBalances();

  if (error) {
    return (
      <PortfolioBox sx={{ padding: 3, textAlign: 'center' }}>
        <Typography color="error">
          Failed to load token list: {error.message}
        </Typography>
      </PortfolioBox>
    );
  }

  if (isLoading && !tokensWithBalances?.length) {
    return <PortfolioAssetsSkeleton />
  }

  // Even while loading balances, we can show the tokens we have so far
  return (
    <>
      <PortfolioAssetsList
        tokens={tokensWithBalances}
        isLoading={isLoading && !tokensWithBalances?.length}
      />
    </>
  );
};

export default PortfolioAssets;

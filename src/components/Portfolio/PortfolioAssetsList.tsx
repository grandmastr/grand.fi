import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ChainType } from '@lifi/sdk';
import { usePortfolioTokens } from '@/hooks/usePortfolioTokens';
import { useChains } from '@/hooks/useChains';
import { PortfolioAssetsListItem } from '@/components/Portfolio/components/PortfolioAssetsListItem';

interface LoadingProgressProps {
  completed: number;
  total: number;
}

function LoadingProgress({ completed, total }: LoadingProgressProps) {
  return (
    <Box display="flex" alignItems="center" gap={2} p={2} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <CircularProgress size={24} />
      <Typography>Processing tokens ({completed}/{total})...</Typography>
    </Box>
  );
}

export function PortfolioAssetsList() {
  const { chains } = useChains();
  const { tokens, loading, progress, error } = usePortfolioTokens();

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Error loading tokens: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {loading && progress.total > 0 && (
        <LoadingProgress completed={progress.completed} total={progress.total} />
      )}
      {tokens.length > 0 ? (
        <Box>
          {tokens.map(token => (
            <PortfolioAssetsListItem 
              key={`${token.chainId}-${token.address}`} 
              token={token} 
            />
          ))}
        </Box>
      ) : (!loading && progress.completed === progress.total) && (
        <Box p={2}>
          <Typography color="textSecondary" align="center">
            No tokens found
          </Typography>
        </Box>
      )}
    </Box>
  );
}

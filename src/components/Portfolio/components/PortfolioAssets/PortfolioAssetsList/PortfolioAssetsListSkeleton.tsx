'use client';

import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';

interface PortfolioAssetsListSkeletonProps {
  itemCount?: number;
}

/**
 * Skeleton loader for the asset list
 * Displays placeholder animations while asset data is loading
 *
 * @param {Object} props - Component props
 * @param {number} [props.itemCount=5] - Number of skeleton items to display
 */
export const PortfolioAssetsListSkeleton = ({ itemCount = 5 }: PortfolioAssetsListSkeletonProps) => {
  return (
    <Stack spacing={1}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <PortfolioBox key={index} sx={{ padding: 2, height: '4.5rem' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton width="40%" height={24} />
              <Skeleton width="60%" height={20} />
            </Box>
            <Box sx={{ minWidth: '6.25rem', textAlign: 'right' }}>
              <Skeleton width="100%" height={24} />
              <Skeleton width="80%" height={20} />
            </Box>
          </Stack>
        </PortfolioBox>
      ))}
    </Stack>
  );
};

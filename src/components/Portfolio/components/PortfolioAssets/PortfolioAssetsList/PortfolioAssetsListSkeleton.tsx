'use client';

import React from 'react';
import { Box, Skeleton, Stack, useTheme } from '@mui/material';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';

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
            <Skeleton variant="circular" width="2rem" height="2rem" animation="wave" />

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
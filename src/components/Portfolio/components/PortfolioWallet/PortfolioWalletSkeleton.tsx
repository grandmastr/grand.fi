'use client';

import React from 'react';
import { Skeleton, Stack } from '@mui/material';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';

/**
 * Skeleton loader for the wallet card
 * Displays placeholder animations while wallet data is loading
 */
export const PortfolioWalletSkeleton = () => {
  return (
    <PortfolioBox sx={{ height: '9.5rem'}}>
      <Stack spacing={1} sx={{ height: '100%', padding: '1rem'}}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: '2.5rem'}}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton variant="circular" width="2.5rem" height="2.5rem" animation="wave" />
            <Skeleton variant="text" width="7.5rem" height="1.5rem" animation="wave" />
          </Stack>
          <Skeleton variant="circular" width="1.25rem" height="1.25rem" animation="wave" />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 0.5, height: '1.5rem'}}
        >
          <Skeleton variant="text" width="5rem" height="1.25rem" animation="wave" />
          <Skeleton variant="text" width="3.75rem" height="1.5rem" animation="wave" />
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ height: '1.75rem'}}
        >
          <Skeleton variant="circular" width="1.75rem" height="1.75rem" animation="wave" />
          <Skeleton variant="circular" width="1.75rem" height="1.75rem" animation="wave" />
          <Skeleton variant="circular" width="1.75rem" height="1.75rem" animation="wave" />
        </Stack>
      </Stack>
    </PortfolioBox>
  );
}; 
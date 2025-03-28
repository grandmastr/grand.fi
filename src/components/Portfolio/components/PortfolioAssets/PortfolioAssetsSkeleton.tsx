'use client';

import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';

/**
 * Skeleton loader for portfolio assets list
 * Displays placeholder loading animations while assets are being fetched
 * 
 * @returns {JSX.Element} Skeleton UI for assets list
 */
const PortfolioAssetsSkeleton = (): JSX.Element => {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <PortfolioBox
            key={`skeleton-${i}`}
            sx={{ marginBottom: 2, padding: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ height: '2rem', width: '2rem' }}>
                <Skeleton
                  variant="circular"
                  width="2rem"
                  height="2rem"
                  animation="wave"
                />
              </Box>
              <Stack width="70%">
                <Skeleton
                  variant="text"
                  width="40%"
                  height="1.5rem"
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height="1rem"
                  animation="wave"
                />
              </Stack>
              <Box sx={{ marginLeft: 'auto' }}>
                <Skeleton
                  variant="text"
                  width="3.75rem"
                  height="1.5rem"
                  animation="wave"
                />
              </Box>
            </Stack>
          </PortfolioBox>
        ))}
    </>
  );
};

export default PortfolioAssetsSkeleton; 
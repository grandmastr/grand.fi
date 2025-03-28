import { Suspense } from 'react';
import { PortfolioAssetsList } from './PortfolioAssetsList';
import { ConsolidatedToken } from '@/types/tokens';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';

/**
 * @description Simplified skeleton loader for assets list.
 */
const AssetsSkeleton = () => {
  return (
    <>
      {Array(5).fill(0).map((_, i) => (
        <PortfolioBox key={`skeleton-${i}`} sx={{ marginBottom: 2, padding: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ height: 32, width: 32 }}>
              <Skeleton variant="circular" width={32} height={32} animation="wave" />
            </Box>
            <Stack width="70%">
              <Skeleton variant="text" width="40%" height={24} animation="wave" />
              <Skeleton variant="text" width="60%" height={16} animation="wave" />
            </Stack>
            <Box sx={{ marginLeft: 'auto' }}>
              <Skeleton variant="text" width={60} height={24} animation="wave" />
            </Box>
          </Stack>
        </PortfolioBox>
      ))}
    </>
  );
};

/**
 * @function PortfolioDataFetcher
 * @description Async component to fetch token data from the internal API route.
 * Separated fetch logic to work nicely with Suspense.
 */
const PortfolioDataFetcher = async () => {
    // Construct the absolute URL for fetching within a server component
    const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'; // Fallback for local dev
    const fetchUrl = new URL('/tokens', baseUrl).toString();

    // Fetch token data from the internal API route
    // Use cache: 'no-store' if data should always be fresh, or rely on route's revalidation
    const response = await fetch(fetchUrl, { cache: 'no-store' });

    if (!response.ok) {
      // Handle errors appropriately, maybe return an error message component
      console.error(`Failed to fetch tokens from internal API: ${response.statusText}`);
      // Consider throwing an error to be caught by an Error Boundary
      return (
         <PortfolioBox sx={{ padding: 3, textAlign: 'center' }}>
           <Typography color="error">Failed to load token list.</Typography>
         </PortfolioBox>
      );
    }

    const tokens: ConsolidatedToken[] = await response.json();

    // Pass fetched tokens to the client component list
    // isLoading prop is implicitly handled by Suspense
    return <PortfolioAssetsList tokens={tokens} />;
}

/**
 * @function PortfolioAssetsServer
 * @description Server component entry point using Suspense for loading state.
 */
const PortfolioAssetsServer = () => {
    return (
      <Suspense fallback={<AssetsSkeleton />}>
        <PortfolioDataFetcher />
      </Suspense>
    );
};

export default PortfolioAssetsServer;

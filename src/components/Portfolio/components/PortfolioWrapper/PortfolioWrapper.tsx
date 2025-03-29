'use client';
import { Container, Grid, Stack } from '@mui/material';
import { PortfolioAssets, PortfolioWallet } from '../index';

const PortfolioWrapper = () => {
  return (
    <Container component={Stack} maxWidth={'lg'} spacing={2} sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <PortfolioWallet />
        </Grid>
        <Grid item xs={12} md={6}>
          <PortfolioAssets />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PortfolioWrapper;

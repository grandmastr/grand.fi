import { Container, Stack } from '@mui/material';
import { PortfolioAssets, PortfolioWallet } from '../index';

const PortfolioWrapper = () => {
  return (
    <Container component={Stack} maxWidth={'xs'} spacing={2} sx={{ mt: 4 }}>
      <PortfolioWallet />
      <PortfolioAssets />
    </Container>
  );
};

export default PortfolioWrapper;

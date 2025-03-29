import { Stack } from '@mui/material';
import { ConnectButton } from '@/components';
import { Title } from '../../Portfolio.style';

/**
 * Portfolio title component that displays the main headline
 *
 * Renders the application's primary headline with styled emphasis
 * on the "Multi-Chain" portion of the text. Uses the Title component
 * from the Portfolio styles with centered alignment.
 */
const PortfolioTitle = () => {
  return (
    <Stack spacing={2} alignItems={'center'}>
      <Title variant={'h1'} sx={{ textAlign: 'center' }}>
        Your Gateway to <span>Multi-Chain</span> Assets
      </Title>
      <ConnectButton />
    </Stack>
  );
};

export default PortfolioTitle;

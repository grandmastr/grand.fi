import { Box, Typography } from '@mui/material';
import type { TokenWithBalance } from '@/hooks/useTokenBalances';
import { formatCurrency } from '../../../utils/format';

interface PortfolioAssetsListItemProps {
  token: TokenWithBalance;
}

export function PortfolioAssetsListItem({ token }: PortfolioAssetsListItemProps) {
  const aggregatedAmount = Object.values(token.balances || {}).reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const balance = aggregatedAmount / (10 ** token.decimals);
  const value = token.totalValueUSD || (balance * parseFloat(token.priceUSD || '0'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        {token.logoURI && (
          <Box
            component="img"
            src={token.logoURI}
            alt={token.symbol}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
            }}
          />
        )}
        <Box>
          <Typography variant="subtitle1">{token.symbol}</Typography>
          <Typography variant="body2" color="text.secondary">
            {token.name}({token.balances ? Object.keys(token.balances).length : 1} networks)
          </Typography>
        </Box>
      </Box>

      <Box textAlign="right">
        <Typography variant="subtitle1">
          {formatCurrency(value)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {token.symbol}
        </Typography>
      </Box>
    </Box>
  );
} 
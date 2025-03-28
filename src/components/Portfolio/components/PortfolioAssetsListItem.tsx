import { Box, Typography } from '@mui/material';
import { TokenAmount } from '@lifi/sdk';
import { formatCurrency } from '@/utils/format';

interface PortfolioAssetsListItemProps {
  token: TokenAmount;
}

export function PortfolioAssetsListItem({ token }: PortfolioAssetsListItemProps) {
  const balance = parseFloat(token.amount?.toString() || '0') / 10 ** token.decimals;
  const value = balance * parseFloat(token.priceUSD || '0');

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
            {token.name}
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
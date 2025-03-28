import { Chain, TokenAmount } from '@lifi/sdk';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import { formatUnits } from 'viem';
import { styled } from '@mui/material/styles';

/**
 * StyledAvatar component with custom sizing
 */
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

/**
 * Props interface for the PortfolioAsset component
 * @interface PortfolioAssetProps
 * @property {TokenAmount} token - Token data including amount, symbol, and other details
 * @property {Chain} [chain] - Optional chain information for the token
 */
interface PortfolioAssetProps {
  token: TokenAmount;
  chain?: Chain;
}

/**
 * PortfolioAsset component displays individual token information in a card format
 *
 * @component
 * @param {PortfolioAssetProps} props - Component props
 * @param {TokenAmount} props.token - Token data to display
 * @param {Chain} [props.chain] - Optional chain information
 *
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * ```tsx
 * <PortfolioAsset token={tokenData} chain={chainData} />
 * ```
 */
export const PortfolioAsset = ({
  token,
  chain,
}: PortfolioAssetProps): JSX.Element => {
  const formattedAmount = token.amount
    ? formatUnits(BigInt(token.amount), token.decimals)
    : '0';

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            {token.logoURI && (
              <StyledAvatar
                src={token.logoURI}
                alt={token.symbol}
                sx={{ borderRadius: '50%' }}
              />
            )}
            <Box>
              <Typography variant="subtitle1" component="h3">
                {token.symbol}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {token.name}
              </Typography>
            </Box>
          </Stack>

          {/* Amount and Chain Information */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="right">
              <Typography variant="subtitle1">{formattedAmount}</Typography>
              {chain && (
                <Typography variant="body2" color="text.secondary">
                  {chain.name}
                </Typography>
              )}
            </Box>
            {chain?.logoURI && (
              <StyledAvatar
                src={chain.logoURI}
                alt={chain.name}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                }}
              />
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

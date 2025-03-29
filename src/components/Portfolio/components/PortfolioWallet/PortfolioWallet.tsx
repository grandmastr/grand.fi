'use client';
import { useMemo } from 'react';
import {
  Badge,
  colors,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  type Account,
  getConnectorIcon,
  useAccount,
  useAccountDisconnect,
} from '@lifi/wallet-management';
import { toast } from 'sonner';
import { copyToClipboard, createWalletAbbr, openInExplorer } from '@/utils';
import { useChains } from '@/hooks';
import {
  IconButtonWrapper,
  WalletAvatar,
  WalletChainAvatar,
} from './PortfolioWallet.style';
import Logout from '@mui/icons-material/Logout';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { PortfolioBox } from '@/components/Portfolio/Portfolio.style';
import { PortfolioWalletSkeleton } from './PortfolioWalletSkeleton';

const PortfolioWallet = () => {
  const { accounts } = useAccount();

  const isSomeWalletsConnected: boolean = !!accounts.length;

  return (
    <Stack spacing={2}>
      {isSomeWalletsConnected &&
        accounts.map((account: Account) => (
          <PortfolioEcosystemDetails account={account} key={account.chainId} />
        ))}
    </Stack>
  );
};

const PortfolioEcosystemDetails = ({ account }: { account: Account }) => {
  const theme = useTheme();
  const isWalletConnected: boolean = account.isConnected && !!account.address;
  const { chains, isSuccess: chainsLoaded } = useChains();
  const disconnectWallet = useAccountDisconnect();

  // Find the active chain for this account
  const activeChain = useMemo(
    () => chains?.find((chainEl) => chainEl.id === account.chainId),
    [chains, account.chainId],
  );

  // Show skeleton if chains aren't loaded yet
  if (!(chainsLoaded && account.isConnected)) {
    return <PortfolioWalletSkeleton />;
  }

  if (!isWalletConnected) return null;

  // Get the wallet icon using getConnectorIcon from @lifi/wallet-management
  const walletIcon = getConnectorIcon(account.connector);

  // Handle open in explorer
  const handleOpenInExplorer = () => {
    if (account.address && activeChain) {
      openInExplorer(account.address, activeChain);
    }
  };

  // Handle disconnect wallet
  const handleDisconnect = async () => {
    if (!account?.address) {
      return;
    }
    await disconnectWallet(account);
    toast.success('Wallet disconnected');
  };

  return (
    <PortfolioBox>
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Badge className="badge" sx={{ borderRadius: '50%' }}>
              <WalletAvatar
                src={walletIcon}
                alt={`${account.chainType} wallet`}
              />
            </Badge>
            <Typography variant="subtitle2" data-testid="wallet-address">
              {createWalletAbbr(account.address)}
            </Typography>
          </Stack>

          {activeChain?.logoURI ? (
            <WalletChainAvatar
              src={activeChain.logoURI}
              alt="chain-avatar"
              sx={{ width: '1.5rem', height: '1.5rem' }}
            />
          ) : (
            <Skeleton variant="circular" width="1.25rem" height="1.25rem" />
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Copy Address">
            <IconButtonWrapper
              aria-label="Copy Address"
              onClick={() => copyToClipboard(account.address)}
            >
              <ContentCopyIcon
                sx={{ fontSize: 'inherit', color: colors.grey[200] }}
              />
            </IconButtonWrapper>
          </Tooltip>
          <Tooltip title="Open in Explorer">
            <IconButtonWrapper
              aria-label="Open In Explorer"
              onClick={handleOpenInExplorer}
            >
              <OpenInNew
                sx={{
                  fontSize: 'inherit',
                  color: theme.palette.primary.main,
                }}
              />
            </IconButtonWrapper>
          </Tooltip>
          <Tooltip title="Disconnect Wallet">
            <IconButtonWrapper
              aria-label="Disconnect Wallet"
              onClick={handleDisconnect}
              data-testid="disconnect-wallet-button"
            >
              <Logout sx={{ color: colors.grey[200], fontSize: 'inherit' }} />
            </IconButtonWrapper>
          </Tooltip>
        </Stack>
      </Stack>
    </PortfolioBox>
  );
};

export default PortfolioWallet;

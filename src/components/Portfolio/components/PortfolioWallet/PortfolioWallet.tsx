'use client';
import { useMemo } from 'react';
import { Badge, Skeleton, Stack, Tooltip, Typography, colors, CircularProgress } from '@mui/material';
import {
  type Account,
  getConnectorIcon,
  useAccount,
  useAccountDisconnect,
} from '@lifi/wallet-management';
import { copyToClipboard, createWalletAbbr, openInExplorer } from '@/utils';
import { useChains, useEcosystemBalance } from '@/hooks';
import {
  IconButtonWrapper,
  WalletAvatar,
  WalletChainAvatar,
} from './PortfolioWallet.style';
import Logout from '@mui/icons-material/Logout';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ConnectButton } from '@/components';
import { useTheme } from '@mui/material';
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
          direction={'row'}
          justifyContent="space-between"
          alignItems={'center'}
          sx={{ height: '2.5rem'}}
        >
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Skeleton variant="circular" width={'2.5rem'} height={'2.5rem'} animation="wave" />
            <Skeleton variant="text" width={'7.5rem'} height={'1.5rem'} animation="wave" />
          </Stack>
          <Skeleton variant="circular" width={'1.25rem'} height={'1.25rem'} animation="wave" />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 0.5, height: '1.5rem'}}
        >
          <Skeleton variant="text" width={'5rem'} height={'1.25rem'} animation="wave" />
          <Skeleton variant="text" width={'3.75rem'} height={'1.5rem'} animation="wave" />
        </Stack>

        <Stack
          direction={'row'}
          spacing={1}
          sx={{ height: '1.75rem'}}
        >
          <Skeleton variant="circular" width={'1.75rem'} height={'1.75rem'} animation="wave" />
          <Skeleton variant="circular" width={'1.75rem'} height={'1.75rem'} animation="wave" />
          <Skeleton variant="circular" width={'1.75rem'} height={'1.75rem'} animation="wave" />
        </Stack>
      </Stack>
    </PortfolioBox>
  );
};

// Add loading progress indicator
const LoadingProgress = ({ completed, total }: { completed: number; total: number }) => {
  const progress = (completed / total) * 100;
  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={16} variant="determinate" value={progress} />
      Loading tokens ({completed}/{total})
    </Typography>
  );
};

const PortfolioWallet = () => {
  const { accounts } = useAccount();

  const isSomeWalletsConnected: boolean = !!accounts.length;

  return (
    <>
      <ConnectButton />
      {isSomeWalletsConnected &&
        accounts.map((account: Account) => (
          <PortfolioEcosystemDetails account={account} key={account.chainId} />
        ))}
    </>
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

  // Get ecosystem balance data with loading state and progress
  const { isLoading: balanceLoading, balance, progress } = useEcosystemBalance(
    account?.address,
    activeChain?.chainType
  );

  // Show skeleton if chains aren't loaded yet
  if (!chainsLoaded) {
    return <PortfolioWalletSkeleton />;
  }

  if (!isWalletConnected) return null;

  // Format the balance to display with 2 decimal places
  const formattedBalance = balance ?
    `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
    '$0.00';

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
  };

  return (
    <PortfolioBox>
      <Stack spacing={1}>
        {/* First row: Wallet info with chain logo */}
        <Stack
          direction={'row'}
          justifyContent="space-between"
          alignItems={'center'}
        >
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Badge className="badge" sx={{ borderRadius: '50%' }}>
              <WalletAvatar
                src={walletIcon}
                alt={`${account.chainType} wallet`}
              />
            </Badge>
            <Typography
              variant={'subtitle2'}
              data-testid="wallet-address"
            >
              {createWalletAbbr(account.address)}
            </Typography>
          </Stack>

          {activeChain?.logoURI ? (
            <WalletChainAvatar
              src={activeChain.logoURI}
              alt={'chain-avatar'}
              sx={{ width: '1.5rem', height: '1.5rem' }}
            />
          ) : (
            <Skeleton variant="circular" width={'1.25rem'} height={'1.25rem'} />
          )}
        </Stack>
        <Stack direction={'row'} spacing={1}>
          <Tooltip title={'Copy Address'}>
            <IconButtonWrapper
              aria-label={'Copy Address'}
              onClick={() => copyToClipboard(account.address)}
            >
              <ContentCopyIcon sx={{ fontSize: 'inherit', color: colors.grey[200] }} />
            </IconButtonWrapper>
          </Tooltip>
          <Tooltip title={'Open in Explorer'}>
            <IconButtonWrapper
              aria-label={'Open In Explorer'}
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
          <Tooltip title={'Disconnect Wallet'}>
            <IconButtonWrapper
              aria-label={'Disconnect Wallet'}
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

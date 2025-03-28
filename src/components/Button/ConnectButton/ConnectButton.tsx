/**
 * ConnectButton Component
 *
 * A button component that allows users to connect blockchain wallets to the application.
 * When clicked, it opens the wallet selection menu provided by LiFi wallet management.
 * The button's text dynamically changes based on whether wallets are already connected.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ConnectButton />
 *
 * // With custom styling
 * <ConnectButton sx={{ backgroundColor: 'primary.dark' }} />
 * ```
 *
 * @dependencies
 * - @lifi/wallet-management - For wallet connection functionality
 * - @mui/material - For UI components and styling
 *
 * @param {Object} props - Component props
 * @param {SxProps<Theme>} [props.sx] - MUI sx prop for custom styling
 *
 * @returns {React.ReactElement} A styled button component that triggers wallet connection
 */
'use client';
import React from 'react';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import { Button, SxProps, Theme } from '@mui/material';

interface ConnectButtonProps {
  /**
   * MUI sx prop for custom styling
   */
  sx?: SxProps<Theme>;
}

/**
 * Button component that allows users to connect wallets via LiFi wallet management
 */
const ConnectButton = ({ sx }: ConnectButtonProps) => {
  // Access wallet menu functionality from LiFi
  const { openWalletMenu } = useWalletMenu();

  // Get connected accounts information
  const { accounts } = useAccount();

  // Determine if at least one wallet has been connected
  const isSomeWalletsConnected: boolean = !!accounts.length;

  /**
   * Handles button click by opening the wallet selection menu
   * Stops event propagation to prevent unintended side effects
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event - Click event object
   * @returns {void}
   */
  const onClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    openWalletMenu();
  };

  return (
    <Button 
      sx={sx} 
      size="large" 
      onClick={onClick} 
      id={'connectButton'}
      data-testid="connect-wallet-button"
    >
      Connect {isSomeWalletsConnected && 'Another '} Wallet
    </Button>
  );
};

export default ConnectButton;

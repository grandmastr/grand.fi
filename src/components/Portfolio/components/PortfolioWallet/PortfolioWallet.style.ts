'use client';

import { Avatar, IconButton, styled, colors } from '@mui/material';

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  margin: 'auto',
  height: 42,
  width: 42,
  backgroundColor: theme.palette.grey[100],
  '> img': {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
}));

export const WalletChainAvatar = styled(Avatar)(({ theme }) => ({
  borderRadius: '50%',
  border: `1px solid ${theme.palette.background.paper}`,
  '> .MuiAvatar-root': {
    '+ .MuiBadge-badge .MuiAvatar-root': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
}));

export const IconButtonWrapper = styled(IconButton)(() => ({
  fontSize: 12,
  backgroundColor: colors.grey[800],
  height: 26,
  width: 26,
}));

'use client';
import { Box, Container, styled, Typography } from '@mui/material';

export const PortfolioContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2.5),
}));

export const PortfolioBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2.25),
  position: 'relative',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: 'all 0.2s ease-in-out',
}));

export const Title = styled(Typography)(({ theme }) => ({
  span: {
    color: theme.palette.primary.main,
  },
}));

export const AssetsWrapper = styled('div')(() => ({
  position: 'relative',
  width: '100%',
}));

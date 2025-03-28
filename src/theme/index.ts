import type { Breakpoint, Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

declare module '@mui/material/styles' {
  interface Palette {
    bg: Palette['primary'];
  }

  interface PaletteOptions {
    bg?: PaletteOptions['primary'];
  }
}

const utilityTheme = createTheme({
  palette: {
    bg: {
      main: 'black',
    },
    background: {
      default: '#1d1d21',
    },
    primary: {
      main: '#2962EF',
    },
    secondary: {
      main: '#909091',
    },
    grey: {
      100: 'rgb(255 255 255 / 0.05)',
      200: 'rgba(255 255 255 / 0.1)',
    },
    text: {
      primary: '#fff',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export const theme = createTheme(
  deepmerge(utilityTheme, {
    cssVariables: true,
    typography: {
      h1: {
        fontSize: utilityTheme.typography.pxToRem(24),
        fontWeight: 500,
        color: utilityTheme.palette.text.primary,
        [utilityTheme.breakpoints.up('sm' as Breakpoint)]: {
          fontSize: utilityTheme.typography.pxToRem(32),
          lineHeight: utilityTheme.typography.pxToRem(48),
        },
      },
      h6: {
        fontSize: utilityTheme.typography.pxToRem(12),
        [utilityTheme.breakpoints.up('sm' as Breakpoint)]: {
          fontSize: utilityTheme.typography.pxToRem(16),
        },
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: ({ theme }: { theme: Theme }) => ({
            background: theme.palette.background.default,
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backdropFilter:
              'blur(10px) saturate(190%) contrast(70%) brightness(80%)',
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: () => ({
            backgroundColor: 'transparent',
            boxShadow: 'unset',
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.primary.main,
            textTransform: 'unset',
            color: '#fff',
            borderRadius: utilityTheme.typography.pxToRem(20),
            fontWeight: 700,
            '&:hover': {
              opacity: 0.8,
            },
          }),
        },
      },
    },
    palette: {
      text: {
        secondary: utilityTheme.palette.primary.main,
      },
    },
  }),
);

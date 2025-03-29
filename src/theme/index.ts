import type { Breakpoint, Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

declare module '@mui/material/styles' {
  interface Palette {
    bg: Palette['primary'];
    gradient: {
      first: string;
      second: string;
      third: string;
      fourth: string;
      fifth: string;
      pointer: string;
      backgroundStart: string;
      backgroundEnd: string;
    };
  }

  interface PaletteOptions {
    bg?: PaletteOptions['primary'];
    gradient?: {
      first?: string;
      second?: string;
      third?: string;
      fourth?: string;
      fifth?: string;
      pointer?: string;
      backgroundStart?: string;
      backgroundEnd?: string;
    };
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
    // Add gradient colors
    gradient: {
      backgroundStart: 'rgb(0, 0, 20)', // Dark blue-black
      backgroundEnd: '#1d1d21', // Your existing background
      first: '41, 98, 239', // Based on your primary color (#2962EF in RGB)
      second: '221, 74, 255', // Purple
      third: '100, 220, 255', // Light blue
      fourth: '200, 50, 50', // Red accent
      fifth: '180, 180, 50', // Yellow accent
      pointer: '140, 100, 255', // Interactive pointer color
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
            backdropFilter: 'blur(10px) saturate(190%) contrast(70%) brightness(80%)',
            // Add CSS variables for gradient colors
            '--gradient-background-start': theme.palette.gradient.backgroundStart,
            '--gradient-background-end': theme.palette.gradient.backgroundEnd,
            '--first-color': theme.palette.gradient.first,
            '--second-color': theme.palette.gradient.second,
            '--third-color': theme.palette.gradient.third,
            '--fourth-color': theme.palette.gradient.fourth,
            '--fifth-color': theme.palette.gradient.fifth,
            '--pointer-color': theme.palette.gradient.pointer,
            '--size': '80%',
            '--blending-value': 'hard-light',
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

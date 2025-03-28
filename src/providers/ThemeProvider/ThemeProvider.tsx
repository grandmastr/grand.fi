'use client';
import React from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { theme } from '@/theme';

/**
 * Props interface for the ThemeProvider component
 */
interface ThemeProviderProps {
  /** Child components that will receive the theme context */
  children: React.ReactNode;
}

/**
 * Application theme provider component
 *
 * Wraps the application with MUI's ThemeProvider and applies the global theme.
 * Includes CssBaseline to normalize styles across browsers.
 */
const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;

'use client';
import React, { JSX } from 'react';
import { Toaster } from 'sonner';
import { AppWrapper } from '@/components';

/**
 * Props interface for the App component
 */
interface AppProps {
  /** Child components to be rendered within the application wrapper */
  children: React.ReactNode;
}

/**
 * Root application component
 *
 * Provides the main application structure by wrapping children with
 * the AppWrapper component and adding the toast notification system.
 *
 * @param {AppProps} props - Component props
 * @param {React.ReactNode} props.children
 */
const App = ({ children }: AppProps): JSX.Element => {
  return (
    <AppWrapper>
      {children}
      <Toaster />
    </AppWrapper>
  );
};

export default App;

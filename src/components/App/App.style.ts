'use client';
import { styled } from '@mui/material';

const AppWrapper = styled('div', {
  name: 'AppWrapper',
  slot: 'root',
})(() => ({
  backgroundColor: 'inherit',
  height: '100vh',
}));

export default AppWrapper;

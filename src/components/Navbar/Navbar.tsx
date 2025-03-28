/**
 * @component Navbar
 * @description Primary navigation component that appears at the top of all pages.
 * Renders a static navigation bar containing the application logo.
 */

import { JSX } from 'react';
import { Logo } from '@/components';
import { Container } from '@mui/material';
import { NavbarWrapper } from './Navbar.style';

/**
 * Navbar component providing the main navigation header for the application.
 * @returns {JSX.Element} Rendered a Navbar component
 */
const Navbar = (): JSX.Element => {
  return (
    <NavbarWrapper position={'static'}>
      <Container>
        <Logo />
      </Container>
    </NavbarWrapper>
  );
};

export default Navbar;

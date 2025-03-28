/**
 * Font configuration for Next.js
 */
import { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { IBM_Plex_Sans, Manrope, Sora } from 'next/font/google';

// IBM Plex Sans - technical sans-serif for body text and UI
export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});

// Manrope - modern geometric sans-serif for headlines
export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

// Sora - contemporary typeface for branding and headlines
export const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

// Font array for use in layout.jsx or _app.jsx
export const fonts: NextFontWithVariable[] = [manrope, sora, ibmPlexSans];

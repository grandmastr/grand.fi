import { Metadata } from 'next';
import { PortfolioTitle, PortfolioWrapper } from '@/components';
import { PortfolioContainer } from '@/components/Portfolio/Portfolio.style';

/**
 * Metadata configuration for the Home page
 * Sets the page title in the browser tab
 */
export const metadata: Metadata = {
  title: 'Portfolio',
};

/**
 * Home page component
 *
 * Serves as the main entry point of the application,
 */
export default async function Home() {
  return (
    <PortfolioContainer>
      <PortfolioTitle />
      <PortfolioWrapper />
    </PortfolioContainer>
  );
}

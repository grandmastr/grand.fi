// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_LIFI_API_URL = 'https://li.fi/api';

// Mock global fetch
global.fetch = jest.fn();

// Silence React Query error logging during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('an uncaught error') &&
    args[0].includes('React Query')
  ) {
    // Suppress React Query error logging
    return;
  }
  originalConsoleError(...args);
};

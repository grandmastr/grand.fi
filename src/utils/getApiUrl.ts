/**
 * Returns the LI.FI API URL with optional beta path
 *
 * @returns {string} The complete LI.FI API URL
 */
const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL || 'https://li.quest/v1';
  if (typeof window === 'undefined') {
    return apiUrl;
  }

  return apiUrl;
};

export default getApiUrl;

import { toast } from 'sonner';

/**
 * Copies the provided text to the clipboard
 * @param {string | undefined} text - The text to be copied
 * @returns {Promise<boolean>} - Returns true if copy was successful, false otherwise
 */
const copyToClipboard = async (text?: string): Promise<boolean> => {
  if (!text) {
    console.warn('Nothing to copydo');
    return false;
  }

  if (!navigator.clipboard) {
    console.error('Clipboard API not available in this browser');
    toast.error('Copy feature not supported in your browser');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied');
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to copy text to clipboard:', errorMessage);
    toast.error('Failed to copy to clipboard');
    return false;
  }
};

export default copyToClipboard;

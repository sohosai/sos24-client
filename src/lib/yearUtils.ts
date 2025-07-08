/**
 * Utility functions for determining the current year/version of the system
 */

/**
 * Determine the current year based on the domain or environment
 * @returns The year as a number (e.g., 2024, 2025)
 */
export const getCurrentYear = (): number => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Extract year from domain (e.g., sos25.sohosai.com -> 2025)
    const domainYearMatch = hostname.match(/sos(\d{2})\./);
    if (domainYearMatch) {
      const shortYear = parseInt(domainYearMatch[1], 10);
      return 2000 + shortYear;
    }
  }
  
  // Fallback to environment variable if set
  if (process.env.NEXT_PUBLIC_YEAR) {
    return parseInt(process.env.NEXT_PUBLIC_YEAR, 10);
  }
  
  // Default to 2024 (current system year based on codebase)
  return 2024;
};

/**
 * Get the formatted year string for display
 * @returns String like "2024年度版"
 */
export const getYearDisplayString = (): string => {
  const year = getCurrentYear();
  return `${year}年度版`;
};

/**
 * Get the title with year for metadata
 * @returns String like "雙峰祭オンラインシステム - 2024年度版"
 */
export const getTitleWithYear = (): string => {
  const yearString = getYearDisplayString();
  return `雙峰祭オンラインシステム - ${yearString}`;
};
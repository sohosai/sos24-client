/**
 * Utility functions for determining the current year/version of the system
 */

// Constants for year calculation
const YEAR_BASE = 2000;
const DEFAULT_YEAR = 2024;
const DEVELOP_DISPLAY = "Develop";

// Development environment hostnames
const DEVELOPMENT_HOSTNAMES = ['localhost', '127.0.0.1', 'develop'];

/**
 * Determine the current year based on the domain or environment
 * @returns The year as a number (e.g., 2024, 2025) or "Develop" for development environments
 */
export const getCurrentYear = (): number | string => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Extract year from domain (e.g., sos25.sohosai.com -> 2025)
    const domainYearMatch = hostname.match(/sos(\d{2})\./);
    if (domainYearMatch) {
      const shortYear = parseInt(domainYearMatch[1], 10);
      return YEAR_BASE + shortYear;
    }
    
    // Check if it's a development environment
    if (DEVELOPMENT_HOSTNAMES.some(devHost => hostname.includes(devHost))) {
      // If environment variable is set, use it even in development
      if (process.env.NEXT_PUBLIC_YEAR) {
        return parseInt(process.env.NEXT_PUBLIC_YEAR, 10);
      }
      // Otherwise show "Develop"
      return DEVELOP_DISPLAY;
    }
  }
  
  // Fallback to environment variable if set
  if (process.env.NEXT_PUBLIC_YEAR) {
    return parseInt(process.env.NEXT_PUBLIC_YEAR, 10);
  }
  
  // Default year for production environments
  return DEFAULT_YEAR;
};

/**
 * Get the formatted year string for display
 * @returns String like "2024年度版" or "Develop"
 */
export const getYearDisplayString = (): string => {
  const year = getCurrentYear();
  if (year === DEVELOP_DISPLAY) {
    return DEVELOP_DISPLAY;
  }
  return `${year}年度版`;
};

/**
 * Get the title with year for metadata
 * @returns String like "雙峰祭オンラインシステム - 2024年度版" or "雙峰祭オンラインシステム - Develop"
 */
export const getTitleWithYear = (): string => {
  const yearString = getYearDisplayString();
  return `雙峰祭オンラインシステム - ${yearString}`;
};
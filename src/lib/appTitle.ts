/**
 * Utility functions for generating app titles based on environment variables
 */

/**
 * Get the app title with environment-based suffix
 * @returns The complete app title with suffix if applicable
 */
export function getAppTitle(): string {
  const baseTitle = "雙峰祭オンラインシステム";
  const suffix = process.env.NEXT_PUBLIC_APP_TITLE_SUFFIX;
  
  if (suffix) {
    return `${baseTitle}${suffix}`;
  }
  
  return baseTitle;
}

/**
 * Get the year information for display
 * @returns The year string if configured, undefined otherwise
 */
export function getAppYear(): string | undefined {
  return process.env.NEXT_PUBLIC_APP_YEAR;
}

/**
 * Get the base title without any suffix
 * @returns The base title "雙峰祭オンラインシステム"
 */
export function getBaseTitle(): string {
  return "雙峰祭オンラインシステム";
}
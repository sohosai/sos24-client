import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCurrentYear, getYearDisplayString, getTitleWithYear } from './yearUtils';

describe('yearUtils', () => {
  beforeEach(() => {
    // Reset any environment variables
    delete process.env.NEXT_PUBLIC_YEAR;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCurrentYear', () => {
    it('should return year from domain sos24.sohosai.com', () => {
      // Mock window.location.hostname
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'sos24.sohosai.com'
        },
        writable: true
      });

      expect(getCurrentYear()).toBe(2024);
    });

    it('should return year from domain sos25.sohosai.com', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'sos25.sohosai.com'
        },
        writable: true
      });

      expect(getCurrentYear()).toBe(2025);
    });

    it('should return year from environment variable when domain does not match', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost'
        },
        writable: true
      });

      process.env.NEXT_PUBLIC_YEAR = '2025';
      expect(getCurrentYear()).toBe(2025);
    });

    it('should default to 2024 when no domain match and no env var', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost'
        },
        writable: true
      });

      expect(getCurrentYear()).toBe(2024);
    });
  });

  describe('getYearDisplayString', () => {
    it('should return formatted year string', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'sos25.sohosai.com'
        },
        writable: true
      });

      expect(getYearDisplayString()).toBe('2025年度版');
    });
  });

  describe('getTitleWithYear', () => {
    it('should return title with year', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'sos24.sohosai.com'
        },
        writable: true
      });

      expect(getTitleWithYear()).toBe('雙峰祭オンラインシステム - 2024年度版');
    });
  });
});
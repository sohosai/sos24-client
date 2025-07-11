import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAppTitle, getBaseTitle, getAppYear } from "./appTitle";

describe("appTitle utilities", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = originalEnv;
  });

  describe("getBaseTitle", () => {
    it("should return the base title", () => {
      expect(getBaseTitle()).toBe("雙峰祭オンラインシステム");
    });
  });

  describe("getAppTitle", () => {
    it("should return base title when no suffix is set", () => {
      delete process.env.NEXT_PUBLIC_APP_TITLE_SUFFIX;
      expect(getAppTitle()).toBe("雙峰祭オンラインシステム");
    });

    it("should return title with suffix when suffix is set", () => {
      process.env.NEXT_PUBLIC_APP_TITLE_SUFFIX = " - 2025年度版";
      expect(getAppTitle()).toBe("雙峰祭オンラインシステム - 2025年度版");
    });

    it("should return title with develop suffix", () => {
      process.env.NEXT_PUBLIC_APP_TITLE_SUFFIX = " - develop";
      expect(getAppTitle()).toBe("雙峰祭オンラインシステム - develop");
    });

    it("should return title with beta suffix", () => {
      process.env.NEXT_PUBLIC_APP_TITLE_SUFFIX = " - Beta";
      expect(getAppTitle()).toBe("雙峰祭オンラインシステム - Beta");
    });
  });

  describe("getAppYear", () => {
    it("should return undefined when no year is set", () => {
      delete process.env.NEXT_PUBLIC_APP_YEAR;
      expect(getAppYear()).toBeUndefined();
    });

    it("should return year when year is set", () => {
      process.env.NEXT_PUBLIC_APP_YEAR = "2025年度";
      expect(getAppYear()).toBe("2025年度");
    });

    it("should return year in different format", () => {
      process.env.NEXT_PUBLIC_APP_YEAR = "令和7年度";
      expect(getAppYear()).toBe("令和7年度");
    });
  });
});
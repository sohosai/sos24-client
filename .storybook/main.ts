import type { StorybookConfig } from "@storybook/nextjs";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  // https://storybook.js.org/docs/builders/webpack#typescript-modules-are-not-resolved-within-storybook
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
        }),
      ];
    }

    if (!config?.module?.rules) {
      return config;
    }

    const fileLoaderRule = config.module.rules.find((rule) => rule?.["test"]?.test(".svg"));
    // SVGはsvgrを使うよう設定
    if (fileLoaderRule && typeof fileLoaderRule === "object") {
      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule["issuer"],
          resourceQuery: { not: [/url/] }, // exclude if *.svg?url
          use: ["@svgr/webpack"],
        },
      );
      fileLoaderRule["exclude"] = /\.svg$/i;
    }
    return config;
  },
};
export default config;

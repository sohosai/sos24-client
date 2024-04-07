import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          primary: { value: "{colors.violet.800}" },
          error: { value: "{colors.red.600}" },
          sohosai: {
            blue: { value: "#1eb8cb" },
            orange: { value: "#ed6d1f" },
          },
          tsukuba: {
            purple: { value: "#60C" },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});

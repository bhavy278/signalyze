import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#080808",
        gray: {
          "900": "#1b1b1b",
          "800": "#303030",
          "700": "#454545",
          "600": "#5a5a5a",
          "500": "#707070",
          "400": "#858585",
          "300": "#9b9b9b",
          "200": "#b0b0b0",
          "100": "#cccccc",
          "50": "#e0e0e0",
        },
        light: {
          "0": "#f5f5f5",
          "100": "#fefefe",
          "200": "#ffffff",
        },
        blue: {
          "600": "#2563eb",
          "700": "#1d4ed8",
          "500": "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
export default config;

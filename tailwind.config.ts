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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "christmas-red": "var(--christmas-red)",
        "christmas-green": "var(--christmas-green)",
        "christmas-gold": "var(--christmas-gold)",
        "christmas-dark": "var(--christmas-dark)",
        "christmas-light": "var(--christmas-light)",
      },
    },
  },
  plugins: [],
};
export default config;

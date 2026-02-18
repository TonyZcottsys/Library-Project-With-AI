import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF"
        },
        muted: "#F3F4F6",
        background: "#FFFFFF",
        "background-dark": "#020617",
        "card-dark": "#020617"
      }
    }
  },
  darkMode: "class",
  plugins: []
};

export default config;


import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E07B2A",
          hover: "#C96E22",
          light: "#FDF3E7",
        },
        surface: "#FFFFFF",
        bg: "#FAFAF7",
        border: "#E8E6DF",
        text: {
          DEFAULT: "#1A1A18",
          muted: "#6B6B68",
        },
        success: "#2D7A4F",
        danger: "#C0392B",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        xl: "0.75rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        drawer: "0 -4px 20px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;

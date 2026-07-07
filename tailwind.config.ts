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
        // Spice Garden design tokens — mapped to CSS vars
        canvas:       "var(--canvas)",
        ink: {
          DEFAULT:    "var(--ink)",
          muted:      "var(--ink-muted)",
        },
        spice: {
          DEFAULT:    "var(--spice)",
          deep:       "var(--spice-deep)",
        },
        gold:         "var(--gold)",
        sage:         "var(--sage)",
        line:         "var(--line)",
        card:         "var(--card)",

        // Legacy aliases kept so any untouched admin/staff components still compile
        primary: {
          DEFAULT:    "var(--spice)",
          hover:      "var(--spice-deep)",
          light:      "var(--card)",
        },
        surface:      "var(--canvas)",
        bg:           "var(--canvas)",
        border:       "var(--line)",
        text: {
          DEFAULT:    "var(--ink)",
          muted:      "var(--ink-muted)",
        },
        success:      "var(--sage)",
        danger:       "#B91C1C",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body:    ["var(--font-work-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "'Courier New'", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        xl:    "0.75rem",
        "3xl": "1.5rem",
      },
      // No drop shadows anywhere — per design rules
      boxShadow: {
        none: "none",
        // Kept minimal for drawers (hairline only, no blur)
        drawer: "0 -1px 0 0 var(--line)",
      },
    },
  },
  plugins: [],
};

export default config;

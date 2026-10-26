import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a1128",
          deep: "#0b1330",
        },
        surface: "#111b3d",
        accent: {
          blue: "#4f8cff",
          purple: "#7c5cff",
        },
        success: "#34d399",
        error: "#fb7185",
        warning: "#fbbf24",
        ink: {
          DEFAULT: "#e6ecff",
          muted: "#8b97c2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        zh: ["var(--font-noto-sans-sc)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(79, 140, 255, 0.45)",
        card: "0 8px 30px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #4f8cff, #7c5cff)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

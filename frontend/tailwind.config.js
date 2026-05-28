/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#0F4C81",
          light: "#1a6bb5",
          dark: "#0a3560",
          50: "#e8f1fb",
          100: "#c5d9f4",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease both",
        "spin-slow": "spin 1.2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}

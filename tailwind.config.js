/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1a1a",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
        secondary: {
          DEFAULT: "#4b5563",
          hover: "#374151",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

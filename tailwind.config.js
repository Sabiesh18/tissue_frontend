/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#FFF0F5',       // Least / subtle soft shade of primary theme for application background
          light: '#DF538B',    // Primary Light Pink
          dark: '#D8276D',     // Primary Dark Pink (Buttons, actions, highlights)
          card: '#FFFFFF',     // Pure White container cards
          border: '#F8B4D0',   // Theme border color
          accent: '#FFE4EE',
        }
      }
    },
  },
  plugins: [],
}

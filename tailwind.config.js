/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        theme: {
          bg: '#FFF0F5',       // Softest pink canvas background
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

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
          light: '#DF538B',  // Primary Light Pink (Main application background)
          dark: '#D8276D',   // Primary Dark Pink (Buttons, actions, highlights)
          hover: '#be185d',
          subtle: '#FFF5F8',
          border: '#F8B4D0',
        }
      }
    },
  },
  plugins: [],
}

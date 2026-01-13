/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        // Custom dark theme colors if needed
        'dark-gray': '#1a1a1a',
        'light-gray': '#e5e5e5',
      },
      spacing: {
        
      }
    },
  }
}
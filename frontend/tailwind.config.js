/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0f172a',
        'darker': '#020617',
        'accent': '#ef4444',
        'success': '#22c55e',
        'warning': '#eab308',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      }
    },
  },
  plugins: [],
}

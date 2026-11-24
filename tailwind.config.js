/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F3EC',
        charcoal: '#1A1618',
        obsidian: '#120F11',
        burgundy: '#7A1F31',
        'burgundy-dark': '#5E1625',
        gold: '#B89B72',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

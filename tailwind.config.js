/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#4c1d95",
        accent: "#db2777",
        purpleLight: "#DAB9FF4D", 
        purpleDark: "#1e0538",
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        accentFont: ['Pattaya', 'sans-serif'],
      },
    },
  },
  plugins: []
};

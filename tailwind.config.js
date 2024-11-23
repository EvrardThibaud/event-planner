/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        '2000': '2000ms',
      },
      boxShadow: {
        custom: '20px 20px 60px #141417, -20px -20px 60px #1c1c1f',
      },
    },
  },
  plugins: [],
}
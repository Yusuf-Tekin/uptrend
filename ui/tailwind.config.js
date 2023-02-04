/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,tsx,jsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'wave-blue-bg': "url('/src/assets/wave-blue-bg.svg')",
      }
    },
  },
  plugins: [],
}

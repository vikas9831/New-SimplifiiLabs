/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    darkMode: 'class',

    extend: {
      borderWidth: {
        'dashed': '2px',
      },
      borderColor: {
        'dashed': '#4A5568',
      },
    },
  },
  plugins: [],
}

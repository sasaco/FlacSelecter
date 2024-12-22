/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gitlab-green-light': '#A5C88F',
        'gitlab-green-dark': '#4F7942',
        'form-gray-light': '#e5e7eb',
        'disabled-gray': '#808080',
        'text-dark': '#1f2937',
        'form-shadow': 'rgba(31, 41, 55, 0.05)',
      },
    },
  },
  plugins: [],
}


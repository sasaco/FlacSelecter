/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gitlab-green-light': '#1f7e23',
        'gitlab-green-dark': '#2e7d32',
        'form-gray-light': '#e5e7eb',
        'disabled-gray': '#808080',
        'text-dark': '#1f2937',
        'form-shadow': 'rgba(31, 41, 55, 0.05)',
      },
    },
  },
  plugins: [],
}


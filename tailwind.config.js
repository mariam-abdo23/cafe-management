/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
    './resources/**/*.vue',
    './src/**/*.{js,jsx,ts,tsx}', // لو ملفات React داخل src
  ],
  darkMode: 'class', // 👈 مهم جدًا
  theme: {
    extend: {},
  },
  plugins: [],
}

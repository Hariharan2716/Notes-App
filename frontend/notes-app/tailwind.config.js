/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      // Colors used in the project
      colors: {
        primary: "#2b85ff",
        secondary: "#ef863e",
      },
    },
  },
  plugins: [],
}


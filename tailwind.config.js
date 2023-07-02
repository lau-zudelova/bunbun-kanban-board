/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          775: "#283140",
          850: "#181f2f",
        },
      },
    },
  },
  plugins: [],
};

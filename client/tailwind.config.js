/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#abbf9b",
        background: "#e6e2d7",
        secondary: "#e4cdb0",
        primary: "#a2663c",
        ink: "#4b2e1e",
      },
      fontFamily: {
        heading: ["Fredoka", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

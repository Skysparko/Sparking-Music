/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        green: "#007f29",
        darkgreen: "#044f00",
        dark: "#121212",
      },
      gridTemplateColumns: {
        "auto-fill-cards": "repeat(auto-fill,minmax(200px,1fr))",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"),],
};

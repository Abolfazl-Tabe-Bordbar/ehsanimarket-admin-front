/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "426px",
      },
      fontFamily: {
        IRANSans: ["IRANSans"],
      },
      colors: {
        brand: {
          gold: "#CA8549",
          "gold-dark": "#b8743f",
          navy: "#253c8a",
          "navy-dark": "#141c32",
          "navy-light": "#2f4a9e",
          blue: "#004B8F",
        },
      },
    },
  },
  plugins: [],
};

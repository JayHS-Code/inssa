/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        128: "32rem",
        130: "32.5rem",
        160: "40rem",
      },
      maxWidth: {
        133: "35rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

// 4 = 1rem

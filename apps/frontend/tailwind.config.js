module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // https://stackoverflow.com/questions/67910118/how-can-i-set-min-height-in-tailwind
      minHeight: (theme) => ({
        ...theme("spacing"),
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

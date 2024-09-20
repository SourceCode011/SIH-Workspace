/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./frontend/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBlue: "#1C3988",
        lightBlue: "#92D5F3",
      },
    },
  },
  plugins: [],
};

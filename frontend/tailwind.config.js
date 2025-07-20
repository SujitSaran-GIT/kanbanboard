// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#EAEAEA",
        primary: "#FF2E63",
        dark: "#252A34",
        secondary: "#08D9D6",
      },
    },
  },
  plugins: [],
}
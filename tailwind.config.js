/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          sm: "100%", // 640px
          md: "100%", // 768px
          lg: "720px", // 1024px
          xl: "720px", // 1280px
          "2xl": "1440px", // 1536px
        },
      },
    },
  },
  plugins: [],
}
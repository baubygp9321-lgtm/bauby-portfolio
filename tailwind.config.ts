import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 🔥 required for toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
};

export default config;

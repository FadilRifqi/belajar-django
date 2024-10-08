const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "1px 3px 14px -1px rgba(0,0,0,0.75)",
      },
      fontFamily: {
        sans: ["Roboto Mono", "monospace"],
        serif: ["Roboto Mono", "monospace"],
        mono: ["Roboto Mono", "monospace"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-in-out",
      },
    },
  },
  plugins: [flowbite.plugin()],
};

import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ['var(--font-archivo)'],
      },
    },
  },
  plugins: [],
} satisfies Config;

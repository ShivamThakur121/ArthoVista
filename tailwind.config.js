/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1628",
          mid: "#10214a",
          light: "#1a3060",
          dark: "#060d1f",
        },
        orange: {
          50: "#fffdf0",
          100: "#fef7d0",
          200: "#fdf0a0",
          300: "#fae270",
          400: "#f5cf40",
          500: "#d4af37",
          600: "#b89025",
          700: "#997217",
          800: "#7d5a0f",
          900: "#5e4207",
        },
        cream: "#fffdf0",
        gold: "#d4af37",
        cyan: "#06b6d4",
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.6s ease forwards",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      boxShadow: {
        "orange-glow": "0 8px 30px rgba(212, 175, 55, 0.25)",
        "navy-glow": "0 8px 30px rgba(10, 22, 40, 0.25)",
        "card-3d": "20px 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(212,175,55,0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-orange": "linear-gradient(135deg, #d4af37, #b89025)",
        "gradient-navy": "linear-gradient(135deg, #0a1628, #1a3060)",
      },
    },
  },
  plugins: [],
};

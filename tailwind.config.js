/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#060b18",
          mid: "#0d172e",
          light: "#172545",
          dark: "#030712",
          card: "#0f1c3a",
        },
        primary: {
          DEFAULT: "#0d9488",
          light: "#14b8a6",
          dark: "#0f766e",
          glow: "rgba(13, 148, 136, 0.35)",
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#85a3ff',
          500: '#4f73ff',
          600: '#2b4cff',
          700: '#1430eb',
          800: '#0f24c2',
          900: '#132199',
          950: '#0b105c',
        },
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        },
        gold: {
          DEFAULT: "#d4af37",
          light: "#f5cf40",
          dark: "#b89025",
        },
        accent: {
          DEFAULT: "#f97316",
          light: "#fdba74",
          dark: "#ea580c",
        },
        cream: "#fffdfa",
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        inter: ["Inter", "system-ui", "sans-serif"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.6s ease forwards",
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
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
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(37, 99, 235, 0.25)" },
          "50%": { boxShadow: "0 0 30px rgba(37, 99, 235, 0.55)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "orange-glow": "0 8px 30px rgba(234, 88, 12, 0.25)",
        "teal-glow": "0 8px 30px rgba(13, 148, 136, 0.35)",
        "gold-glow": "0 8px 30px rgba(212, 175, 55, 0.25)",
        "navy-glow": "0 12px 40px rgba(6, 11, 24, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "card-3d": "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(13, 148, 136, 0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-orange": "linear-gradient(135deg, #ea580c, #f97316)",
        "gradient-navy": "linear-gradient(180deg, #060b18 0%, #0d172e 100%)",
        "gradient-blue": "linear-gradient(135deg, #0d9488, #0f766e)",
        "gradient-gold": "linear-gradient(135deg, #d4af37, #f5cf40)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Indique où Tailwind doit chercher les classes
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // Bleu
        success: "#34C759", // Vert
        danger: "#FF3B30", // Rouge
        warning: "#FFC107", // Jaune
        dark: "#1A1A1A", // Noir/Gris foncé
        light: "#F8F9FA", // Blanc cassé
        gray: "#6C757D", // Gris standard
      },
    },
  },
  plugins: [],
};

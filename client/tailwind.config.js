/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",         // Azul principal (fundo)
        logo: "#6ed77e",            // Verde do logo
        dark: "#0F172A",            // Fundo escuro
        light: "#F9FAFB",           // Texto claro
        muted: "#94A3B8",           // Texto secundário
        danger: "#EF4444",          // Erros / alertas
        success: "#22C55E",         // Sucesso / status positivo
        "primary-hover": "#1D4ED8", // Hover do botão azul
      }
    },
  },
  plugins: [],
}


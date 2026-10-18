/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: { boxShadow: { glow: "0 0 18px rgba(45,212,191,0.10)", soft: "0 8px 24px rgba(0,0,0,0.15)" }, keyframes: { reveal: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } } }, animation: { reveal: "reveal 350ms ease-out both" } } },
  plugins: [],
};

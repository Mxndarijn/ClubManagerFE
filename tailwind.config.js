/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#38bdf8",
          "secondary": "#0369a1",
          "accent": "#0e7490",
          "neutral": "#06b6d4",
          "base-100": "#e5e7eb",
          "info": "#1e40af",
          "success": "#22c55e",
          "warning": "#f97316",
          "error": "#991b1b",
        },
        dark: {
          "primary": "#38bdf8",
          "secondary": "#0369a1",
          "accent": "#0e7490",
          "neutral": "#06b6d4",
          "base-100": "#1f2937",
          "info": "#1e40af",
          "success": "#22c55e",
          "warning": "#f97316",
          "error": "#991b1b",
        }
      },
    ],
  },
}

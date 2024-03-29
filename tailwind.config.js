/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "grayTint": "#54575d",
        "black": "#000000",
      },
      width: {
        "1/7": "14,27%"
      },
      height:{
        "screen-mini": "82vh",
        "85%": "85%"
      },
    }
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar-hide')
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#38bdf8",
          "secondary": "#0369a1",
          "accent": "#0cacd7",
          "neutral": "#12b5d2",
          "base-100": "#e5e7eb",
          "base-200":  "#a0a2a4",
          "info": "#0e3ade",
          "success": "#22c55e",
          "warning": "#f97316",
          "error": "#de0000",
          "base-content": "#b4b9b9",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary": "#38bdf8",
          "secondary": "#0369a1",
          "accent": "#0e7490",
          "neutral": "#11b9d2",
          "base-100": "#1f2937",
          "base-200": "#131a23",
          "base-300": "#2D3542",
          "info": "#3b57c2",
          "info-focus": "#000000",
          "success": "#1ba14f",
          "warning": "#f97316",
          "error": "#b71d1d",
          "base-content": "#b4b9b9",
        }
      },
    ],
  },
}

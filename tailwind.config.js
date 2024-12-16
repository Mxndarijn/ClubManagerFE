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
        'custom-gray': '#1F2937',
        'custom-teal': '#0E7490',
        'custom-teal-opacity': 'rgba(14, 116, 144, 0.08)', // 8% opacity
      },
      rotate: {
        "60" : "160deg"
      },
      spacing: {
        'custom-top-30': '30%',
        'custom-top-65': '65%',
      },
      width: {
        "1/7": "14,27%"
      },
      maxWidth: {
      "10/12":  "83.333333%"
      },
      height:{
        "screen-mini": "82vh",
        "85%": "85%"
      },
      maxHeight: {
        "10/12":  "83.333333%"
      },
      borderWidth: {
        "1": "1px",
      },
      boxShadow: {
        '3xl': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        "custom-radius-85": "85px"
      }
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
          "primary": "#0ea5e9",        // Lichter blauw dan het donkere blauw
          "secondary": "#0284c7",      // Lichter, maar nog steeds dieper blauw dan de primaire kleur
          "accent": "#0e4e69",         // Een wat minder donkere, meer gedempte blauwgroene tint
          "neutral": "#2f8ea1",        // Een lichter blauw-groenige tint die goed past bij het lichte thema
          "base-100": "#f9fafb",       // Zeer licht grijs voor de achtergrond
          "base-200": "#e5e7eb",       // Een iets donkerder grijs voor secundaire achtergronden
          "base-300": "#d1d5db",       // Licht grijs voor panelen, kaders, en randen
          "info": "#3b57c2",           // Blauw voor informatie
          "infoFocus": "#f0f0f0",      // Lichtgrijs als focuskleur voor info
          "success": "#16a34a",        // Een heldergroene tint die succes aanduidt
          "warning": "#f59e0b",        // Geel-oranje tint voor waarschuwingen
          "error": "#ef4444",          // Een heldere rode tint voor fouten
          "base-content": "#374151",   // Donkerder grijs voor tekst
          "white": "#ffffff",
          ".btn-sm": {
            "height": "2.8rem",
            "min-height": "2.8rem"
          },
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
          "infoFocus": "#000000",
          "success": "#1ba14f",
          "warning": "#f97316",
          "error": "#b71d1d",
          "base-content": "#b4b9b9",
          "white": "#ffffff",

          ".btn-sm": {
            "height": "2.6rem",
            "min-height": "2.6rem"
          },
        },

      },
    ],
  },
}

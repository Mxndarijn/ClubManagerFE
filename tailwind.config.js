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
      height:{
        "screen-mini": "82vh",
        "85%": "85%"
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
          "primary": "#38bdf8",
          "secondary": "#0369a1",
          "accent": "#0cacd7",
          "neutral": "#12b5d2",
          "base-100": "#f5f5f4",
          "base-200":  "#e8e8e8",
          "base-300": "#a9a4a4",
          "info": "#0e3ade",
          "infoFocus": "#000000",
          "success": "#16a34a",
          "warning": "#f66e15",
          "error": "#f12020",
          "base-content": "#252525",
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

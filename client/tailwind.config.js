export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Bricolage Grotesque'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      colors: {
        darkBg: "#0a0a0c",
        cream: "#f3e8d8",
        charcoal: "#16161a",
        earth: {
          dark: "#3d3428",
          light: "#6b5d50",
          hover: "#8a7a6a"
        },
        crimson: {
          DEFAULT: "#ec3750",
          hover: "#d1223b",
          light: "#ff6b7e"
        },
        cyberGreen: {
          DEFAULT: "#33d6a6",
          light: "#5bf8cc"
        },
        cyberGold: {
          DEFAULT: "#f5a623",
          light: "#ffc257"
        }
      },
      boxShadow: {
        flat: "4px 4px 0px #000000",
        flatLg: "6px 6px 0px #000000",
        flatHover: "2px 2px 0px #000000"
      }
    }
  },
  plugins: []
}

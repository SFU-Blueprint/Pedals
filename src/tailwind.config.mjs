export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "pedals-white": "#F7F7F7",
        "pedals-lightgrey": "#E9E9E9",
        "pedals-grey": "#D7D7D7",
        "pedals-stroke": "#BBBBBB",
        "pedals-darkgrey": "#727272",
        "pedals-black": "#252525",
        "pedals-yellow": "#FCC300",
        "pedals-brown": "#AE8330",
        "pedals-buttongrey": "#969696"
      },
      fontFamily: {
        inter: "var(--font-inter)",
        mono: "var(--font-supply), monospace"
      }
    }
  }
};

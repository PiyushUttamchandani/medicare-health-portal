export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* PRIMARY */
        primary: "#0071BC",     // Trust Blue
        primaryDark: "#005a94",

        /* HEALING */
        healing: "#2E8540",     // Green (recovery)

        /* ACCENTS */
        teal: "#1BAFBF",        // HealthTech feel
        warm: "#F5A623",        // CTA / friendly accent

        /* NEUTRALS */
        surface: "#F8FAFC",     // soft background
        muted: "#64748B",       // text gray
        soft: "#F1F5F9",        // section bg
      },
    },
  },
  plugins: [],
};
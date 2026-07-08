import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eef4fb",
          100: "#d6e6f4",
          200: "#adccea",
          300: "#7eaedb",
          400: "#4d8bc6",
          500: "#2e6ba8",
          600: "#1f4f82",
          700: "#183d66",
          800: "#14213d",
          900: "#0d1626",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#fff8ec",
          100: "#ffedc7",
          200: "#ffd98a",
          300: "#ffc04d",
          400: "#ffab24",
          500: "#ff9f1c",
          600: "#e07f0a",
          700: "#b95f08",
          800: "#94480e",
          900: "#7a3c10",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 3px)",
        sm: "calc(var(--radius) - 5px)",
        xl: "calc(var(--radius) + 4px)",
      },
      spacing: {
        18: "4.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(20 33 61 / 0.04), 0 1px 3px 0 rgb(20 33 61 / 0.06)",
        card: "0 1px 3px 0 rgb(20 33 61 / 0.06), 0 4px 12px -2px rgb(20 33 61 / 0.08)",
        raised: "0 4px 16px -4px rgb(20 33 61 / 0.12), 0 8px 24px -8px rgb(20 33 61 / 0.10)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "route-dash": { to: { strokeDashoffset: "-24" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "route-dash": "route-dash 1.2s linear infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

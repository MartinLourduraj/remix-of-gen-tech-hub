// Runtime theme engine — each theme overrides the semantic CSS variables
// already consumed throughout the app (primary, background, sidebar, etc).
// Adding a theme = adding a new entry below; no component changes required.

export type ThemeMode = "light" | "dark";

export type ThemeVars = {
  // core surfaces
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  // brand
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  // controls
  border: string;
  input: string;
  ring: string;
  // charts
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  // sidebar
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
  // extras
  "brand-navy": string;
  "brand-navy-2": string;
  "brand-orange": string;
  "brand-orange-2": string;
  "gradient-hero": string;
  "gradient-accent": string;
  "shadow-elevated": string;
  "shadow-glow": string;
  radius: string;
};

export type ThemeDef = {
  id: string;
  name: string;
  description: string;
  swatch: string[]; // 3-4 hex/oklch strings for the switcher preview
  supportsDark: boolean;
  light: ThemeVars;
  dark?: Partial<ThemeVars>;
};

// ---- shared dark surface baseline used by most themes ----
const darkBase: Partial<ThemeVars> = {
  background: "oklch(0.14 0.04 260)",
  foreground: "oklch(0.97 0.01 250)",
  card: "oklch(0.20 0.05 260)",
  "card-foreground": "oklch(0.97 0.01 250)",
  popover: "oklch(0.20 0.05 260)",
  "popover-foreground": "oklch(0.97 0.01 250)",
  muted: "oklch(0.24 0.05 260)",
  "muted-foreground": "oklch(0.72 0.03 255)",
  border: "oklch(1 0 0 / 10%)",
  input: "oklch(1 0 0 / 15%)",
};

export const THEMES: ThemeDef[] = [
  {
    id: "industrial-blue",
    name: "Industrial Blue",
    description: "Navy · Steel · Orange — heavy machinery ERP",
    swatch: ["#1b2a4e", "#2f4b7c", "#f97316", "#ffffff"],
    supportsDark: true,
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.18 0.04 260)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.18 0.04 260)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.18 0.04 260)",
      primary: "oklch(0.28 0.10 258)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.96 0.01 250)",
      "secondary-foreground": "oklch(0.28 0.10 258)",
      muted: "oklch(0.965 0.008 250)",
      "muted-foreground": "oklch(0.50 0.03 255)",
      accent: "oklch(0.72 0.19 50)",
      "accent-foreground": "oklch(0.99 0 0)",
      destructive: "oklch(0.58 0.22 27)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.92 0.012 255)",
      input: "oklch(0.92 0.012 255)",
      ring: "oklch(0.72 0.19 50)",
      "chart-1": "oklch(0.28 0.10 258)",
      "chart-2": "oklch(0.72 0.19 50)",
      "chart-3": "oklch(0.55 0.14 230)",
      "chart-4": "oklch(0.70 0.15 160)",
      "chart-5": "oklch(0.62 0.20 305)",
      sidebar: "oklch(0.19 0.06 258)",
      "sidebar-foreground": "oklch(0.96 0.01 250)",
      "sidebar-primary": "oklch(0.72 0.19 50)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.26 0.07 258)",
      "sidebar-accent-foreground": "oklch(0.99 0 0)",
      "sidebar-border": "oklch(0.30 0.06 258)",
      "sidebar-ring": "oklch(0.72 0.19 50)",
      "brand-navy": "oklch(0.19 0.06 258)",
      "brand-navy-2": "oklch(0.26 0.08 258)",
      "brand-orange": "oklch(0.72 0.19 50)",
      "brand-orange-2": "oklch(0.78 0.18 60)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.18 0.06 258) 0%, oklch(0.28 0.10 258) 55%, oklch(0.42 0.14 260) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.72 0.19 50) 0%, oklch(0.78 0.18 60) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.19 0.06 258) 35%, transparent)",
      "shadow-glow":
        "0 0 60px -10px color-mix(in oklab, oklch(0.72 0.19 50) 50%, transparent)",
      radius: "0.625rem",
    },
    dark: darkBase,
  },
  {
    id: "dark-professional",
    name: "Dark Professional",
    description: "Black · Graphite · Electric Blue — glass dashboard",
    swatch: ["#0a0a0a", "#1f2937", "#2563eb", "#e5e7eb"],
    supportsDark: true,
    light: {
      background: "oklch(0.13 0.01 260)",
      foreground: "oklch(0.96 0.01 250)",
      card: "oklch(0.19 0.015 260)",
      "card-foreground": "oklch(0.96 0.01 250)",
      popover: "oklch(0.19 0.015 260)",
      "popover-foreground": "oklch(0.96 0.01 250)",
      primary: "oklch(0.62 0.20 255)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.24 0.015 260)",
      "secondary-foreground": "oklch(0.96 0.01 250)",
      muted: "oklch(0.22 0.015 260)",
      "muted-foreground": "oklch(0.70 0.02 255)",
      accent: "oklch(0.62 0.20 255)",
      "accent-foreground": "oklch(0.99 0 0)",
      destructive: "oklch(0.65 0.22 25)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 12%)",
      ring: "oklch(0.62 0.20 255)",
      "chart-1": "oklch(0.62 0.20 255)",
      "chart-2": "oklch(0.70 0.15 200)",
      "chart-3": "oklch(0.75 0.15 160)",
      "chart-4": "oklch(0.70 0.19 305)",
      "chart-5": "oklch(0.78 0.18 60)",
      sidebar: "oklch(0.10 0.01 260)",
      "sidebar-foreground": "oklch(0.96 0.01 250)",
      "sidebar-primary": "oklch(0.62 0.20 255)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.20 0.015 260)",
      "sidebar-accent-foreground": "oklch(0.99 0 0)",
      "sidebar-border": "oklch(1 0 0 / 8%)",
      "sidebar-ring": "oklch(0.62 0.20 255)",
      "brand-navy": "oklch(0.13 0.01 260)",
      "brand-navy-2": "oklch(0.20 0.015 260)",
      "brand-orange": "oklch(0.62 0.20 255)",
      "brand-orange-2": "oklch(0.70 0.18 245)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.10 0.01 260) 0%, oklch(0.20 0.03 260) 60%, oklch(0.32 0.10 255) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.62 0.20 255) 0%, oklch(0.70 0.18 245) 100%)",
      "shadow-elevated":
        "0 24px 60px -24px color-mix(in oklab, oklch(0.62 0.20 255) 30%, transparent)",
      "shadow-glow":
        "0 0 60px -10px color-mix(in oklab, oklch(0.62 0.20 255) 55%, transparent)",
      radius: "0.75rem",
    },
  },
  {
    id: "light-corporate",
    name: "Light Corporate",
    description: "White · Light Gray · Blue accent — minimal",
    swatch: ["#ffffff", "#f3f4f6", "#2563eb", "#0f172a"],
    supportsDark: true,
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.20 0.02 260)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.20 0.02 260)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.20 0.02 260)",
      primary: "oklch(0.55 0.20 255)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.97 0.005 250)",
      "secondary-foreground": "oklch(0.28 0.05 258)",
      muted: "oklch(0.97 0.005 250)",
      "muted-foreground": "oklch(0.50 0.02 255)",
      accent: "oklch(0.55 0.20 255)",
      "accent-foreground": "oklch(0.99 0 0)",
      destructive: "oklch(0.58 0.22 27)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.93 0.005 255)",
      input: "oklch(0.93 0.005 255)",
      ring: "oklch(0.55 0.20 255)",
      "chart-1": "oklch(0.55 0.20 255)",
      "chart-2": "oklch(0.70 0.15 200)",
      "chart-3": "oklch(0.70 0.15 160)",
      "chart-4": "oklch(0.72 0.19 50)",
      "chart-5": "oklch(0.62 0.20 305)",
      sidebar: "oklch(0.98 0.003 250)",
      "sidebar-foreground": "oklch(0.20 0.02 260)",
      "sidebar-primary": "oklch(0.55 0.20 255)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.95 0.005 250)",
      "sidebar-accent-foreground": "oklch(0.20 0.02 260)",
      "sidebar-border": "oklch(0.92 0.005 255)",
      "sidebar-ring": "oklch(0.55 0.20 255)",
      "brand-navy": "oklch(0.28 0.06 258)",
      "brand-navy-2": "oklch(0.38 0.08 258)",
      "brand-orange": "oklch(0.55 0.20 255)",
      "brand-orange-2": "oklch(0.62 0.18 250)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.97 0.005 250) 0%, oklch(0.90 0.02 250) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.55 0.20 255) 0%, oklch(0.62 0.18 250) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.28 0.06 258) 15%, transparent)",
      "shadow-glow":
        "0 0 50px -10px color-mix(in oklab, oklch(0.55 0.20 255) 30%, transparent)",
      radius: "0.5rem",
    },
    dark: darkBase,
  },
  {
    id: "emerald-green",
    name: "Emerald Green",
    description: "White · Emerald · Forest — nature-inspired",
    swatch: ["#ffffff", "#10b981", "#065f46", "#ecfdf5"],
    supportsDark: true,
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.20 0.04 160)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.20 0.04 160)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.20 0.04 160)",
      primary: "oklch(0.62 0.16 160)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.96 0.02 160)",
      "secondary-foreground": "oklch(0.30 0.08 160)",
      muted: "oklch(0.96 0.02 160)",
      "muted-foreground": "oklch(0.45 0.04 160)",
      accent: "oklch(0.42 0.12 160)",
      "accent-foreground": "oklch(0.99 0 0)",
      destructive: "oklch(0.58 0.22 27)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.90 0.02 160)",
      input: "oklch(0.90 0.02 160)",
      ring: "oklch(0.62 0.16 160)",
      "chart-1": "oklch(0.62 0.16 160)",
      "chart-2": "oklch(0.42 0.12 160)",
      "chart-3": "oklch(0.75 0.13 130)",
      "chart-4": "oklch(0.70 0.15 200)",
      "chart-5": "oklch(0.72 0.19 50)",
      sidebar: "oklch(0.22 0.06 160)",
      "sidebar-foreground": "oklch(0.96 0.02 160)",
      "sidebar-primary": "oklch(0.62 0.16 160)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.28 0.07 160)",
      "sidebar-accent-foreground": "oklch(0.99 0 0)",
      "sidebar-border": "oklch(0.32 0.06 160)",
      "sidebar-ring": "oklch(0.62 0.16 160)",
      "brand-navy": "oklch(0.22 0.06 160)",
      "brand-navy-2": "oklch(0.30 0.08 160)",
      "brand-orange": "oklch(0.62 0.16 160)",
      "brand-orange-2": "oklch(0.72 0.15 150)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.22 0.06 160) 0%, oklch(0.42 0.12 160) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.62 0.16 160) 0%, oklch(0.72 0.15 150) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.42 0.12 160) 30%, transparent)",
      "shadow-glow":
        "0 0 50px -10px color-mix(in oklab, oklch(0.62 0.16 160) 45%, transparent)",
      radius: "0.75rem",
    },
    dark: darkBase,
  },
  {
    id: "orange-grey",
    name: "Orange Grey",
    description: "Concrete · Dark Gray · Bright Orange",
    swatch: ["#d4d4d4", "#3f3f46", "#f97316", "#18181b"],
    supportsDark: true,
    light: {
      background: "oklch(0.96 0.003 260)",
      foreground: "oklch(0.20 0.005 260)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.20 0.005 260)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.20 0.005 260)",
      primary: "oklch(0.30 0.005 260)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.92 0.003 260)",
      "secondary-foreground": "oklch(0.20 0.005 260)",
      muted: "oklch(0.92 0.003 260)",
      "muted-foreground": "oklch(0.45 0.005 260)",
      accent: "oklch(0.70 0.20 50)",
      "accent-foreground": "oklch(0.15 0.01 260)",
      destructive: "oklch(0.58 0.22 27)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.87 0.003 260)",
      input: "oklch(0.87 0.003 260)",
      ring: "oklch(0.70 0.20 50)",
      "chart-1": "oklch(0.70 0.20 50)",
      "chart-2": "oklch(0.30 0.005 260)",
      "chart-3": "oklch(0.60 0.005 260)",
      "chart-4": "oklch(0.78 0.15 60)",
      "chart-5": "oklch(0.50 0.005 260)",
      sidebar: "oklch(0.18 0.005 260)",
      "sidebar-foreground": "oklch(0.94 0.003 260)",
      "sidebar-primary": "oklch(0.70 0.20 50)",
      "sidebar-primary-foreground": "oklch(0.15 0.01 260)",
      "sidebar-accent": "oklch(0.24 0.005 260)",
      "sidebar-accent-foreground": "oklch(0.99 0 0)",
      "sidebar-border": "oklch(0.30 0.005 260)",
      "sidebar-ring": "oklch(0.70 0.20 50)",
      "brand-navy": "oklch(0.18 0.005 260)",
      "brand-navy-2": "oklch(0.28 0.005 260)",
      "brand-orange": "oklch(0.70 0.20 50)",
      "brand-orange-2": "oklch(0.78 0.18 60)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.18 0.005 260) 0%, oklch(0.30 0.005 260) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.70 0.20 50) 0%, oklch(0.78 0.18 60) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.20 0.005 260) 40%, transparent)",
      "shadow-glow":
        "0 0 50px -10px color-mix(in oklab, oklch(0.70 0.20 50) 55%, transparent)",
      radius: "0.5rem",
    },
    dark: darkBase,
  },
  {
    id: "red-white-blue",
    name: "Red White Blue",
    description: "White · Royal Blue · Deep Red — corporate",
    swatch: ["#ffffff", "#1d4ed8", "#b91c1c", "#0f172a"],
    supportsDark: true,
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.18 0.04 260)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.18 0.04 260)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.18 0.04 260)",
      primary: "oklch(0.42 0.20 260)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.96 0.008 250)",
      "secondary-foreground": "oklch(0.28 0.10 258)",
      muted: "oklch(0.96 0.008 250)",
      "muted-foreground": "oklch(0.48 0.03 255)",
      accent: "oklch(0.52 0.22 25)",
      "accent-foreground": "oklch(0.99 0 0)",
      destructive: "oklch(0.52 0.22 25)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.92 0.01 255)",
      input: "oklch(0.92 0.01 255)",
      ring: "oklch(0.42 0.20 260)",
      "chart-1": "oklch(0.42 0.20 260)",
      "chart-2": "oklch(0.52 0.22 25)",
      "chart-3": "oklch(0.55 0.14 230)",
      "chart-4": "oklch(0.70 0.15 160)",
      "chart-5": "oklch(0.72 0.19 50)",
      sidebar: "oklch(0.16 0.04 260)",
      "sidebar-foreground": "oklch(0.96 0.008 250)",
      "sidebar-primary": "oklch(0.52 0.22 25)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.24 0.06 260)",
      "sidebar-accent-foreground": "oklch(0.99 0 0)",
      "sidebar-border": "oklch(0.28 0.06 260)",
      "sidebar-ring": "oklch(0.52 0.22 25)",
      "brand-navy": "oklch(0.16 0.04 260)",
      "brand-navy-2": "oklch(0.28 0.10 258)",
      "brand-orange": "oklch(0.52 0.22 25)",
      "brand-orange-2": "oklch(0.62 0.20 25)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.16 0.04 260) 0%, oklch(0.42 0.20 260) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.52 0.22 25) 0%, oklch(0.62 0.20 25) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.42 0.20 260) 30%, transparent)",
      "shadow-glow":
        "0 0 55px -10px color-mix(in oklab, oklch(0.52 0.22 25) 50%, transparent)",
      radius: "0.5rem",
    },
    dark: darkBase,
  },
  {
    id: "luxury-black-gold",
    name: "Luxury Black Gold",
    description: "Matte Black · Charcoal · Metallic Gold — executive",
    swatch: ["#0a0a0a", "#1f1f1f", "#d4af37", "#f5e6a8"],
    supportsDark: true,
    light: {
      background: "oklch(0.13 0.005 80)",
      foreground: "oklch(0.94 0.03 85)",
      card: "oklch(0.18 0.008 80)",
      "card-foreground": "oklch(0.94 0.03 85)",
      popover: "oklch(0.18 0.008 80)",
      "popover-foreground": "oklch(0.94 0.03 85)",
      primary: "oklch(0.78 0.13 85)",
      "primary-foreground": "oklch(0.13 0.005 80)",
      secondary: "oklch(0.22 0.008 80)",
      "secondary-foreground": "oklch(0.94 0.03 85)",
      muted: "oklch(0.22 0.008 80)",
      "muted-foreground": "oklch(0.70 0.03 85)",
      accent: "oklch(0.78 0.13 85)",
      "accent-foreground": "oklch(0.13 0.005 80)",
      destructive: "oklch(0.60 0.22 25)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.78 0.13 85 / 20%)",
      input: "oklch(0.78 0.13 85 / 15%)",
      ring: "oklch(0.78 0.13 85)",
      "chart-1": "oklch(0.78 0.13 85)",
      "chart-2": "oklch(0.65 0.10 85)",
      "chart-3": "oklch(0.50 0.08 85)",
      "chart-4": "oklch(0.88 0.09 90)",
      "chart-5": "oklch(0.35 0.005 80)",
      sidebar: "oklch(0.10 0.005 80)",
      "sidebar-foreground": "oklch(0.90 0.03 85)",
      "sidebar-primary": "oklch(0.78 0.13 85)",
      "sidebar-primary-foreground": "oklch(0.13 0.005 80)",
      "sidebar-accent": "oklch(0.18 0.008 80)",
      "sidebar-accent-foreground": "oklch(0.94 0.03 85)",
      "sidebar-border": "oklch(0.78 0.13 85 / 18%)",
      "sidebar-ring": "oklch(0.78 0.13 85)",
      "brand-navy": "oklch(0.13 0.005 80)",
      "brand-navy-2": "oklch(0.22 0.008 80)",
      "brand-orange": "oklch(0.78 0.13 85)",
      "brand-orange-2": "oklch(0.88 0.09 90)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.10 0.005 80) 0%, oklch(0.20 0.008 80) 60%, oklch(0.32 0.04 85) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.78 0.13 85) 0%, oklch(0.88 0.09 90) 100%)",
      "shadow-elevated":
        "0 24px 60px -20px color-mix(in oklab, oklch(0.78 0.13 85) 25%, transparent)",
      "shadow-glow":
        "0 0 60px -10px color-mix(in oklab, oklch(0.78 0.13 85) 45%, transparent)",
      radius: "0.5rem",
    },
  },
  {
    id: "chiropractic-studio",
    name: "Chiropractic Studio",
    description: "Sky Blue · White · Soft Gray — calm rounded",
    swatch: ["#e0f2fe", "#38bdf8", "#f8fafc", "#0f172a"],
    supportsDark: true,
    light: {
      background: "oklch(0.99 0.005 230)",
      foreground: "oklch(0.22 0.04 230)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.22 0.04 230)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.22 0.04 230)",
      primary: "oklch(0.68 0.13 230)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.96 0.01 230)",
      "secondary-foreground": "oklch(0.28 0.06 230)",
      muted: "oklch(0.96 0.01 230)",
      "muted-foreground": "oklch(0.50 0.03 230)",
      accent: "oklch(0.80 0.10 230)",
      "accent-foreground": "oklch(0.20 0.04 230)",
      destructive: "oklch(0.60 0.22 25)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.90 0.015 230)",
      input: "oklch(0.90 0.015 230)",
      ring: "oklch(0.68 0.13 230)",
      "chart-1": "oklch(0.68 0.13 230)",
      "chart-2": "oklch(0.80 0.10 230)",
      "chart-3": "oklch(0.72 0.12 200)",
      "chart-4": "oklch(0.75 0.13 260)",
      "chart-5": "oklch(0.70 0.15 160)",
      sidebar: "oklch(0.97 0.008 230)",
      "sidebar-foreground": "oklch(0.22 0.04 230)",
      "sidebar-primary": "oklch(0.68 0.13 230)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.93 0.01 230)",
      "sidebar-accent-foreground": "oklch(0.22 0.04 230)",
      "sidebar-border": "oklch(0.90 0.015 230)",
      "sidebar-ring": "oklch(0.68 0.13 230)",
      "brand-navy": "oklch(0.30 0.08 230)",
      "brand-navy-2": "oklch(0.42 0.10 230)",
      "brand-orange": "oklch(0.68 0.13 230)",
      "brand-orange-2": "oklch(0.80 0.10 230)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.94 0.02 230) 0%, oklch(0.80 0.10 230) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.68 0.13 230) 0%, oklch(0.80 0.10 230) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.68 0.13 230) 25%, transparent)",
      "shadow-glow":
        "0 0 50px -10px color-mix(in oklab, oklch(0.68 0.13 230) 40%, transparent)",
      radius: "1rem",
    },
    dark: darkBase,
  },
  {
    id: "dental-clinic",
    name: "Dental Clinic",
    description: "White · Teal · Sky — ultra-clean healthcare",
    swatch: ["#ffffff", "#14b8a6", "#38bdf8", "#0f766e"],
    supportsDark: true,
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.22 0.04 200)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.22 0.04 200)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.22 0.04 200)",
      primary: "oklch(0.65 0.12 195)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.96 0.015 200)",
      "secondary-foreground": "oklch(0.30 0.06 200)",
      muted: "oklch(0.96 0.015 200)",
      "muted-foreground": "oklch(0.48 0.03 200)",
      accent: "oklch(0.72 0.13 220)",
      "accent-foreground": "oklch(0.99 0 0)",
      destructive: "oklch(0.60 0.22 25)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.91 0.015 200)",
      input: "oklch(0.91 0.015 200)",
      ring: "oklch(0.65 0.12 195)",
      "chart-1": "oklch(0.65 0.12 195)",
      "chart-2": "oklch(0.72 0.13 220)",
      "chart-3": "oklch(0.75 0.13 160)",
      "chart-4": "oklch(0.78 0.10 250)",
      "chart-5": "oklch(0.72 0.19 50)",
      sidebar: "oklch(0.98 0.008 195)",
      "sidebar-foreground": "oklch(0.25 0.05 200)",
      "sidebar-primary": "oklch(0.65 0.12 195)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.94 0.015 200)",
      "sidebar-accent-foreground": "oklch(0.25 0.05 200)",
      "sidebar-border": "oklch(0.90 0.015 200)",
      "sidebar-ring": "oklch(0.65 0.12 195)",
      "brand-navy": "oklch(0.30 0.06 200)",
      "brand-navy-2": "oklch(0.42 0.09 200)",
      "brand-orange": "oklch(0.65 0.12 195)",
      "brand-orange-2": "oklch(0.72 0.13 220)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.94 0.02 195) 0%, oklch(0.72 0.13 220) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.65 0.12 195) 0%, oklch(0.72 0.13 220) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.65 0.12 195) 25%, transparent)",
      "shadow-glow":
        "0 0 50px -10px color-mix(in oklab, oklch(0.65 0.12 195) 40%, transparent)",
      radius: "0.875rem",
    },
    dark: darkBase,
  },
  {
    id: "lamborghini-orange",
    name: "Lamborghini Orange",
    description: "Huracán Orange · Carbon · Metallic Silver — performance",
    swatch: ["#FF6A00", "#1A1A1A", "#C0C0C0", "#0a0a0a"],
    supportsDark: true,
    light: {
      background: "oklch(0.12 0.005 30)",
      foreground: "oklch(0.96 0.01 60)",
      card: "oklch(0.16 0.008 30)",
      "card-foreground": "oklch(0.96 0.01 60)",
      popover: "oklch(0.16 0.008 30)",
      "popover-foreground": "oklch(0.96 0.01 60)",
      primary: "oklch(0.70 0.22 45)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.20 0.008 30)",
      "secondary-foreground": "oklch(0.96 0.01 60)",
      muted: "oklch(0.20 0.008 30)",
      "muted-foreground": "oklch(0.75 0.005 60)",
      accent: "oklch(0.82 0.01 60)",
      "accent-foreground": "oklch(0.12 0.005 30)",
      destructive: "oklch(0.60 0.22 25)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.82 0.01 60 / 20%)",
      input: "oklch(0.82 0.01 60 / 15%)",
      ring: "oklch(0.70 0.22 45)",
      "chart-1": "oklch(0.70 0.22 45)",
      "chart-2": "oklch(0.82 0.01 60)",
      "chart-3": "oklch(0.55 0.005 60)",
      "chart-4": "oklch(0.96 0.01 60)",
      "chart-5": "oklch(0.35 0.005 30)",
      sidebar: "oklch(0.10 0.005 30)",
      "sidebar-foreground": "oklch(0.94 0.01 60)",
      "sidebar-primary": "oklch(0.70 0.22 45)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.18 0.008 30)",
      "sidebar-accent-foreground": "oklch(0.96 0.01 60)",
      "sidebar-border": "oklch(0.82 0.01 60 / 15%)",
      "sidebar-ring": "oklch(0.70 0.22 45)",
      "brand-navy": "oklch(0.10 0.005 30)",
      "brand-navy-2": "oklch(0.18 0.008 30)",
      "brand-orange": "oklch(0.70 0.22 45)",
      "brand-orange-2": "oklch(0.78 0.20 55)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.10 0.005 30) 0%, oklch(0.20 0.008 30) 60%, oklch(0.35 0.10 45) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.70 0.22 45) 0%, oklch(0.78 0.20 55) 100%)",
      "shadow-elevated":
        "0 24px 60px -20px color-mix(in oklab, oklch(0.70 0.22 45) 30%, transparent)",
      "shadow-glow":
        "0 0 60px -8px color-mix(in oklab, oklch(0.70 0.22 45) 60%, transparent)",
      radius: "0.75rem",
    },
  },
];

export const DEFAULT_THEME_ID = "industrial-blue";
export const THEME_STORAGE_KEY = "app.theme.id";
export const MODE_STORAGE_KEY = "app.theme.mode";

export function getThemeById(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

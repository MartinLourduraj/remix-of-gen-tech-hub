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

export type ThemeCategory = "light" | "dark" | "special";

export type ThemeDef = {
  id: string;
  name: string;
  description: string;
  swatch: string[]; // 3-4 hex/oklch strings for the switcher preview
  supportsDark: boolean;
  category?: ThemeCategory;
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
    name: "Lamborghini Orange Performance",
    description: "Huracán Orange · Sky Blue · Metallic Silver · Carbon Fiber",
    swatch: ["#FF6A00", "#C0C0C0", "#E0F2FE", "#0a0a0a"],
    supportsDark: true,
    // LIGHT: white/sky-blue surfaces, orange primary, metallic silver borders
    light: {
      background: "oklch(0.985 0.008 230)",
      foreground: "oklch(0.16 0.01 30)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.16 0.01 30)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.16 0.01 30)",
      primary: "oklch(0.70 0.22 45)",
      "primary-foreground": "oklch(0.99 0 0)",
      secondary: "oklch(0.97 0.006 60)",
      "secondary-foreground": "oklch(0.20 0.01 30)",
      muted: "oklch(0.965 0.008 230)",
      "muted-foreground": "oklch(0.45 0.02 240)",
      accent: "oklch(0.82 0.008 250)",
      "accent-foreground": "oklch(0.16 0.01 30)",
      destructive: "oklch(0.60 0.22 25)",
      "destructive-foreground": "oklch(0.99 0 0)",
      border: "oklch(0.86 0.008 250)",
      input: "oklch(0.90 0.008 250)",
      ring: "oklch(0.70 0.22 45)",
      "chart-1": "oklch(0.70 0.22 45)",
      "chart-2": "oklch(0.16 0.01 30)",
      "chart-3": "oklch(0.78 0.008 250)",
      "chart-4": "oklch(0.72 0.13 230)",
      "chart-5": "oklch(0.99 0 0)",
      // Carbon-fiber sidebar even in light mode (looks premium against sky bg)
      sidebar: "oklch(0.12 0.005 30)",
      "sidebar-foreground": "oklch(0.94 0.008 60)",
      "sidebar-primary": "oklch(0.70 0.22 45)",
      "sidebar-primary-foreground": "oklch(0.99 0 0)",
      "sidebar-accent": "oklch(0.20 0.008 30)",
      "sidebar-accent-foreground": "oklch(0.99 0 0)",
      "sidebar-border": "oklch(0.82 0.01 60 / 18%)",
      "sidebar-ring": "oklch(0.70 0.22 45)",
      "brand-navy": "oklch(0.10 0.005 30)",
      "brand-navy-2": "oklch(0.20 0.008 30)",
      "brand-orange": "oklch(0.70 0.22 45)",
      "brand-orange-2": "oklch(0.78 0.20 55)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.96 0.02 230) 0%, oklch(0.88 0.06 230) 50%, oklch(0.99 0 0) 100%)",
      "gradient-accent":
        "linear-gradient(135deg, oklch(0.70 0.22 45) 0%, oklch(0.78 0.20 55) 100%)",
      "shadow-elevated":
        "0 20px 50px -20px color-mix(in oklab, oklch(0.70 0.22 45) 25%, transparent)",
      "shadow-glow":
        "0 0 55px -8px color-mix(in oklab, oklch(0.70 0.22 45) 55%, transparent)",
      radius: "0.75rem",
    },
    // DARK: full carbon-fiber performance mode
    dark: {
      background: "oklch(0.12 0.005 30)",
      foreground: "oklch(0.96 0.01 60)",
      card: "oklch(0.17 0.008 30)",
      "card-foreground": "oklch(0.96 0.01 60)",
      popover: "oklch(0.17 0.008 30)",
      "popover-foreground": "oklch(0.96 0.01 60)",
      secondary: "oklch(0.20 0.008 30)",
      "secondary-foreground": "oklch(0.96 0.01 60)",
      muted: "oklch(0.20 0.008 30)",
      "muted-foreground": "oklch(0.75 0.005 60)",
      accent: "oklch(0.82 0.01 60)",
      "accent-foreground": "oklch(0.12 0.005 30)",
      border: "oklch(0.82 0.01 60 / 22%)",
      input: "oklch(0.82 0.01 60 / 15%)",
      "gradient-hero":
        "linear-gradient(135deg, oklch(0.10 0.005 30) 0%, oklch(0.20 0.008 30) 60%, oklch(0.35 0.10 45) 100%)",
    },
  },

];

// ---------------------------------------------------------------------------
// Compact theme factory for the additional 20 themes (5 light, 10 dark, 5 special)
// ---------------------------------------------------------------------------
type Palette = {
  bg: string; fg: string; card: string; cardFg?: string;
  primary: string; primaryFg?: string;
  secondary: string; secondaryFg?: string;
  muted: string; mutedFg: string;
  accent: string; accentFg?: string;
  border: string;
  sidebar: string; sidebarFg: string; sidebarAccent: string; sidebarBorder: string;
  charts: [string, string, string, string, string];
  radius?: string;
  heroFrom?: string; heroTo?: string;
};

function mk(
  id: string, name: string, description: string,
  swatch: string[], category: ThemeCategory,
  light: Palette, dark?: Partial<ThemeVars>
): ThemeDef {
  const toVars = (p: Palette): ThemeVars => ({
    background: p.bg, foreground: p.fg,
    card: p.card, "card-foreground": p.cardFg ?? p.fg,
    popover: p.card, "popover-foreground": p.cardFg ?? p.fg,
    primary: p.primary, "primary-foreground": p.primaryFg ?? "oklch(0.99 0 0)",
    secondary: p.secondary, "secondary-foreground": p.secondaryFg ?? p.fg,
    muted: p.muted, "muted-foreground": p.mutedFg,
    accent: p.accent, "accent-foreground": p.accentFg ?? "oklch(0.99 0 0)",
    destructive: "oklch(0.60 0.22 25)", "destructive-foreground": "oklch(0.99 0 0)",
    border: p.border, input: p.border, ring: p.primary,
    "chart-1": p.charts[0], "chart-2": p.charts[1], "chart-3": p.charts[2],
    "chart-4": p.charts[3], "chart-5": p.charts[4],
    sidebar: p.sidebar, "sidebar-foreground": p.sidebarFg,
    "sidebar-primary": p.primary, "sidebar-primary-foreground": p.primaryFg ?? "oklch(0.99 0 0)",
    "sidebar-accent": p.sidebarAccent, "sidebar-accent-foreground": p.sidebarFg,
    "sidebar-border": p.sidebarBorder, "sidebar-ring": p.primary,
    "brand-navy": p.sidebar, "brand-navy-2": p.sidebarAccent,
    "brand-orange": p.primary, "brand-orange-2": p.accent,
    "gradient-hero": `linear-gradient(135deg, ${p.heroFrom ?? p.sidebar} 0%, ${p.heroTo ?? p.primary} 100%)`,
    "gradient-accent": `linear-gradient(135deg, ${p.primary} 0%, ${p.accent} 100%)`,
    "shadow-elevated": `0 20px 50px -20px color-mix(in oklab, ${p.primary} 30%, transparent)`,
    "shadow-glow": `0 0 55px -10px color-mix(in oklab, ${p.primary} 50%, transparent)`,
    radius: p.radius ?? "0.625rem",
  });
  return {
    id, name, description, swatch, supportsDark: true, category,
    light: toVars(light),
    dark,
  };
}

// ============= Additional 4 LIGHT themes =============
THEMES.push(
  mk("sky-blue-professional", "Sky Blue Professional", "Azure · Aqua · Bright glass — technical",
    ["#F0F9FF", "#0284C7", "#22D3EE", "#0369A1"], "light", {
      bg: "oklch(0.98 0.02 230)", fg: "oklch(0.20 0.05 240)",
      card: "oklch(1 0 0)", primary: "oklch(0.60 0.16 240)",
      secondary: "oklch(0.96 0.02 230)", muted: "oklch(0.96 0.02 230)",
      mutedFg: "oklch(0.48 0.04 240)", accent: "oklch(0.78 0.14 210)",
      border: "oklch(0.90 0.03 230)", sidebar: "oklch(0.32 0.10 240)",
      sidebarFg: "oklch(0.96 0.02 230)", sidebarAccent: "oklch(0.42 0.12 240)",
      sidebarBorder: "oklch(0.50 0.10 240)",
      charts: ["oklch(0.60 0.16 240)", "oklch(0.78 0.14 210)", "oklch(0.72 0.15 260)", "oklch(0.70 0.15 160)", "oklch(0.72 0.19 50)"],
      radius: "0.75rem",
    }),
  mk("silver-professional", "Silver Professional", "Steel · Silver · Electric Blue — engineering",
    ["#F1F5F9", "#475569", "#3B82F6", "#CBD5E1"], "light", {
      bg: "oklch(0.96 0.005 250)", fg: "oklch(0.20 0.01 250)",
      card: "oklch(1 0 0)", primary: "oklch(0.40 0.02 250)",
      secondary: "oklch(0.92 0.005 250)", muted: "oklch(0.92 0.005 250)",
      mutedFg: "oklch(0.48 0.01 250)", accent: "oklch(0.62 0.20 255)",
      border: "oklch(0.85 0.01 250)", sidebar: "oklch(0.24 0.01 250)",
      sidebarFg: "oklch(0.94 0.005 250)", sidebarAccent: "oklch(0.32 0.01 250)",
      sidebarBorder: "oklch(0.42 0.01 250)",
      charts: ["oklch(0.40 0.02 250)", "oklch(0.62 0.20 255)", "oklch(0.72 0.02 250)", "oklch(0.70 0.15 200)", "oklch(0.72 0.19 50)"],
      radius: "0.5rem",
    }),
  mk("minimal-white", "Minimal White", "Near-black · Neutral Gray · Blue — content-first",
    ["#FFFFFF", "#18181B", "#2563EB", "#FAFAFA"], "light", {
      bg: "oklch(1 0 0)", fg: "oklch(0.15 0 0)",
      card: "oklch(0.99 0 0)", primary: "oklch(0.18 0 0)",
      secondary: "oklch(0.97 0 0)", muted: "oklch(0.97 0 0)",
      mutedFg: "oklch(0.50 0 0)", accent: "oklch(0.55 0.20 255)",
      border: "oklch(0.90 0 0)", sidebar: "oklch(0.99 0 0)",
      sidebarFg: "oklch(0.18 0 0)", sidebarAccent: "oklch(0.95 0 0)",
      sidebarBorder: "oklch(0.90 0 0)",
      charts: ["oklch(0.18 0 0)", "oklch(0.55 0.20 255)", "oklch(0.60 0.005 260)", "oklch(0.70 0.15 160)", "oklch(0.72 0.19 50)"],
      radius: "0.375rem",
    }),
  mk("premium-cream", "Premium Cream", "Deep Brown · Warm Cream · Bronze — executive",
    ["#FFFBF2", "#5C4033", "#B7791F", "#FFF7E6"], "light", {
      bg: "oklch(0.98 0.02 85)", fg: "oklch(0.24 0.04 55)",
      card: "oklch(1 0 0)", primary: "oklch(0.35 0.05 45)",
      secondary: "oklch(0.96 0.03 85)", muted: "oklch(0.96 0.03 85)",
      mutedFg: "oklch(0.48 0.03 55)", accent: "oklch(0.62 0.13 70)",
      border: "oklch(0.90 0.03 80)", sidebar: "oklch(0.24 0.04 45)",
      sidebarFg: "oklch(0.96 0.03 85)", sidebarAccent: "oklch(0.32 0.05 45)",
      sidebarBorder: "oklch(0.42 0.05 45)",
      charts: ["oklch(0.62 0.13 70)", "oklch(0.35 0.05 45)", "oklch(0.78 0.10 85)", "oklch(0.55 0.10 40)", "oklch(0.72 0.19 50)"],
      radius: "0.625rem",
    }),
);

// ============= 10 DARK themes =============
const darkFg = "oklch(0.96 0.01 250)";
THEMES.push(
  mk("midnight-blue", "Midnight Blue", "Deep Navy · Ice Blue — analytical night",
    ["#020617", "#0F172A", "#3B82F6", "#7DD3FC"], "dark", {
      bg: "oklch(0.10 0.03 260)", fg: darkFg, card: "oklch(0.16 0.04 260)",
      primary: "oklch(0.62 0.20 255)", secondary: "oklch(0.20 0.04 260)",
      muted: "oklch(0.20 0.04 260)", mutedFg: "oklch(0.72 0.02 255)",
      accent: "oklch(0.80 0.12 230)", border: "oklch(1 0 0 / 10%)",
      sidebar: "oklch(0.08 0.03 260)", sidebarFg: darkFg,
      sidebarAccent: "oklch(0.18 0.04 260)", sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.62 0.20 255)", "oklch(0.80 0.12 230)", "oklch(0.70 0.15 280)", "oklch(0.75 0.14 200)", "oklch(0.99 0 0)"],
      radius: "0.75rem",
    }),
  mk("carbon-fiber-black", "Carbon Fiber Black", "Carbon · Metallic Silver · Orange — automotive",
    ["#080808", "#171717", "#C0C0C0", "#F97316"], "dark", {
      bg: "oklch(0.09 0 0)", fg: "oklch(0.95 0 0)", card: "oklch(0.15 0 0)",
      primary: "oklch(0.82 0.008 250)", primaryFg: "oklch(0.10 0 0)",
      secondary: "oklch(0.18 0 0)", muted: "oklch(0.18 0 0)",
      mutedFg: "oklch(0.72 0 0)", accent: "oklch(0.70 0.22 45)",
      border: "oklch(0.82 0.01 60 / 20%)", sidebar: "oklch(0.06 0 0)",
      sidebarFg: "oklch(0.95 0 0)", sidebarAccent: "oklch(0.14 0 0)",
      sidebarBorder: "oklch(0.82 0.01 60 / 15%)",
      charts: ["oklch(0.70 0.22 45)", "oklch(0.82 0.008 250)", "oklch(0.60 0.02 250)", "oklch(0.99 0 0)", "oklch(0.55 0.14 230)"],
      radius: "0.5rem",
    }),
  mk("dark-emerald", "Dark Emerald", "Deep Forest · Emerald · Mint — sustainable dark",
    ["#04130F", "#0B241C", "#10B981", "#6EE7B7"], "dark", {
      bg: "oklch(0.10 0.03 160)", fg: darkFg, card: "oklch(0.16 0.04 160)",
      primary: "oklch(0.68 0.16 160)", secondary: "oklch(0.20 0.05 160)",
      muted: "oklch(0.20 0.05 160)", mutedFg: "oklch(0.72 0.02 160)",
      accent: "oklch(0.82 0.14 155)", border: "oklch(1 0 0 / 10%)",
      sidebar: "oklch(0.08 0.03 160)", sidebarFg: darkFg,
      sidebarAccent: "oklch(0.18 0.04 160)", sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.68 0.16 160)", "oklch(0.82 0.14 155)", "oklch(0.78 0.15 130)", "oklch(0.70 0.15 200)", "oklch(0.75 0.15 60)"],
      radius: "0.75rem",
    }),
  mk("dark-crimson", "Dark Crimson", "Burgundy · Crimson · Rose — bold executive",
    ["#0F0505", "#211010", "#DC2626", "#FB7185"], "dark", {
      bg: "oklch(0.11 0.03 20)", fg: darkFg, card: "oklch(0.17 0.04 20)",
      primary: "oklch(0.58 0.22 25)", secondary: "oklch(0.20 0.04 20)",
      muted: "oklch(0.20 0.04 20)", mutedFg: "oklch(0.72 0.03 20)",
      accent: "oklch(0.72 0.16 15)", border: "oklch(1 0 0 / 10%)",
      sidebar: "oklch(0.08 0.03 20)", sidebarFg: darkFg,
      sidebarAccent: "oklch(0.18 0.04 20)", sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.58 0.22 25)", "oklch(0.72 0.16 15)", "oklch(0.65 0.18 5)", "oklch(0.80 0.13 40)", "oklch(0.72 0.19 50)"],
      radius: "0.625rem",
    }),
  mk("dark-purple-elite", "Dark Purple Elite", "Violet · Deep Purple · Fuchsia — elite creative",
    ["#090510", "#1A1025", "#8B5CF6", "#D946EF"], "dark", {
      bg: "oklch(0.10 0.04 300)", fg: darkFg, card: "oklch(0.17 0.06 300)",
      primary: "oklch(0.62 0.22 300)", secondary: "oklch(0.22 0.06 300)",
      muted: "oklch(0.22 0.06 300)", mutedFg: "oklch(0.72 0.03 300)",
      accent: "oklch(0.72 0.24 330)", border: "oklch(1 0 0 / 10%)",
      sidebar: "oklch(0.08 0.04 300)", sidebarFg: darkFg,
      sidebarAccent: "oklch(0.18 0.06 300)", sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.62 0.22 300)", "oklch(0.72 0.24 330)", "oklch(0.78 0.15 200)", "oklch(0.85 0.13 90)", "oklch(0.99 0 0)"],
      radius: "0.75rem",
    }),
  mk("dark-navy", "Dark Navy", "Royal · Navy · Sky Blue — corporate stable",
    ["#020617", "#111827", "#2563EB", "#38BDF8"], "dark", {
      bg: "oklch(0.11 0.03 260)", fg: darkFg, card: "oklch(0.18 0.04 260)",
      primary: "oklch(0.55 0.20 255)", secondary: "oklch(0.22 0.05 260)",
      muted: "oklch(0.22 0.05 260)", mutedFg: "oklch(0.72 0.03 255)",
      accent: "oklch(0.78 0.14 230)", border: "oklch(1 0 0 / 10%)",
      sidebar: "oklch(0.09 0.03 260)", sidebarFg: darkFg,
      sidebarAccent: "oklch(0.18 0.04 260)", sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.55 0.20 255)", "oklch(0.78 0.14 230)", "oklch(0.70 0.15 200)", "oklch(0.72 0.15 280)", "oklch(0.99 0 0)"],
      radius: "0.625rem",
    }),
  mk("cyber-gray", "Cyber Gray", "Graphite · Cyan · Lime — technical engineering",
    ["#101214", "#1B1F23", "#06B6D4", "#84CC16"], "dark", {
      bg: "oklch(0.14 0.005 240)", fg: darkFg, card: "oklch(0.20 0.005 240)",
      primary: "oklch(0.72 0.15 200)", secondary: "oklch(0.24 0.005 240)",
      muted: "oklch(0.24 0.005 240)", mutedFg: "oklch(0.72 0.01 240)",
      accent: "oklch(0.80 0.18 130)", accentFg: "oklch(0.14 0 0)",
      border: "oklch(1 0 0 / 10%)", sidebar: "oklch(0.11 0.005 240)",
      sidebarFg: darkFg, sidebarAccent: "oklch(0.20 0.005 240)",
      sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.72 0.15 200)", "oklch(0.80 0.18 130)", "oklch(0.62 0.20 255)", "oklch(0.72 0.19 50)", "oklch(0.99 0 0)"],
      radius: "0.5rem",
    }),
  mk("dark-steel", "Dark Steel", "Gunmetal · Steel Blue · Silver — heavy machinery",
    ["#11161A", "#1E272E", "#4682B4", "#BFC5C9"], "dark", {
      bg: "oklch(0.15 0.008 240)", fg: darkFg, card: "oklch(0.22 0.01 240)",
      primary: "oklch(0.55 0.10 240)", secondary: "oklch(0.25 0.01 240)",
      muted: "oklch(0.25 0.01 240)", mutedFg: "oklch(0.72 0.01 240)",
      accent: "oklch(0.80 0.008 250)", accentFg: "oklch(0.15 0 0)",
      border: "oklch(1 0 0 / 10%)", sidebar: "oklch(0.12 0.008 240)",
      sidebarFg: darkFg, sidebarAccent: "oklch(0.22 0.01 240)",
      sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.55 0.10 240)", "oklch(0.80 0.008 250)", "oklch(0.70 0.12 220)", "oklch(0.72 0.19 50)", "oklch(0.99 0 0)"],
      radius: "0.5rem",
    }),
  mk("matte-black-orange", "Matte Black Orange", "Matte Black · Performance Orange · Silver",
    ["#0B0B0B", "#171717", "#F97316", "#A3A3A3"], "dark", {
      bg: "oklch(0.09 0 0)", fg: "oklch(0.95 0 0)", card: "oklch(0.15 0 0)",
      primary: "oklch(0.70 0.22 45)", secondary: "oklch(0.18 0 0)",
      muted: "oklch(0.18 0 0)", mutedFg: "oklch(0.72 0 0)",
      accent: "oklch(0.72 0.008 250)", accentFg: "oklch(0.10 0 0)",
      border: "oklch(1 0 0 / 10%)", sidebar: "oklch(0.06 0 0)",
      sidebarFg: "oklch(0.95 0 0)", sidebarAccent: "oklch(0.14 0 0)",
      sidebarBorder: "oklch(1 0 0 / 8%)",
      charts: ["oklch(0.70 0.22 45)", "oklch(0.78 0.20 55)", "oklch(0.72 0.008 250)", "oklch(0.99 0 0)", "oklch(0.55 0.14 230)"],
      radius: "0.625rem",
    }),
  mk("lambo-ultimate-dark", "Lamborghini Ultimate Dark", "Carbon · Orange · Silver — supercar cockpit",
    ["#090909", "#171717", "#FF6A00", "#C0C0C0"], "dark", {
      bg: "oklch(0.08 0 0)", fg: "oklch(0.96 0.01 60)", card: "oklch(0.15 0.008 30)",
      primary: "oklch(0.70 0.22 45)", secondary: "oklch(0.18 0.008 30)",
      muted: "oklch(0.18 0.008 30)", mutedFg: "oklch(0.75 0.005 60)",
      accent: "oklch(0.82 0.01 60)", accentFg: "oklch(0.10 0 0)",
      border: "oklch(0.82 0.01 60 / 22%)", sidebar: "oklch(0.05 0 0)",
      sidebarFg: "oklch(0.94 0.008 60)", sidebarAccent: "oklch(0.14 0.008 30)",
      sidebarBorder: "oklch(0.82 0.01 60 / 15%)",
      charts: ["oklch(0.70 0.22 45)", "oklch(0.82 0.01 60)", "oklch(0.99 0 0)", "oklch(0.60 0.02 250)", "oklch(0.55 0.14 230)"],
      radius: "0.75rem",
    }),
);

// ============= 6 SPECIAL themes =============
THEMES.push(
  mk("special-light", "Special Light Aurora", "Blue · Violet · Rose · Gold — magical aurora",
    ["#2563EB", "#8B5CF6", "#F43F5E", "#F59E0B"], "special", {
      bg: "oklch(0.99 0.01 280)", fg: "oklch(0.20 0.04 260)",
      card: "oklch(1 0 0)", primary: "oklch(0.55 0.20 260)",
      secondary: "oklch(0.97 0.02 280)", muted: "oklch(0.97 0.02 280)",
      mutedFg: "oklch(0.48 0.03 260)", accent: "oklch(0.62 0.22 320)",
      border: "oklch(0.90 0.02 280)", sidebar: "oklch(0.98 0.02 280)",
      sidebarFg: "oklch(0.20 0.04 260)", sidebarAccent: "oklch(0.94 0.03 300)",
      sidebarBorder: "oklch(0.90 0.02 280)",
      charts: ["oklch(0.55 0.20 260)", "oklch(0.62 0.22 320)", "oklch(0.65 0.20 15)", "oklch(0.78 0.15 80)", "oklch(0.75 0.15 200)"],
      radius: "1rem",
      heroFrom: "oklch(0.96 0.03 260)", heroTo: "oklch(0.92 0.06 320)",
    }),
  mk("special-magnetic-dark", "Special Magnetic Dark", "Violet · Cyan · Magenta — magnetic mystery",
    ["#7C3AED", "#06B6D4", "#DB2777", "#08080A"], "special", {
      bg: "oklch(0.08 0.02 290)", fg: darkFg, card: "oklch(0.14 0.04 290)",
      primary: "oklch(0.58 0.22 300)", secondary: "oklch(0.20 0.05 290)",
      muted: "oklch(0.20 0.05 290)", mutedFg: "oklch(0.72 0.02 290)",
      accent: "oklch(0.72 0.15 200)", border: "oklch(1 0 0 / 12%)",
      sidebar: "oklch(0.06 0.02 290)", sidebarFg: darkFg,
      sidebarAccent: "oklch(0.14 0.04 290)", sidebarBorder: "oklch(1 0 0 / 10%)",
      charts: ["oklch(0.58 0.22 300)", "oklch(0.72 0.15 200)", "oklch(0.62 0.24 340)", "oklch(0.80 0.008 250)", "oklch(0.55 0.20 255)"],
      radius: "0.875rem",
    }),
  mk("spiderman-web", "Spider-Web Hero", "Red · Blue · Silver — dynamic heroic",
    ["#DC2626", "#1D4ED8", "#E5E7EB", "#111111"], "special", {
      bg: "oklch(0.99 0.005 260)", fg: "oklch(0.15 0.02 260)",
      card: "oklch(1 0 0)", primary: "oklch(0.55 0.22 25)",
      secondary: "oklch(0.96 0.01 260)", muted: "oklch(0.96 0.01 260)",
      mutedFg: "oklch(0.48 0.02 260)", accent: "oklch(0.42 0.20 260)",
      border: "oklch(0.90 0.02 260)", sidebar: "oklch(0.20 0.06 260)",
      sidebarFg: "oklch(0.96 0.01 260)", sidebarAccent: "oklch(0.28 0.08 260)",
      sidebarBorder: "oklch(0.35 0.08 260)",
      charts: ["oklch(0.55 0.22 25)", "oklch(0.42 0.20 260)", "oklch(0.20 0 0)", "oklch(0.80 0.008 250)", "oklch(0.72 0.15 200)"],
      radius: "0.75rem",
      heroFrom: "oklch(0.20 0.06 260)", heroTo: "oklch(0.45 0.20 25)",
    }),
  mk("batman-signal", "Batman Signal", "Night Black · Graphite · Signal Yellow — cinematic",
    ["#050505", "#1F2937", "#FACC15", "#9CA3AF"], "special", {
      bg: "oklch(0.06 0 0)", fg: "oklch(0.95 0.01 90)",
      card: "oklch(0.14 0.01 260)", primary: "oklch(0.85 0.17 90)",
      primaryFg: "oklch(0.10 0 0)", secondary: "oklch(0.18 0.01 260)",
      muted: "oklch(0.18 0.01 260)", mutedFg: "oklch(0.72 0.01 260)",
      accent: "oklch(0.85 0.17 90)", accentFg: "oklch(0.10 0 0)",
      border: "oklch(1 0 0 / 12%)", sidebar: "oklch(0.04 0 0)",
      sidebarFg: "oklch(0.94 0.01 90)", sidebarAccent: "oklch(0.14 0.01 260)",
      sidebarBorder: "oklch(1 0 0 / 10%)",
      charts: ["oklch(0.85 0.17 90)", "oklch(0.72 0.02 260)", "oklch(0.99 0 0)", "oklch(0.55 0.05 250)", "oklch(0.78 0.14 80)"],
      radius: "0.5rem",
      heroFrom: "oklch(0.05 0 0)", heroTo: "oklch(0.14 0.01 260)",
    }),
  mk("nano-tech-reactor", "Nano-Tech Reactor", "Reactor Red · Gold · Energy Cyan — nano armor",
    ["#B91C1C", "#D4AF37", "#67E8F9", "#120606"], "special", {
      bg: "oklch(0.10 0.02 20)", fg: "oklch(0.95 0.02 60)",
      card: "oklch(0.16 0.03 20)", primary: "oklch(0.55 0.22 25)",
      secondary: "oklch(0.20 0.03 20)", muted: "oklch(0.20 0.03 20)",
      mutedFg: "oklch(0.72 0.03 40)", accent: "oklch(0.85 0.14 80)",
      accentFg: "oklch(0.12 0 0)", border: "oklch(0.85 0.14 80 / 25%)",
      sidebar: "oklch(0.09 0.02 20)", sidebarFg: "oklch(0.94 0.02 60)",
      sidebarAccent: "oklch(0.18 0.03 20)", sidebarBorder: "oklch(0.85 0.14 80 / 20%)",
      charts: ["oklch(0.55 0.22 25)", "oklch(0.85 0.14 80)", "oklch(0.85 0.13 210)", "oklch(0.99 0 0)", "oklch(0.72 0.19 50)"],
      radius: "0.75rem",
      heroFrom: "oklch(0.08 0.02 20)", heroTo: "oklch(0.30 0.15 25)",
    }),
  mk("transformer-engine", "Transformer Engine", "Industrial Blue · Engine Red · Silver · Orange — mechanical",
    ["#1D4ED8", "#DC2626", "#BFC5C9", "#F97316"], "special", {
      bg: "oklch(0.14 0.03 260)", fg: darkFg, card: "oklch(0.20 0.04 260)",
      primary: "oklch(0.55 0.20 255)", secondary: "oklch(0.24 0.04 260)",
      muted: "oklch(0.24 0.04 260)", mutedFg: "oklch(0.75 0.02 260)",
      accent: "oklch(0.70 0.22 45)", border: "oklch(0.80 0.008 250 / 22%)",
      sidebar: "oklch(0.11 0.02 240)", sidebarFg: darkFg,
      sidebarAccent: "oklch(0.20 0.03 240)", sidebarBorder: "oklch(0.80 0.008 250 / 18%)",
      charts: ["oklch(0.55 0.20 255)", "oklch(0.58 0.22 25)", "oklch(0.80 0.008 250)", "oklch(0.70 0.22 45)", "oklch(0.72 0.15 200)"],
      radius: "0.625rem",
      heroFrom: "oklch(0.11 0.02 240)", heroTo: "oklch(0.32 0.10 260)",
    }),
);

// ---------------------------------------------------------------------------
// Category map — used by the theme switcher to group into tabs.
// ---------------------------------------------------------------------------
const CATEGORY_OVERRIDES: Record<string, ThemeCategory> = {
  "industrial-blue": "light",
  "light-corporate": "light",
  "emerald-green": "light",
  "orange-grey": "light",
  "red-white-blue": "light",
  "chiropractic-studio": "light",
  "dental-clinic": "light",
  "lamborghini-orange": "light",
  "dark-professional": "dark",
  "luxury-black-gold": "dark",
};

for (const t of THEMES) {
  if (!t.category) t.category = CATEGORY_OVERRIDES[t.id] ?? "light";
}

export function getThemesByCategory(cat: ThemeCategory): ThemeDef[] {
  return THEMES.filter((t) => (t.category ?? "light") === cat);
}

export const DEFAULT_THEME_ID = "industrial-blue";
export const THEME_STORAGE_KEY = "app.theme.id";
export const MODE_STORAGE_KEY = "app.theme.mode";

export function getThemeById(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}


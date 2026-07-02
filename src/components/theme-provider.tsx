import * as React from "react";
import {
  THEMES,
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  MODE_STORAGE_KEY,
  getThemeById,
  type ThemeDef,
  type ThemeMode,
  type ThemeVars,
} from "@/lib/themes";

type Ctx = {
  themeId: string;
  theme: ThemeDef;
  mode: ThemeMode;
  themes: ThemeDef[];
  setThemeId: (id: string) => void;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeCtx = React.createContext<Ctx | null>(null);

function applyVars(theme: ThemeDef, mode: ThemeMode) {
  const root = document.documentElement;
  const merged: Partial<ThemeVars> = { ...theme.light, ...(mode === "dark" ? theme.dark ?? {} : {}) };
  for (const [k, v] of Object.entries(merged)) {
    if (typeof v === "string") root.style.setProperty(`--${k}`, v);
  }
  root.classList.toggle("dark", mode === "dark");
  root.dataset.theme = theme.id;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = React.useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME_ID;
    return localStorage.getItem(THEME_STORAGE_KEY) ?? DEFAULT_THEME_ID;
  });
  const [mode, setModeState] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode) ?? "light";
  });

  const theme = React.useMemo(() => getThemeById(themeId), [themeId]);

  React.useEffect(() => {
    applyVars(theme, mode);
  }, [theme, mode]);

  const setThemeId = React.useCallback((id: string) => {
    setThemeIdState(id);
    try { localStorage.setItem(THEME_STORAGE_KEY, id); } catch { /* ignore */ }
  }, []);

  const setMode = React.useCallback((m: ThemeMode) => {
    setModeState(m);
    try { localStorage.setItem(MODE_STORAGE_KEY, m); } catch { /* ignore */ }
  }, []);

  const toggleMode = React.useCallback(
    () => setMode(mode === "dark" ? "light" : "dark"),
    [mode, setMode]
  );

  const value: Ctx = { themeId, theme, mode, themes: THEMES, setThemeId, setMode, toggleMode };
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Search, Sun, Moon, Sparkles, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import {
  DEFAULT_THEME_ID,
  getThemesByCategory,
  type ThemeCategory,
  type ThemeDef,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/appearance")({
  component: AppearancePage,
  head: () => ({
    meta: [
      { title: "Appearance · Theme Gallery" },
      { name: "description", content: "Browse and apply from 30 professional themes across light, dark, and special categories." },
    ],
  }),
});

function PreviewTile({ t, active, onApply }: { t: ThemeDef; active: boolean; onApply: () => void }) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-lg",
        active && "ring-2 ring-primary"
      )}
    >
      <div
        className="relative h-28 w-full"
        style={{
          background: `linear-gradient(135deg, ${t.swatch[0]} 0%, ${t.swatch[1] ?? t.swatch[0]} 45%, ${t.swatch[2] ?? t.swatch[1] ?? t.swatch[0]} 100%)`,
        }}
      >
        <div className="absolute inset-x-3 bottom-3 flex h-6 items-center gap-2 rounded-md bg-white/85 px-2 shadow-sm backdrop-blur">
          {t.swatch.slice(0, 4).map((c, i) => (
            <span key={i} className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
          ))}
          <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-slate-700">
            {t.category}
          </span>
        </div>
        {active && (
          <Badge className="absolute right-2 top-2 gap-1">
            <Check className="h-3 w-3" /> Active
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <div className="text-sm font-semibold leading-tight">{t.name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{t.description}</div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <Button size="sm" variant={active ? "secondary" : "default"} onClick={onApply}>
            {active ? "Applied" : "Apply"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AppearancePage() {
  const { themeId, setThemeId, mode, toggleMode } = useTheme();
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState<ThemeCategory>("light");

  const filtered = React.useCallback(
    (cat: ThemeCategory) =>
      getThemesByCategory(cat).filter((t) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }),
    [query]
  );

  const counts = {
    light: getThemesByCategory("light").length,
    dark: getThemesByCategory("dark").length,
    special: getThemesByCategory("special").length,
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appearance</h1>
          <p className="text-sm text-muted-foreground">
            30 professional themes — {counts.light} light, {counts.dark} dark, {counts.special} special. Changes apply instantly and persist across sessions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleMode}>
            {mode === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {mode === "dark" ? "Light mode" : "Dark mode"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setThemeId(DEFAULT_THEME_ID)}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-base">Theme Gallery</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search themes..."
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as ThemeCategory)}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="light" className="gap-1.5">
                <Sun className="h-3.5 w-3.5" /> Light
              </TabsTrigger>
              <TabsTrigger value="dark" className="gap-1.5">
                <Moon className="h-3.5 w-3.5" /> Dark
              </TabsTrigger>
              <TabsTrigger value="special" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Special
              </TabsTrigger>
            </TabsList>

            {(["light", "dark", "special"] as const).map((cat) => {
              const list = filtered(cat);
              return (
                <TabsContent key={cat} value={cat} className="mt-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((t) => (
                      <PreviewTile
                        key={t.id}
                        t={t}
                        active={t.id === themeId}
                        onApply={() => setThemeId(t.id)}
                      />
                    ))}
                  </div>
                  {list.length === 0 && (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      No themes match “{query}”.
                    </p>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

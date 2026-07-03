import * as React from "react";
import { Check, Palette, Sun, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { getThemesByCategory, type ThemeCategory, type ThemeDef } from "@/lib/themes";

function ThemeCard({
  t,
  active,
  onPick,
}: {
  t: ThemeDef;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "group flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition hover:bg-muted",
        active && "bg-muted/70 ring-1 ring-primary/40"
      )}
    >
      <div className="flex h-9 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
        {t.swatch.slice(0, 4).map((c, i) => (
          <span key={i} style={{ background: c }} className="flex-1" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-medium leading-tight">
          <span className="truncate">{t.name}</span>
          {active && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">
          {t.description}
        </div>
      </div>
    </button>
  );
}

export function ThemeSwitcher() {
  const { themeId, setThemeId, theme } = useTheme();
  const [tab, setTab] = React.useState<ThemeCategory>(
    (theme.category as ThemeCategory) ?? "light"
  );

  const light = React.useMemo(() => getThemesByCategory("light"), []);
  const dark = React.useMemo(() => getThemesByCategory("dark"), []);
  const special = React.useMemo(() => getThemesByCategory("special"), []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={`Theme: ${theme.name}`}
          className="relative"
        >
          <Palette className="h-4 w-4" />
          <span
            aria-hidden
            className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full ring-1 ring-background"
            style={{ background: "var(--primary)" }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[22rem] p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-3 pt-3">
          <span>Appearance</span>
          <span className="text-[10px] font-normal text-muted-foreground">
            Saved locally
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Tabs value={tab} onValueChange={(v) => setTab(v as ThemeCategory)}>
          <div className="px-2 pt-2">
            <TabsList className="grid w-full grid-cols-3">
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
          </div>

          {(["light", "dark", "special"] as const).map((cat) => {
            const list = cat === "light" ? light : cat === "dark" ? dark : special;
            return (
              <TabsContent
                key={cat}
                value={cat}
                className="mt-0 max-h-[55vh] overflow-y-auto p-2"
              >
                <div className="flex flex-col gap-0.5">
                  {list.map((t) => (
                    <ThemeCard
                      key={t.id}
                      t={t}
                      active={t.id === themeId}
                      onPick={() => setThemeId(t.id)}
                    />
                  ))}
                  {list.length === 0 && (
                    <p className="p-4 text-center text-xs text-muted-foreground">
                      No themes in this group yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

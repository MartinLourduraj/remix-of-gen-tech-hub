import * as React from "react";
import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function ThemeSwitcher() {
  const { themes, themeId, setThemeId, theme } = useTheme();

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
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Appearance</span>
          <span className="text-[10px] font-normal text-muted-foreground">
            Saved locally
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[60vh] overflow-y-auto py-1">
          {themes.map((t) => {
            const active = t.id === themeId;
            return (
              <DropdownMenuItem
                key={t.id}
                onSelect={(e) => {
                  e.preventDefault();
                  setThemeId(t.id);
                }}
                className={cn(
                  "flex items-start gap-3 py-2.5",
                  active && "bg-muted/60"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
                  {t.swatch.slice(0, 4).map((c, i) => (
                    <span key={i} style={{ background: c }} className="flex-1" />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium leading-tight">
                    {t.name}
                    {active && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {t.description}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

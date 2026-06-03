import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Eye, Trash2, Save, X, Search, Download, Printer } from "lucide-react";

type Action = { label: string; icon: React.ElementType; onClick?: () => void; variant?: "default" | "outline" | "secondary" | "destructive" | "ghost"; type?: "button" | "submit" };

export function ActionBar({ actions }: { actions: Action[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((a, i) => {
        const Icon = a.icon;
        return (
          <Button key={i} type={a.type ?? "button"} size="sm" variant={a.variant ?? "outline"} onClick={a.onClick}>
            <Icon className="mr-1.5 h-3.5 w-3.5" /> {a.label}
          </Button>
        );
      })}
    </div>
  );
}

export const stdIcons = { Plus, Pencil, Eye, Trash2, Save, X, Search, Download, Printer };
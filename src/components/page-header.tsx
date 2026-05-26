import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PageHeader({
  title, description, action, children,
}: {
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {action && (
          <Button size="sm" onClick={action.onClick}>
            <Plus className="mr-1.5 h-4 w-4" /> {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
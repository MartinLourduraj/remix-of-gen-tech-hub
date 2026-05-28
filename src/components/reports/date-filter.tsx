import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalIcon } from "lucide-react";

export type DateRange = { from: string; to: string };

const fmt = (d: Date) => d.toISOString().slice(0, 10);
const today = () => new Date();

function range(name: string): DateRange {
  const t = today();
  const start = (d: number) => fmt(new Date(t.getFullYear(), t.getMonth(), t.getDate() - d));
  switch (name) {
    case "Today":     return { from: fmt(t), to: fmt(t) };
    case "Yesterday": return { from: start(1), to: start(1) };
    case "This Week": return { from: start(t.getDay()), to: fmt(t) };
    case "This Month": {
      const f = new Date(t.getFullYear(), t.getMonth(), 1);
      return { from: fmt(f), to: fmt(t) };
    }
    case "Last Month": {
      const f = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      const e = new Date(t.getFullYear(), t.getMonth(), 0);
      return { from: fmt(f), to: fmt(e) };
    }
    case "This Quarter": {
      const qStart = Math.floor(t.getMonth() / 3) * 3;
      return { from: fmt(new Date(t.getFullYear(), qStart, 1)), to: fmt(t) };
    }
    case "This Year": return { from: fmt(new Date(t.getFullYear(), 0, 1)), to: fmt(t) };
    case "Financial Year": {
      const y = t.getMonth() >= 3 ? t.getFullYear() : t.getFullYear() - 1;
      return { from: `${y}-04-01`, to: fmt(t) };
    }
    default: return { from: "", to: "" };
  }
}

const QUICK = ["Today","Yesterday","This Week","This Month","Last Month","This Quarter","This Year","Financial Year"];

export function DateFilter({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5">
        <CalIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <Input type="date" className="h-8 w-36" value={value.from} onChange={(e) => onChange({ ...value, from: e.target.value })} />
        <span className="text-xs text-muted-foreground">to</span>
        <Input type="date" className="h-8 w-36" value={value.to} onChange={(e) => onChange({ ...value, to: e.target.value })} />
      </div>
      <div className="flex flex-wrap gap-1">
        {QUICK.map((q) => (
          <Button key={q} type="button" variant="outline" size="sm" className="h-7 text-[11px]"
            onClick={() => onChange(range(q))}>{q}</Button>
        ))}
        <Button type="button" variant="ghost" size="sm" className="h-7 text-[11px]"
          onClick={() => onChange({ from: "", to: "" })}>Clear</Button>
      </div>
    </div>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/_public/compare")({ component: ComparePage });

function ComparePage() {
  const { products } = useData();
  const [picks, setPicks] = React.useState<string[]>(products.slice(0, 2).map(p => p.id));
  const selected = picks.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;

  const add = (id: string) => setPicks((s) => s.includes(id) || s.length >= 4 ? s : [...s, id]);
  const remove = (id: string) => setPicks((s) => s.filter(x => x !== id));

  const rows: { k: string; get: (p: any) => string }[] = [
    { k: "Capacity", get: p => `${p.capacityKVA} KVA` },
    { k: "Fuel", get: p => p.fuel },
    { k: "Price", get: p => inr(p.sellingPrice) },
    { k: "Dealer Price", get: p => inr(p.dealerPrice) },
    { k: "GST", get: p => `${p.gst}%` },
    { k: "HSN", get: p => p.hsn },
    { k: "Warranty", get: p => `${p.warrantyMonths} months` },
    { k: "Stock", get: p => p.stock > 0 ? `${p.stock} units` : "Made-to-order" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Compare</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Compare up to 4 generators</h1>
        <p className="mt-2 text-muted-foreground">Side-by-side specs to find the perfect match for your load profile.</p>
      </div>

      <div className={`grid gap-4 mb-6`} style={{ gridTemplateColumns: `repeat(${Math.min(4, selected.length + 1)}, minmax(0, 1fr))` }}>
        {selected.map((p) => (
          <Card key={p.id} className="p-4 relative">
            <button onClick={() => remove(p.id)} className="absolute top-2 right-2 p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
            <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] rounded grid place-items-center mb-3">
              <Zap className="h-12 w-12 text-[var(--brand-orange)]/80" />
            </div>
            <Badge className="bg-[var(--brand-orange)] text-white border-0">{p.capacityKVA} KVA</Badge>
            <div className="font-bold mt-2">{p.model}</div>
          </Card>
        ))}
        {selected.length < 4 && (
          <Card className="p-4 border-dashed flex flex-col items-center justify-center text-center">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <Select onValueChange={add}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Add product" /></SelectTrigger>
              <SelectContent>
                {products.filter(p => !picks.includes(p.id)).map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.model} · {p.capacityKVA} KVA</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        )}
      </div>

      {selected.length >= 2 && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.k} className={i % 2 ? "bg-muted/30" : ""}>
                  <td className="px-4 py-3 font-semibold text-muted-foreground w-40">{r.k}</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3">{r.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button asChild className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact">Request a Group Quote</Link></Button>
        <Button asChild variant="outline"><Link to="/products">Browse More <ShieldCheck className="ml-1.5 h-4 w-4" /></Link></Button>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Zap, Printer, FileDown, FileText, Phone, Download, ToggleRight } from "lucide-react";
import { productSpecs } from "@/lib/specs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/_public/compare")({ component: ComparePage });

type Row = { k: string; get: (p: Product) => string; better?: "high" | "low" };

const rows: Row[] = [
  { k: "Model Name", get: (p) => p.model },
  { k: "Capacity (KVA)", get: (p) => `${p.capacityKVA} KVA`, better: "high" },
  { k: "Capacity (KW)", get: (p) => `${productSpecs(p).capacityKW} KW`, better: "high" },
  { k: "Fuel Type", get: (p) => p.fuel },
  { k: "Engine Model", get: (p) => productSpecs(p).engineModel },
  { k: "Alternator", get: (p) => productSpecs(p).alternator },
  { k: "Controller", get: (p) => productSpecs(p).controller },
  { k: "Frequency", get: (p) => productSpecs(p).frequency },
  { k: "Voltage", get: (p) => productSpecs(p).voltage },
  { k: "Fuel Tank Capacity", get: (p) => `${productSpecs(p).tankLiters} L`, better: "high" },
  { k: "Fuel Consumption", get: (p) => productSpecs(p).fuelConsumption, better: "low" },
  { k: "Runtime (full tank)", get: (p) => `${Math.round(productSpecs(p).tankLiters / (p.capacityKVA * 0.22))} hrs @ 75%`, better: "high" },
  { k: "Noise Level", get: (p) => `${productSpecs(p).noiseDb} dB @ 1m`, better: "low" },
  { k: "Weight", get: (p) => `${productSpecs(p).weightKg.toLocaleString()} kg`, better: "low" },
  { k: "Dimensions (L×W×H)", get: (p) => productSpecs(p).dimensions },
  { k: "Application", get: (p) => productSpecs(p).application },
  { k: "Warranty", get: (p) => `${p.warrantyMonths} months`, better: "high" },
  { k: "Emission Standard", get: () => "CPCB-IV+ Compliant" },
];

function numFrom(s: string): number | null {
  const m = s.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function ComparePage() {
  const { products } = useData();
  const [picks, setPicks] = React.useState<string[]>(products.slice(0, 3).map((p) => p.id));
  const [highlight, setHighlight] = React.useState(true);
  const [diffOnly, setDiffOnly] = React.useState(false);

  const selected = picks.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];

  const add = (id: string) => setPicks((s) => (s.includes(id) || s.length >= 4 ? s : [...s, id]));
  const remove = (id: string) => setPicks((s) => s.filter((x) => x !== id));
  const swap = (idx: number, id: string) => setPicks((s) => s.map((x, i) => (i === idx ? id : x)));
  const clear = () => setPicks([]);

  const bestIndexFor = (row: Row): number | null => {
    if (!row.better || selected.length < 2) return null;
    const vals = selected.map((p) => numFrom(row.get(p)));
    if (vals.some((v) => v === null)) return null;
    const target = row.better === "high" ? Math.max(...(vals as number[])) : Math.min(...(vals as number[]));
    return vals.indexOf(target);
  };

  const visibleRows = diffOnly
    ? rows.filter((r) => new Set(selected.map((p) => r.get(p))).size > 1)
    : rows;

  const exportPDF = () => {
    if (selected.length === 0) return;
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Generator Comparison — Gen-Tech", 14, 14);
    doc.setFontSize(9);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 20);
    autoTable(doc, {
      startY: 26,
      head: [["Spec", ...selected.map((p) => `${p.model}\n${p.capacityKVA} KVA`)]],
      body: visibleRows.map((r) => [r.k, ...selected.map((p) => r.get(p))]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [13, 27, 62], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });
    doc.save(`generator-comparison-${Date.now()}.pdf`);
  };

  const cols = Math.max(2, selected.length + (selected.length < 4 ? 1 : 0));

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Compare</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Compare up to 4 generators</h1>
          <p className="mt-1 text-muted-foreground">Side-by-side technical specs · No pricing · CPCB-IV+ ready.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setHighlight((v) => !v)}>
            <ToggleRight className="mr-1 h-4 w-4" /> {highlight ? "Hide" : "Show"} Best
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDiffOnly((v) => !v)}>
            {diffOnly ? "Show all rows" : "Differences only"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1 h-4 w-4" /> Print</Button>
          <Button variant="outline" size="sm" onClick={exportPDF}><FileDown className="mr-1 h-4 w-4" /> Export PDF</Button>
          <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
        </div>
      </div>

      {selected.length === 0 ? (
        <Card className="p-12 text-center">
          <Plus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <div className="font-bold text-lg">Add products to start comparing</div>
          <div className="text-sm text-muted-foreground mt-1 mb-4">Pick up to 4 generators from the catalogue.</div>
          <Select onValueChange={add}>
            <SelectTrigger className="w-72 mx-auto"><SelectValue placeholder="Search & add product" /></SelectTrigger>
            <SelectContent>
              {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.model} · {p.capacityKVA} KVA</SelectItem>)}
            </SelectContent>
          </Select>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px]" style={{ gridTemplateColumns: `220px repeat(${cols - (selected.length < 4 ? 1 : 0)}, minmax(220px, 1fr))${selected.length < 4 ? " minmax(220px, 1fr)" : ""}` }}>
              {/* Sticky header row */}
              <div className="sticky left-0 z-20 bg-[var(--brand-navy)] text-white p-4 font-semibold text-sm">Product</div>
              {selected.map((p, i) => {
                const sp = productSpecs(p);
                return (
                  <div key={p.id} className="p-4 border-l bg-muted/30 relative">
                    <button onClick={() => remove(p.id)} className="absolute top-2 right-2 p-1 rounded hover:bg-background"><X className="h-4 w-4" /></button>
                    <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] rounded grid place-items-center mb-3 relative overflow-hidden">
                      <Zap className="h-14 w-14 text-[var(--brand-orange)]/80" />
                      <Badge className="absolute top-2 left-2 bg-[var(--brand-orange)] text-white border-0">{p.capacityKVA} KVA</Badge>
                    </div>
                    <div className="font-bold text-sm">{p.model}</div>
                    <div className="text-xs text-muted-foreground">SKU {p.sku}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sp.badges.map((b) => (
                        <Badge key={b} variant="outline" className="text-[10px] border-[var(--brand-orange)]/40 text-[var(--brand-orange)]">{b}</Badge>
                      ))}
                    </div>
                    <Select value={p.id} onValueChange={(v) => swap(i, v)}>
                      <SelectTrigger className="h-8 mt-2 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {products.filter((x) => x.id === p.id || !picks.includes(x.id)).map((x) => (
                          <SelectItem key={x.id} value={x.id}>{x.model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
              {selected.length < 4 && (
                <div className="p-4 border-l border-dashed flex flex-col items-center justify-center text-center bg-muted/10">
                  <Plus className="h-7 w-7 text-muted-foreground mb-2" />
                  <Select onValueChange={add}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Add product" /></SelectTrigger>
                    <SelectContent>
                      {products.filter((p) => !picks.includes(p.id)).map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.model} · {p.capacityKVA} KVA</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Matrix */}
              {visibleRows.map((r, ri) => {
                const best = highlight ? bestIndexFor(r) : null;
                const stripe = ri % 2 === 0 ? "bg-background" : "bg-muted/20";
                return (
                  <React.Fragment key={r.k}>
                    <div className={`sticky left-0 z-10 ${stripe} border-t px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide`}>{r.k}</div>
                    {selected.map((p, i) => (
                      <div key={p.id} className={`${stripe} border-t border-l px-4 py-3 text-sm ${best === i ? "bg-[var(--brand-orange)]/10 font-bold text-[var(--brand-navy)]" : ""}`}>
                        {r.get(p)}
                        {best === i && <span className="ml-1.5 text-[10px] text-[var(--brand-orange)]">★ BEST</span>}
                      </div>
                    ))}
                    {selected.length < 4 && <div className={`${stripe} border-t border-l border-dashed`} />}
                  </React.Fragment>
                );
              })}

              {/* Actions row */}
              <div className="sticky left-0 z-10 bg-background border-t p-4 font-semibold text-xs uppercase text-muted-foreground">Actions</div>
              {selected.map((p) => (
                <div key={p.id} className="border-t border-l p-3 bg-background space-y-1.5">
                  <Button asChild size="sm" className="w-full bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact"><FileText className="mr-1 h-3.5 w-3.5" /> Request Quote</Link></Button>
                  <Button asChild size="sm" variant="outline" className="w-full"><Link to="/contact"><Phone className="mr-1 h-3.5 w-3.5" /> Contact Sales</Link></Button>
                  <Button size="sm" variant="ghost" className="w-full" onClick={() => window.print()}><Download className="mr-1 h-3.5 w-3.5" /> Brochure</Button>
                </div>
              ))}
              {selected.length < 4 && <div className="border-t border-l border-dashed" />}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
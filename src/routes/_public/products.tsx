import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { ProductActions } from "@/components/product-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Search, ArrowRight, GitCompare } from "lucide-react";

export const Route = createFileRoute("/_public/products")({ component: ProductsPage });

function ProductsPage() {
  const { products } = useData();
  const [q, setQ] = React.useState("");
  const [fuel, setFuel] = React.useState<string>("all");
  const filtered = products.filter(p =>
    (fuel === "all" || p.fuel === fuel) &&
    (q === "" || p.model.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Catalogue</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">All Generators</h1>
        <p className="mt-2 text-muted-foreground">From 5 kVA portables to 2500 kVA industrial — CPCB-IV+ compliant.</p>
      </div>

      <Card className="p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search model or SKU…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={fuel} onValueChange={setFuel}>
          <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Fuel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fuels</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Petrol">Petrol</SelectItem>
            <SelectItem value="Gas">Gas</SelectItem>
          </SelectContent>
        </Select>
        <Button asChild variant="outline"><Link to="/compare"><GitCompare className="mr-1.5 h-4 w-4" /> Compare</Link></Button>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden group transition-all hover:shadow-elevated hover:-translate-y-1">
            <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] relative">
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="absolute inset-0 grid place-items-center"><Zap className="h-16 w-16 text-[var(--brand-orange)]/80 group-hover:scale-110 transition-transform" /></div>
              <Badge className="absolute top-3 left-3 bg-[var(--brand-orange)] text-white border-0">{p.capacityKVA} KVA</Badge>
              {p.stock > 0 && <Badge variant="outline" className="absolute top-3 right-3 bg-white/90 text-green-700 border-green-200">In Stock</Badge>}
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground">{p.fuel} · SKU {p.sku}</div>
              <Link to="/products/$id" params={{ id: p.id }} className="font-bold mt-1 block hover:text-[var(--brand-orange)]">{p.model}</Link>
              <div className="text-xs text-muted-foreground mt-1">HSN {p.hsn} · {p.warrantyMonths}m warranty</div>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <Button asChild size="sm" className="bg-[var(--brand-navy)] hover:bg-[var(--brand-navy-2)] col-span-2"><Link to="/products/$id" params={{ id: p.id }}>View Details</Link></Button>
                <Button asChild size="sm" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact">Request Quote</Link></Button>
                <Button asChild size="sm" variant="outline"><Link to="/compare"><GitCompare className="mr-1 h-3.5 w-3.5" /> Compare</Link></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">No products match your filters. <Link to="/products" className="text-[var(--brand-orange)] font-medium">Reset <ArrowRight className="inline h-3 w-3" /></Link></div>
      )}
    </div>
  );
}

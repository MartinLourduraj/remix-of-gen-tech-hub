import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ShieldCheck, Fuel, Gauge, FileText, GitCompare, ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_public/products/$id")({
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <Button asChild className="mt-6"><Link to="/products"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Catalogue</Link></Button>
    </div>
  ),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { products } = useData();
  const p = products.find((x) => x.id === id);
  if (!p) throw notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/products"><ArrowLeft className="mr-1.5 h-4 w-4" /> All Products</Link></Button>
      <div className="grid lg:grid-cols-2 gap-10">
        <Card className="aspect-square bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute inset-0 grid place-items-center"><Zap className="h-40 w-40 text-[var(--brand-orange)]/80" /></div>
          <Badge className="absolute top-4 left-4 bg-[var(--brand-orange)] text-white border-0">{p.capacityKVA} KVA</Badge>
        </Card>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">{p.fuel} Generator</div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{p.model}</h1>
          <div className="text-sm text-muted-foreground mt-1">SKU {p.sku} · HSN {p.hsn}</div>
          <div className="mt-6 text-3xl font-extrabold text-[var(--brand-navy)]">{inr(p.sellingPrice)}<span className="text-sm font-medium text-muted-foreground"> + GST {p.gst}%</span></div>
          <div className="mt-2 text-sm text-green-700 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {p.stock > 0 ? `${p.stock} units in stock — ready to dispatch` : "Made-to-order — 4 week lead time"}</div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Spec icon={Gauge} label="Capacity" value={`${p.capacityKVA} KVA`} />
            <Spec icon={Fuel} label="Fuel" value={p.fuel} />
            <Spec icon={ShieldCheck} label="Warranty" value={`${p.warrantyMonths} months`} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact"><FileText className="mr-1.5 h-4 w-4" /> Request Quote</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/compare"><GitCompare className="mr-1.5 h-4 w-4" /> Add to Compare</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/service-request">Service Enquiry</Link></Button>
          </div>

          <Card className="p-5 mt-8">
            <div className="font-semibold mb-2">Highlights</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• CPCB-IV+ emission compliant</li>
              <li>• Sound-attenuated acoustic enclosure (75 dB @ 1m)</li>
              <li>• AMF-ready control panel with remote monitoring</li>
              <li>• Pan-India installation + on-site commissioning</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="p-3 text-center">
      <Icon className="h-5 w-5 text-[var(--brand-orange)] mx-auto" />
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </Card>
  );
}

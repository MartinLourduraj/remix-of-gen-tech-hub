import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductActions } from "@/components/product-actions";
import { productSpecs } from "@/lib/specs";
import { Zap, ShieldCheck, Fuel, Gauge, ArrowLeft, CheckCircle2, FileDown, PlayCircle, Wrench, Factory } from "lucide-react";

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
  const sp = productSpecs(p);
  const related = products.filter((x) => x.id !== p.id && x.fuel === p.fuel).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/products"><ArrowLeft className="mr-1.5 h-4 w-4" /> All Products</Link></Button>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-3">
          <Card className="aspect-square bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute inset-0 grid place-items-center"><Zap className="h-40 w-40 text-[var(--brand-orange)]/80" /></div>
            <Badge className="absolute top-4 left-4 bg-[var(--brand-orange)] text-white border-0">{p.capacityKVA} KVA</Badge>
            <Badge className="absolute top-4 right-4 bg-green-600 text-white border-0">CPCB-IV+</Badge>
          </Card>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="aspect-square bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] grid place-items-center cursor-pointer hover:ring-2 ring-[var(--brand-orange)]">
                {i === 4 ? <PlayCircle className="h-7 w-7 text-[var(--brand-orange)]" /> : <Zap className="h-7 w-7 text-[var(--brand-orange)]/70" />}
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">{p.fuel} Generator · {sp.application}</div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{p.model}</h1>
          <div className="text-sm text-muted-foreground mt-1">SKU {p.sku} · HSN {p.hsn}</div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {sp.badges.map((b) => <Badge key={b} className="bg-[var(--brand-navy)] text-white border-0">{b}</Badge>)}
          </div>
          <div className="mt-4 text-sm text-green-700 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {p.stock > 0 ? `${p.stock} units in stock — ready to dispatch` : "Made-to-order — 4 week lead time"}</div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <Spec icon={Gauge} label="Capacity" value={`${p.capacityKVA} KVA · ${sp.capacityKW} KW`} />
            <Spec icon={Fuel} label="Fuel" value={`${p.fuel} · ${sp.tankLiters}L tank`} />
            <Spec icon={ShieldCheck} label="Warranty" value={`${p.warrantyMonths} months`} />
          </div>
          <div className="mt-6"><ProductActions variant="detail" /></div>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview" className="mt-12">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Technical Specifications</TabsTrigger>
          <TabsTrigger value="apps">Applications</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="warranty">Warranty</TabsTrigger>
          <TabsTrigger value="related">Related Products</TabsTrigger>
          <TabsTrigger value="service">Service Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold">Highlights</h3>
            <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" /> CPCB-IV+ emission compliant</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" /> Sound-attenuated acoustic enclosure ({sp.noiseDb} dB @ 1m)</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" /> {sp.controller} with remote monitoring</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" /> Pan-India installation + commissioning</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" /> Genuine OEM spare parts ecosystem</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" /> AMC, load-bank tests, oil-change schedules</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Capacity (KVA)", `${sp.capacityKVA} KVA`],
                  ["Capacity (KW)", `${sp.capacityKW} KW`],
                  ["Fuel", sp.fuel],
                  ["Engine Model", sp.engineModel],
                  ["Alternator", sp.alternator],
                  ["Controller", sp.controller],
                  ["Frequency", sp.frequency],
                  ["Voltage", sp.voltage],
                  ["Fuel Tank", `${sp.tankLiters} L`],
                  ["Fuel Consumption", sp.fuelConsumption],
                  ["Noise Level", `${sp.noiseDb} dB @ 1m`],
                  ["Weight", `${sp.weightKg.toLocaleString()} kg`],
                  ["Dimensions", sp.dimensions],
                  ["Starting System", sp.startingSystem],
                  ["Emission Standard", "CPCB-IV+ Compliant"],
                ].map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-muted/30" : ""}>
                    <td className="px-4 py-3 font-semibold text-muted-foreground w-1/3">{k}</td>
                    <td className="px-4 py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="apps" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Hospitals & Critical Care", "Manufacturing Plants", "Construction Sites", "Telecom Towers", "Data Centers", "Commercial Buildings"].map((a) => (
              <Card key={a} className="p-5"><Factory className="h-7 w-7 text-[var(--brand-orange)] mb-2" /><div className="font-semibold">{a}</div><div className="text-sm text-muted-foreground mt-1">Recommended for continuous and prime-power duty cycles.</div></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { t: "Product Brochure", d: "Full specifications & dimensions" },
              { t: "Technical Datasheet", d: "Engine & alternator data" },
              { t: "Installation Manual", d: "Site prep & commissioning" },
              { t: "AMC Schedule", d: "Recommended service intervals" },
            ].map((d) => (
              <Card key={d.t} className="p-4 flex items-center justify-between">
                <div><div className="font-semibold">{d.t}</div><div className="text-sm text-muted-foreground">{d.d}</div></div>
                <Button size="sm" variant="outline" onClick={() => window.print()}><FileDown className="mr-1 h-4 w-4" /> PDF</Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-green-600" /><div><div className="font-bold text-lg">{p.warrantyMonths}-month standard warranty</div><div className="text-sm text-muted-foreground">Extendable up to 60 months under AMC</div></div></div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <li>• Covers engine, alternator and control panel manufacturing defects</li>
              <li>• Pan-India service via 240+ certified engineers</li>
              <li>• Genuine OEM spare parts guarantee</li>
              <li>• Register within 30 days of installation for activation</li>
            </ul>
            <Button asChild className="mt-4 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/warranty">Register Warranty</Link></Button>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Card key={r.id} className="overflow-hidden hover:shadow-elevated transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] grid place-items-center relative">
                  <Zap className="h-12 w-12 text-[var(--brand-orange)]/80" />
                  <Badge className="absolute top-2 left-2 bg-[var(--brand-orange)] text-white border-0">{r.capacityKVA} KVA</Badge>
                </div>
                <div className="p-3">
                  <Link to="/products/$id" params={{ id: r.id }} className="font-semibold text-sm hover:text-[var(--brand-orange)]">{r.model}</Link>
                  <div className="text-xs text-muted-foreground">{r.fuel}</div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="service" className="mt-6">
          <Card className="p-6">
            <Wrench className="h-8 w-8 text-[var(--brand-orange)] mb-2" />
            <div className="font-bold text-lg">24×7 Service Support</div>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">Annual maintenance contracts, breakdown service, load-bank testing, oil & filter changes — all backed by SLA-bound response times and a national engineer network.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button asChild className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/service-request">Raise Service Request</Link></Button>
              <Button asChild variant="outline"><Link to="/contact">AMC Enquiry</Link></Button>
              <Button asChild variant="outline"><Link to="/dealers">Find Nearest Dealer</Link></Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
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

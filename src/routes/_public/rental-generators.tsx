import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Zap, CheckCircle2, ArrowRight, FileText } from "lucide-react";

export const Route = createFileRoute("/_public/rental-generators")({ component: RentalPage });

const fleet = [
  { id: "r1", model: "Silent DG 25 KVA", kva: 25, app: "Events, Shops", tenure: "Day · Week · Month" },
  { id: "r2", model: "Silent DG 62.5 KVA", kva: 62.5, app: "Construction, SMB", tenure: "Day · Week · Month" },
  { id: "r3", model: "Industrial DG 125 KVA", kva: 125, app: "Factories, Sites", tenure: "Week · Month · Year" },
  { id: "r4", model: "Industrial DG 250 KVA", kva: 250, app: "Heavy Industry", tenure: "Week · Month · Year" },
  { id: "r5", model: "Industrial DG 500 KVA", kva: 500, app: "Telecom, Hospitals", tenure: "Month · Year" },
  { id: "r6", model: "Sync Pack 1000 KVA", kva: 1000, app: "Mega Events", tenure: "Day · Week · Month" },
];

function RentalPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Rental Marketplace</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Generators on Rent — 12 hrs to 12 months</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">Delivered, installed, operated and maintained by certified Gen-Tech engineers. Fuel & operator options available.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { i: Truck, t: "Pan-India Delivery", d: "Dispatched within 6 hours from nearest hub" },
          { i: Clock, t: "Flexible Tenure", d: "Daily, weekly, monthly contracts" },
          { i: CheckCircle2, t: "Zero Downtime SLA", d: "Standby + backup unit on-site" },
        ].map(x => (
          <Card key={x.t} className="p-5"><x.i className="h-6 w-6 text-[var(--brand-orange)] mb-3" /><div className="font-bold">{x.t}</div><div className="text-sm text-muted-foreground mt-1">{x.d}</div></Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {fleet.map(f => (
          <Card key={f.id} className="overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all">
            <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] relative grid place-items-center">
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <Zap className="h-16 w-16 text-[var(--brand-orange)]/80" />
              <Badge className="absolute top-3 left-3 bg-[var(--brand-orange)] text-white border-0">{f.kva} KVA</Badge>
            </div>
            <div className="p-4">
              <div className="font-bold">{f.model}</div>
              <div className="text-xs text-muted-foreground">{f.app}</div>
              <div className="mt-2 text-xs text-muted-foreground">Tenure: {f.tenure}</div>
              <div className="mt-3 grid grid-cols-1 gap-1.5">
                <Button asChild size="sm" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact"><FileText className="mr-1 h-3.5 w-3.5" /> Request Rental Quote</Link></Button>
                <Button asChild size="sm" variant="outline"><Link to="/contact">Check Availability <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

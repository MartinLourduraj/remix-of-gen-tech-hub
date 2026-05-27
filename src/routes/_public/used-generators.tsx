import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, MapPin, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { inr } from "@/lib/store";

export const Route = createFileRoute("/_public/used-generators")({ component: UsedMarketplace });

const stock = [
  { id: "u1", model: "Kirloskar KG1-62.5", kva: 62.5, year: 2020, hours: 4200, city: "Mumbai", price: 385000, owner: "Single Owner", grade: "A" },
  { id: "u2", model: "Cummins C150 D5", kva: 150, year: 2019, hours: 6800, city: "Pune", price: 845000, owner: "Corporate", grade: "A" },
  { id: "u3", model: "Mahindra Powerol 25", kva: 25, year: 2021, hours: 2100, city: "Chennai", price: 245000, owner: "Single Owner", grade: "A+" },
  { id: "u4", model: "Kirloskar 320 kVA", kva: 320, year: 2018, hours: 9100, city: "Delhi", price: 1450000, owner: "Industrial", grade: "B" },
  { id: "u5", model: "Cummins C45", kva: 45, year: 2022, hours: 1200, city: "Bengaluru", price: 425000, owner: "Single Owner", grade: "A+" },
  { id: "u6", model: "Mahindra 82.5 kVA", kva: 82.5, year: 2019, hours: 5800, city: "Hyderabad", price: 545000, owner: "Single Owner", grade: "A" },
];

export default function UsedMarketplace() { return <Page />; }

function Page() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Pre-Owned</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Second-Hand Generator Marketplace</h1>
          <p className="mt-2 text-muted-foreground">Inspected, refurbished and warranty-backed pre-owned generators.</p>
        </div>
        <Button asChild className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact">Sell Your Generator <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stock.map(u => (
          <Card key={u.id} className="overflow-hidden group hover:shadow-elevated hover:-translate-y-1 transition-all">
            <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] relative">
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="absolute inset-0 grid place-items-center"><Zap className="h-16 w-16 text-[var(--brand-orange)]/80" /></div>
              <Badge className="absolute top-3 left-3 bg-[var(--brand-orange)] text-white border-0">{u.kva} KVA</Badge>
              <Badge className="absolute top-3 right-3 bg-green-600 text-white border-0">Grade {u.grade}</Badge>
            </div>
            <div className="p-4">
              <div className="font-bold">{u.model}</div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {u.hours.toLocaleString()} hrs</span>
                <span>Year {u.year}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {u.city}</span>
                <span>{u.owner}</span>
              </div>
              <div className="mt-3 text-xl font-extrabold text-[var(--brand-navy)]">{inr(u.price)}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><ShieldCheck className="h-3 w-3 text-green-600" /> 90-day Gen-Tech warranty</div>
              <Button asChild className="w-full mt-3 bg-[var(--brand-navy)] hover:bg-[var(--brand-navy-2)]"><Link to="/contact">Enquire Now</Link></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

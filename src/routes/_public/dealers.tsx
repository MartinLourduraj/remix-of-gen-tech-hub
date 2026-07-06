import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Search } from "lucide-react";

export const Route = createFileRoute("/_public/dealers")({ component: DealersPage });

const dealers = [
  { n: "PowerLine Dealers", city: "Gurgaon", state: "Haryana", phone: "9876500000", spec: ["Sales", "Service", "Spares"] },
  { n: "Bharat Power Services", city: "Mumbai", state: "Maharashtra", phone: "9820012345", spec: ["Sales", "AMC"] },
  { n: "Sundaram Power", city: "Chennai", state: "Tamil Nadu", phone: "9840098400", spec: ["Service", "Trolley"] },
  { n: "Karnataka GenSol", city: "Bengaluru", state: "Karnataka", phone: "9844033333", spec: ["Sales", "Service"] },
  { n: "Hyderabad Power Hub", city: "Hyderabad", state: "Telangana", phone: "9000011111", spec: ["Sales", "Spares"] },
  { n: "Delhi Power Center", city: "Delhi", state: "Delhi", phone: "9811112233", spec: ["Sales", "Service", "Trolley"] },
  { n: "Pune Generators", city: "Pune", state: "Maharashtra", phone: "9822011111", spec: ["AMC", "Service"] },
  { n: "Kolkata Power Co", city: "Kolkata", state: "West Bengal", phone: "9833022222", spec: ["Sales", "Service"] },
];

function DealersPage() {
  const [q, setQ] = React.useState("");
  const list = dealers.filter(d => `${d.n} ${d.city} ${d.state}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Dealer Network</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Find your nearest Gen-Tech dealer</h1>
        <p className="mt-2 text-muted-foreground">120+ authorized partners. One service standard across India.</p>
      </div>
      <Card className="p-3 mb-6 flex gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by city, state, or dealer name…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" /></div>
        <Button asChild className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/login">Become a Dealer</Link></Button>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(d => (
          <Card key={d.n} className="p-5">
            <div className="font-bold">{d.n}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><MapPin className="h-3.5 w-3.5" /> {d.city}, {d.state}</div>
            <div className="text-sm flex items-center gap-1.5 mt-1"><Phone className="h-3.5 w-3.5 text-[var(--brand-orange)]" /> {d.phone}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">{d.spec.map(s => <Badge key={s} variant="outline">{s}</Badge>)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

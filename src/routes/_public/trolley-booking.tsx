import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Truck, MapPin, Calendar, Zap, CheckCircle2, Printer, Download, Calculator, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/store";

export const Route = createFileRoute("/_public/trolley-booking")({
  component: TrolleyBookingPage,
  head: () => ({
    meta: [
      { title: "Book a Generator Trolley — Gen-Tech" },
      { name: "description", content: "Book generator transport trolleys — single-axle, double-axle, heavy-duty. Loading, unloading & pan-India delivery." },
      { property: "og:title", content: "Generator Trolley Booking — Gen-Tech" },
      { property: "og:description", content: "Book generator transport trolleys — single-axle, double-axle, heavy-duty. Loading, unloading & pan-India delivery." },
    ],
  }),
});

const fleet = [
  { id: "small",     name: "Small Generator Trolley",       kva: "5 – 25 KVA",     axle: "Single Axle",  base: 3500,  perKm: 22, kind: "Mobile" },
  { id: "medium",    name: "Medium Generator Trolley",      kva: "25 – 62.5 KVA",  axle: "Single Axle",  base: 5500,  perKm: 28, kind: "Mobile" },
  { id: "heavy",     name: "Heavy-Duty Generator Trolley",  kva: "82.5 – 200 KVA", axle: "Double Axle",  base: 9500,  perKm: 42, kind: "Industrial" },
  { id: "single",    name: "Single-Axle Trolley",           kva: "Up to 62.5 KVA", axle: "Single Axle",  base: 4500,  perKm: 25, kind: "Standard" },
  { id: "double",    name: "Double-Axle Trolley",           kva: "125 – 320 KVA",  axle: "Double Axle",  base: 8500,  perKm: 38, kind: "Standard" },
  { id: "industrial",name: "Industrial Generator Trolley",  kva: "250 – 750 KVA",  axle: "Double Axle",  base: 14500, perKm: 55, kind: "Industrial" },
  { id: "mobile",    name: "Mobile Generator Trolley",      kva: "15 – 82.5 KVA",  axle: "Single Axle",  base: 4200,  perKm: 26, kind: "Mobile" },
  { id: "enclosed",  name: "Enclosed Generator Trolley",    kva: "62.5 – 250 KVA", axle: "Double Axle",  base: 10500, perKm: 44, kind: "Enclosed" },
];

function TrolleyThumb({ kind }: { kind: string }) {
  return (
    <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2,#0b1c3a)] relative grid place-items-center overflow-hidden">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:22px_22px]" />
      {/* Stylized trolley + generator */}
      <svg viewBox="0 0 200 130" className="w-4/5 h-4/5 text-[var(--brand-orange,#f97316)]" fill="none" stroke="currentColor" strokeWidth="3">
        {/* Trolley bed */}
        <rect x="20" y="60" width="150" height="14" rx="2" />
        {/* Generator body on trolley */}
        <rect x="45" y="25" width="110" height="35" rx="4" />
        {/* Vents */}
        <line x1="55" y1="35" x2="80" y2="35" />
        <line x1="55" y1="42" x2="80" y2="42" />
        <line x1="55" y1="49" x2="80" y2="49" />
        {/* Exhaust */}
        <rect x="135" y="15" width="8" height="15" />
        {/* Wheels */}
        <circle cx="55" cy="90" r="14" strokeWidth="4" />
        <circle cx="55" cy="90" r="4" />
        <circle cx="140" cy="90" r="14" strokeWidth="4" />
        <circle cx="140" cy="90" r="4" />
        {/* Tow bar */}
        <path d="M170 67 L188 60 L188 74 Z" fill="currentColor" />
        <line x1="170" y1="67" x2="175" y2="67" />
      </svg>
      <Badge className="absolute top-3 left-3 bg-[var(--brand-orange,#f97316)] text-white border-0">{kind}</Badge>
    </div>
  );
}

function TrolleyBookingPage() {
  const [selected, setSelected] = React.useState<string>("medium");
  const [distance, setDistance] = React.useState<number>(50);
  const [qty, setQty] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<number>(1500);
  const [unloading, setUnloading] = React.useState<number>(1500);
  const [other, setOther] = React.useState<number>(0);
  const [done, setDone] = React.useState(false);
  const [bookingNo] = React.useState(`TRB-${Date.now().toString().slice(-6)}`);

  const trolley = fleet.find((f) => f.id === selected) ?? fleet[0];
  const distanceCharge = distance * trolley.perKm;
  const subtotal = (trolley.base + distanceCharge + loading + unloading + other) * qty;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    toast.success(`Booking ${bookingNo} confirmed`);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Card className="p-10 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto mb-4" />
          <div className="text-2xl font-extrabold">Trolley Booking Confirmed</div>
          <div className="mt-1 text-muted-foreground">Booking No: <span className="font-mono font-semibold text-foreground">{bookingNo}</span></div>
          <div className="mt-4 text-lg">Total Estimated Amount: <span className="font-bold text-primary">{inr(total)}</span></div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1.5" /> Print Booking</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-1.5" /> Download Confirmation</Button>
            <Button asChild><Link to="/">Back to Home</Link></Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* HERO */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center mb-10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--brand-orange,#f97316)] font-semibold inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Trolley Booking
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Book a Generator Trolley</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Certified generator transport trolleys with loading, unloading and pan-India delivery. Single-axle to heavy-duty industrial towing — dispatched within 6 hours from the nearest hub.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="lg" className="bg-[var(--brand-orange,#f97316)] hover:bg-[var(--brand-orange-2,#ea580c)] text-white" onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}>
              <Truck className="h-4 w-4 mr-1.5" /> Book Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}>
              Check Availability <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
        <Card className="overflow-hidden">
          <TrolleyThumb kind="Featured — Double Axle" />
        </Card>
      </div>

      {/* FLEET */}
      <h2 className="text-xl font-bold mb-3">Choose your trolley</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {fleet.map((f) => (
          <Card
            key={f.id}
            className={`overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-elevated ${selected === f.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelected(f.id)}
          >
            <TrolleyThumb kind={f.kind} />
            <div className="p-3">
              <div className="font-bold text-sm">{f.name}</div>
              <div className="text-xs text-muted-foreground">{f.kva} · {f.axle}</div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">From</span>
                <span className="font-bold text-primary">{inr(f.base)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FORM + ESTIMATE */}
      <div id="booking-form" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="font-bold text-lg mb-4">Booking Details</div>
          <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
            <Field label="Customer Name *"><Input required /></Field>
            <Field label="Mobile Number *"><Input required type="tel" /></Field>
            <Field label="Email"><Input type="email" /></Field>
            <Field label="Customer Type">
              <Select defaultValue="Retail">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Retail","Corporate","Dealer","Government","Rental Partner"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Branch">
              <Select defaultValue="Chennai">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Chennai","Coimbatore","Madurai","Puducherry"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Trolley Type">
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{fleet.map(f=><SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>

            <Field label="Pickup Location *"><Input required placeholder="Address / City" /></Field>
            <Field label="Delivery Location *"><Input required placeholder="Address / City" /></Field>

            <Field label="Booking Date *"><Input required type="date" /></Field>
            <Field label="Required Time"><Input type="time" /></Field>
            <Field label="Return Date"><Input type="date" /></Field>
            <Field label="Distance (km) *">
              <Input required type="number" min={1} value={distance} onChange={(e) => setDistance(Number(e.target.value) || 0)} />
            </Field>

            <Field label="Generator Type">
              <Select defaultValue="Diesel">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Diesel","Gas","Petrol","Hybrid"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Generator Model"><Input placeholder="e.g. GT-Silent 62.5" /></Field>
            <Field label="Generator Capacity (kVA)"><Input type="number" placeholder="62.5" /></Field>
            <Field label="Quantity">
              <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
            </Field>

            <Field label="Vehicle Requirement">
              <Select defaultValue="Truck">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Truck","Trailer","Crane-Assisted","Self-Drive"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Purpose">
              <Select defaultValue="Site Delivery">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Site Delivery","Event","Service Movement","Return to Warehouse","Inter-branch"].map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </Field>

            <div className="sm:col-span-2"><Field label="Notes"><Textarea rows={2} placeholder="Access constraints, timing, crane availability..." /></Field></div>

            <Field label="Loading Charge (₹)"><Input type="number" value={loading} onChange={(e) => setLoading(Number(e.target.value) || 0)} /></Field>
            <Field label="Unloading Charge (₹)"><Input type="number" value={unloading} onChange={(e) => setUnloading(Number(e.target.value) || 0)} /></Field>
            <Field label="Other Charges (₹)"><Input type="number" value={other} onChange={(e) => setOther(Number(e.target.value) || 0)} /></Field>

            <div className="sm:col-span-2 flex flex-wrap gap-2 mt-2">
              <Button type="button" variant="outline" onClick={() => toast.success("Trolley available on requested date")}>
                <Calendar className="h-4 w-4 mr-1.5" /> Check Availability
              </Button>
              <Button type="button" variant="outline" onClick={() => toast.info(`Estimated ${inr(total)}`)}>
                <Calculator className="h-4 w-4 mr-1.5" /> Calculate Estimate
              </Button>
              <Button type="submit" className="bg-[var(--brand-orange,#f97316)] hover:bg-[var(--brand-orange-2,#ea580c)] text-white">
                <Truck className="h-4 w-4 mr-1.5" /> Book Trolley
              </Button>
              <Button type="button" variant="ghost" onClick={() => toast.success("Draft saved")}>Save Request</Button>
            </div>
          </form>
        </Card>

        {/* ESTIMATE PANEL */}
        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
          <Card className="overflow-hidden">
            <TrolleyThumb kind={trolley.kind} />
            <div className="p-4">
              <div className="font-bold">{trolley.name}</div>
              <div className="text-xs text-muted-foreground">{trolley.kva} · {trolley.axle}</div>
              <Badge className="mt-2" variant="secondary"><Zap className="h-3 w-3 mr-1" /> Available Today</Badge>
            </div>
          </Card>

          <Card className="p-5">
            <div className="font-bold mb-3 flex items-center gap-2"><Calculator className="h-4 w-4 text-primary" /> Estimated Charges</div>
            <dl className="text-sm space-y-1.5">
              <Row k="Base charge" v={inr(trolley.base)} />
              <Row k={`Distance (${distance} km × ${inr(trolley.perKm)})`} v={inr(distanceCharge)} />
              <Row k="Loading" v={inr(loading)} />
              <Row k="Unloading" v={inr(unloading)} />
              <Row k="Other" v={inr(other)} />
              <Row k="Quantity" v={`× ${qty}`} />
              <div className="h-px bg-border my-1.5" />
              <Row k="Subtotal" v={inr(subtotal)} />
              <Row k="GST (18%)" v={inr(tax)} />
              <div className="h-px bg-border my-1.5" />
              <div className="flex justify-between text-base font-bold">
                <span>Total Estimated</span>
                <span className="text-primary">{inr(total)}</span>
              </div>
            </dl>
          </Card>

          <Card className="p-4 text-xs text-muted-foreground flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            Estimate excludes toll, permits and inter-state entry charges. Final quote confirmed after route survey.
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-semibold">{label}</Label>{children}</div>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>;
}

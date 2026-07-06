import { createFileRoute, Link } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { ProductActions } from "@/components/product-actions";
import { VideoHeroSlider, type HeroSlide } from "@/components/video-hero-slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowRight, Zap, ShieldCheck, Wrench, Truck, Award, Factory, Fuel, Volume2,
  Phone, MapPin, Star, CheckCircle2, TrendingUp, Users,
} from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/_public/")({ component: HomePage });

const categories = [
  { name: "Diesel Generators", icon: Fuel, count: 24 },
  { name: "Silent Generators", icon: Volume2, count: 18 },
  { name: "Industrial", icon: Factory, count: 32 },
  { name: "Residential", icon: Zap, count: 12 },
  { name: "Trolley Booking", icon: Truck, count: 8 },
  { name: "Portable", icon: Award, count: 9 },
  { name: "AMF Panels", icon: ShieldCheck, count: 14 },
  { name: "Spare Parts", icon: Wrench, count: 220 },
];

const heroSlides: HeroSlide[] = [
  {
    kind: "youtube", src: "5qap5aO4i9A",
    tag: "CPCB-IV+ Ready",
    title: "Industrial Power, Engineered to Outlast.",
    sub: "Authorized dealer for Kirloskar, Cummins & Mahindra Powerol. 5 kVA to 2500 kVA with pan-India service.",
    cta1: { label: "View Products", to: "/products" },
    cta2: { label: "Request Quote", to: "/contact" },
  },
  {
    kind: "mp4",
    src: "https://cdn.coverr.co/videos/coverr-an-industrial-facility-at-night-5746/1080p.mp4",
    poster: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
    tag: "Monsoon Service Drive",
    title: "Free Health Check + 15% Off AMC.",
    sub: "Book before 30 June and get a complimentary load-bank test plus genuine spares discount.",
    cta1: { label: "Book Service", to: "/service-request" },
    cta2: { label: "AMC Enquiry", to: "/contact" },
  },
  {
    kind: "image",
    src: "https://images.unsplash.com/photo-1487875961445-47a00398c267?auto=format&fit=crop&w=1600&q=80",
    tag: "Trolley Booking",
    title: "Generator Trolley on Demand — Pan-India Transport.",
    sub: "Single-axle, double-axle and heavy-duty generator trolleys with loading, unloading and pan-India delivery.",
    cta1: { label: "Book a Trolley", to: "/trolley-booking" },
    cta2: { label: "Become Dealer", to: "/login" },
  },
];

function HomePage() {
  const { products } = useData();
  const featured = products.slice(0, 4);

  return (
    <>
      <VideoHeroSlider slides={heroSlides} />

      {/* Sizing tool below the hero video */}
      <section className="bg-[var(--brand-navy)] text-white py-10">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_400px] gap-8 items-center">
          <div className="grid grid-cols-3 gap-6 max-w-md">
            <Stat n="17+" l="Years" />
            <Stat n="8,400+" l="Installed" />
            <Stat n="120+" l="Dealers" />
          </div>
          <div className="glass rounded-2xl p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Smart Sizing</div>
                <div className="text-lg font-bold">Find the right generator</div>
              </div>
              <Zap className="h-6 w-6 text-[var(--brand-orange)]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Load (KVA)"><Input placeholder="e.g. 62" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" /></Field>
              <Field label="Fuel">
                <Select defaultValue="Diesel">
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Diesel", "Petrol", "Gas"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Application">
                <Select defaultValue="Industrial">
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Industrial", "Commercial", "Residential", "Hospital", "Telecom", "Construction"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Running hrs/day"><Input placeholder="e.g. 8" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" /></Field>
            </div>
            <Button asChild className="w-full mt-4 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">
              <Link to="/recommend">Recommend Generator <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
              Free consultation · CPCB-IV+ compliant suggestions · No spam.
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <Section eyebrow="Browse by Category" title="Power for every industry & application">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.name} to="/products" className="group">
              <Card className="p-5 h-full transition-all hover:shadow-elevated hover:-translate-y-0.5 hover:border-[var(--brand-orange)]/40">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--brand-navy)] text-[var(--brand-orange)] mb-3 group-hover:bg-[var(--brand-orange)] group-hover:text-white transition-colors">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.count} models</div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* FEATURED PRODUCTS */}
      <Section eyebrow="Best Sellers" title="Featured generators in stock"
        action={<Button asChild variant="outline"><Link to="/products">View All <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <Card key={p.id} className="overflow-hidden group transition-all hover:shadow-elevated hover:-translate-y-1">
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="absolute inset-0 grid place-items-center">
                  <Zap className="h-16 w-16 text-[var(--brand-orange)]/80 group-hover:scale-110 transition-transform" />
                </div>
                <Badge className="absolute top-3 left-3 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange)] text-white border-0">{p.capacityKVA} KVA</Badge>
                {p.stock > 0 && <Badge variant="outline" className="absolute top-3 right-3 bg-white/90 text-green-700 border-green-200">In Stock</Badge>}
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground">{p.fuel} · SKU {p.sku}</div>
                <div className="font-bold mt-1">{p.model}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.warrantyMonths}m warranty · HSN {p.hsn}</div>
                <div className="mt-3"><ProductActions productId={p.id} /></div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* WHY CHOOSE */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Why Gen-Tech</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Trusted by India's biggest names in power</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Counter n="17+" l="Years of Experience" icon={Award} />
            <Counter n="8,400+" l="Installed Generators" icon={Factory} />
            <Counter n="240+" l="Service Engineers" icon={Wrench} />
            <Counter n="6,200+" l="Active Customers" icon={Users} />
          </div>
        </div>
      </section>

      {/* SERVICE CTAs */}
      <Section eyebrow="Service & Warranty" title="Already own a Gen-Tech generator?">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Trolley Booking", d: "Book a generator transport trolley with pan-India delivery.", to: "/trolley-booking", icon: Truck },
            { t: "Raise Complaint", d: "Log a ticket — auto-assigned to your nearest engineer.", to: "/service-request", icon: Wrench },
            { t: "Book Service", d: "Periodic service, load bank tests, oil change.", to: "/service-request", icon: TrendingUp },
            { t: "AMC Enquiry", d: "Annual Maintenance Contract with SLA-backed uptime.", to: "/contact", icon: Phone },
          ].map((c) => (
            <Link key={c.t} to={c.to}>
              <Card className="p-5 h-full transition-all hover:shadow-elevated hover:-translate-y-0.5 hover:border-[var(--brand-orange)]/40">
                <c.icon className="h-7 w-7 text-[var(--brand-orange)] mb-3" />
                <div className="font-bold">{c.t}</div>
                <p className="text-sm text-muted-foreground mt-1">{c.d}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-navy)]">Open <ArrowRight className="h-3.5 w-3.5" /></div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section eyebrow="Trusted Voices" title="What our customers say">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: "Bharat Constructions", r: "Mumbai · Corporate", q: "Gen-Tech installed 8 silent DGs across our sites. Zero unplanned downtime in 18 months." },
            { n: "Sundaram Hospital", r: "Chennai · Healthcare", q: "Their AMC team is responsive. Critical care wings never lose power, day or night." },
            { n: "Karnataka PWD", r: "Bengaluru · Government", q: "Transparent billing, e-invoicing on day-1, and the engineers know their machines inside out." },
          ].map((t) => (
            <Card key={t.n} className="p-6">
              <div className="flex gap-0.5 text-[var(--brand-orange)] mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm">"{t.q}"</p>
              <div className="mt-4 pt-4 border-t">
                <div className="font-semibold text-sm">{t.n}</div>
                <div className="text-xs text-muted-foreground">{t.r}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* DEALER + CONTACT CTA */}
      <section className="bg-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="bg-[var(--brand-orange)] text-white border-0 mb-3">Pan-India Network</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">120+ authorized dealers. One service standard.</h2>
            <p className="mt-3 text-white/75 max-w-lg">Find your nearest Gen-Tech dealer for sales, spares and emergency breakdown support.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">
                <Link to="/dealers"><MapPin className="mr-1.5 h-4 w-4" /> Find a Dealer</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white">
                <Link to="/login">Become a Dealer</Link>
              </Button>
            </div>
          </div>
          <Card className="glass border-white/15 text-white p-6">
            <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Talk to Sales</div>
            <div className="text-xl font-bold mt-1">Get a tailored quote in 24 hrs</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Input placeholder="Name" className="bg-white/10 border-white/20 placeholder:text-white/40" />
              <Input placeholder="Mobile" className="bg-white/10 border-white/20 placeholder:text-white/40" />
              <Input placeholder="Company" className="bg-white/10 border-white/20 placeholder:text-white/40 col-span-2" />
              <Input placeholder="Requirement (KVA, qty, location)" className="bg-white/10 border-white/20 placeholder:text-white/40 col-span-2" />
            </div>
            <Button asChild className="w-full mt-4 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">
              <Link to="/contact">Submit Enquiry</Link>
            </Button>
          </Card>
        </div>
      </section>
    </>
  );
}

function Section({ eyebrow, title, action, children }: { eyebrow: string; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">{eyebrow}</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-[var(--brand-orange)]">{n}</div>
      <div className="text-xs text-white/60 uppercase tracking-wider">{l}</div>
    </div>
  );
}
function Counter({ n, l, icon: Icon }: { n: string; l: string; icon: any }) {
  return (
    <Card className="p-6 text-center">
      <Icon className="h-7 w-7 text-[var(--brand-orange)] mx-auto mb-3" />
      <div className="text-3xl font-extrabold text-[var(--brand-navy)]">{n}</div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{l}</div>
    </Card>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">{label}</div>
      {children}
    </div>
  );
}
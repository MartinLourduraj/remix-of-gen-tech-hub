import { createFileRoute, Link } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowRight, Zap, ShieldCheck, Wrench, Truck, Award, Factory, Fuel, Volume2,
  Phone, MapPin, Star, CheckCircle2, TrendingUp, Users, PlayCircle,
} from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/_public/")({ component: HomePage });

const categories = [
  { name: "Diesel Generators", icon: Fuel, count: 24 },
  { name: "Silent Generators", icon: Volume2, count: 18 },
  { name: "Industrial", icon: Factory, count: 32 },
  { name: "Residential", icon: Zap, count: 12 },
  { name: "Rental Fleet", icon: Truck, count: 40 },
  { name: "Portable", icon: Award, count: 9 },
  { name: "AMF Panels", icon: ShieldCheck, count: 14 },
  { name: "Spare Parts", icon: Wrench, count: 220 },
];

const slides = [
  { tag: "CPCB-IV+ Ready", title: "Industrial Power, Engineered to Outlast.", sub: "Authorized dealer for Kirloskar, Cummins & Mahindra Powerol. 5 kVA to 2500 kVA generators with pan-India service.", cta1: "View Products", cta1To: "/products", cta2: "Request Quote", cta2To: "/contact" },
  { tag: "Monsoon Service Drive", title: "Free Health Check + 15% Off AMC.", sub: "Book before 30 June and get a complimentary load-bank test plus genuine spares discount.", cta1: "Book Service", cta1To: "/service-request", cta2: "AMC Enquiry", cta2To: "/contact" },
  { tag: "Rental Marketplace", title: "Power on Demand — From 12 hrs to 12 months.", sub: "Synchronized DG sets, mobile power packs and event power — delivered, installed and supported.", cta1: "Browse Rental", cta1To: "/rental-generators", cta2: "Become Dealer", cta2To: "/login" },
];

function HomePage() {
  const { products } = useData();
  const [slide, setSlide] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[slide];

  const featured = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero text-white">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--brand-orange)]/20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange)] text-white border-0 mb-5">{s.tag}</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              {s.title}
            </h1>
            <p className="mt-5 text-lg text-white/75 max-w-xl">{s.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white shadow-glow">
                <Link to={s.cta1To}>{s.cta1} <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white">
                <Link to={s.cta2To}>{s.cta2}</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Link to="/recommend"><PlayCircle className="mr-1.5 h-4 w-4" /> Recommendation Tool</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat n="17+" l="Years" />
              <Stat n="8,400+" l="Installed" />
              <Stat n="120+" l="Dealers" />
            </div>
            <div className="mt-6 flex gap-1.5">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-[var(--brand-orange)]" : "w-4 bg-white/30"}`} />
              ))}
            </div>
          </div>

          {/* Recommendation glass card */}
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
                <div className="mt-2 text-xs text-muted-foreground">Starting at</div>
                <div className="text-lg font-extrabold text-[var(--brand-navy)]">{inr(p.sellingPrice)}</div>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" className="flex-1 bg-[var(--brand-navy)] hover:bg-[var(--brand-navy-2)]">
                    <Link to="/products">View</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/compare">Compare</Link></Button>
                </div>
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
            { t: "Register Warranty", d: "Activate your warranty + QR certificate.", to: "/warranty-register", icon: ShieldCheck },
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
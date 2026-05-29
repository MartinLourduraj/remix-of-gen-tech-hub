import * as React from "react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Zap, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Youtube, ShieldCheck, LogIn,
  Fuel, Volume2, Factory, Truck, Award, Wrench, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products", mega: true },
  { to: "/compare", label: "Compare" },
  { to: "/used-generators", label: "Used Generators" },
  { to: "/rental-generators", label: "Rental" },
  { to: "/warranty", label: "Warranty" },
  { to: "/service-request", label: "Service" },
  { to: "/dealers", label: "Dealers" },
  { to: "/contact", label: "Contact" },
] as const;

const productMega = [
  { t: "By Fuel", items: [
    { to: "/products", label: "Diesel Generators", icon: Fuel },
    { to: "/products", label: "Gas Generators", icon: Fuel },
    { to: "/products", label: "Petrol Generators", icon: Fuel },
  ]},
  { t: "By Type", items: [
    { to: "/products", label: "Silent Generators", icon: Volume2 },
    { to: "/products", label: "Industrial Generators", icon: Factory },
    { to: "/products", label: "Portable Generators", icon: Award },
  ]},
  { t: "By Application", items: [
    { to: "/products", label: "Residential 5–15 KVA", icon: Zap },
    { to: "/products", label: "Commercial 25–100 KVA", icon: Factory },
    { to: "/products", label: "Industrial 125–500 KVA", icon: Factory },
    { to: "/products", label: "Heavy 600–2500 KVA", icon: Factory },
  ]},
  { t: "Quick Links", items: [
    { to: "/recommend", label: "Sizing Tool", icon: ShieldCheck },
    { to: "/compare", label: "Compare Models", icon: Wrench },
    { to: "/rental-generators", label: "Rental Fleet", icon: Truck },
    { to: "/used-generators", label: "Pre-Owned", icon: Award },
  ]},
] as const;

export function PublicShell() {
  const [open, setOpen] = React.useState(false);
  const loc = useLocation();
  React.useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top utility bar */}
      <div className="hidden md:block text-xs bg-[var(--brand-navy)] text-white/80">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-[var(--brand-orange)]" /> 1800-200-7777</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-[var(--brand-orange)]" /> sales@gentech.in</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-[var(--brand-orange)]" /> 120+ dealers across India</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/service-request" className="hover:text-white">Raise Complaint</Link>
            <Link to="/warranty" className="hover:text-white">Register Warranty</Link>
            <Link to="/dealers" className="hover:text-white">Find Dealer</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex h-16 items-center gap-4 px-6">
          <Link to="/" className="flex items-center gap-2.5 mr-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-navy)] text-white shadow-elevated">
              <Zap className="h-4 w-4 text-[var(--brand-orange)]" />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold tracking-tight">GEN-TECH</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Generators</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 text-sm">
            {mainNav.map((n) => {
              const active = n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
              const cls = cn(
                "px-2.5 py-2 rounded-md font-medium transition-colors inline-flex items-center gap-1",
                active ? "text-[var(--brand-orange)]" : "text-foreground/80 hover:text-foreground hover:bg-muted"
              );
              if ("mega" in n && n.mega) {
                return (
                  <div key={n.to} className="relative group">
                    <Link to={n.to} className={cls}>{n.label} <ChevronDown className="h-3.5 w-3.5" /></Link>
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full pt-2 z-50">
                      <div className="w-[820px] bg-background border rounded-lg shadow-elevated p-6 grid grid-cols-4 gap-6">
                        {productMega.map((col) => (
                          <div key={col.t}>
                            <div className="text-[10px] uppercase tracking-wider text-[var(--brand-orange)] font-bold mb-2">{col.t}</div>
                            <ul className="space-y-1.5">
                              {col.items.map((it) => (
                                <li key={it.label}>
                                  <Link to={it.to} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-[var(--brand-orange)]">
                                    <it.icon className="h-3.5 w-3.5" /> {it.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link key={n.to} to={n.to} className={cls}>{n.label}</Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link to="/login"><LogIn className="mr-1.5 h-4 w-4" /> Login</Link>
            </Button>
            <Button asChild size="sm" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white shadow-glow">
              <Link to="/contact">Request Quote</Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t bg-background">
            <div className="px-4 py-3 grid grid-cols-2 gap-1">
              {mainNav.map((n) => (
                <Link key={n.to} to={n.to} className="px-3 py-2 rounded-md text-sm hover:bg-muted">{n.label}</Link>
              ))}
              <Link to="/login" className="px-3 py-2 rounded-md text-sm hover:bg-muted col-span-2 font-semibold text-[var(--brand-orange)]">Login / Portals</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[var(--brand-navy)] text-white/80 mt-20">
        <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-[var(--brand-orange)]" />
              <span className="font-extrabold tracking-tight">GEN-TECH GENERATORS</span>
            </div>
            <p className="mt-3 text-sm text-white/60 max-w-xs">
              Authorized industrial generator dealer. Sales, AMC service, spares, rental and second-hand marketplace — across India since 2008.
            </p>
            <div className="mt-4 flex items-center gap-3 text-white/60">
              <Facebook className="h-4 w-4 hover:text-[var(--brand-orange)] cursor-pointer" />
              <Twitter className="h-4 w-4 hover:text-[var(--brand-orange)] cursor-pointer" />
              <Linkedin className="h-4 w-4 hover:text-[var(--brand-orange)] cursor-pointer" />
              <Youtube className="h-4 w-4 hover:text-[var(--brand-orange)] cursor-pointer" />
            </div>
          </div>
          <FooterCol title="Explore" items={[
            { to: "/products", label: "All Products" },
            { to: "/compare", label: "Compare" },
            { to: "/recommend", label: "Recommendation Tool" },
            { to: "/used-generators", label: "Second-Hand" },
            { to: "/rental-generators", label: "Rental" },
          ]} />
          <FooterCol title="Service" items={[
            { to: "/service-request", label: "Raise Complaint" },
            { to: "/warranty", label: "Register Warranty" },
            { to: "/contact", label: "AMC Enquiry" },
            { to: "/dealers", label: "Find a Dealer" },
          ]} />
          <FooterCol title="Company" items={[
            { to: "/about", label: "About Us" },
            { to: "/contact", label: "Contact" },
            { to: "/login", label: "Portal Login" },
            { to: "/dashboard", label: "Admin Console" },
          ]} />
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
            <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-orange)]" /> ISO 9001:2015 · Authorized OEM Partner · CPCB-IV+ Compliant</div>
            <div>© 2026 Gen-Tech Generators Pvt Ltd · GSTIN 27ABCDE1234F1Z5</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

type NavItem = { to: "/products" | "/compare" | "/recommend" | "/used-generators" | "/rental-generators" | "/service-request" | "/warranty" | "/contact" | "/dealers" | "/about" | "/login" | "/dashboard"; label: string };
function FooterCol({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <div className="text-white font-semibold mb-3 text-sm">{title}</div>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.to + it.label}><Link to={it.to} className="hover:text-[var(--brand-orange)]">{it.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { Zap, ArrowLeft, KeyRound, User as UserIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/login")({ component: LoginPage });

const ROLES: Role[] = [
  "Super Admin", "Admin", "Accounts Manager", "Sales Manager",
  "Sales Executive", "Service Manager", "Inventory Manager", "Dealer",
];

const heroSlides = [
  { tag: "Industrial Power", title: "Generators built to outlast.", sub: "5 kVA – 2500 kVA · CPCB-IV+ compliant · Pan-India service." },
  { tag: "AMC Service Drive", title: "Free Health Check + 15% off AMC.", sub: "Genuine spares · Certified engineers · 24×7 emergency response." },
  { tag: "Dealer Network", title: "120+ authorized dealers.", sub: "One service standard across every state in India." },
];

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("demo1234");
  const [remember, setRemember] = React.useState(true);
  const [role, setRole] = React.useState<Role>("Super Admin");
  const [slide, setSlide] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(`${username}@gentech.in`, role);
    nav({ to: "/select-branch" });
  };

  const s = heroSlides[slide];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative bg-background">
      {/* Back to Website — always visible, high contrast */}
      <Button asChild size="sm"
        className="absolute top-4 left-4 z-20 bg-white text-[var(--brand-navy)] hover:bg-white/90 shadow-elevated border">
        <Link to="/"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Website</Link>
      </Button>

      {/* LEFT — branded hero */}
      <div className="hidden lg:flex flex-col justify-between bg-[var(--brand-navy)] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[var(--brand-orange)]/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-white/10">
            <Zap className="h-5 w-5 text-[var(--brand-orange)]" />
          </div>
          <div>
            <div className="font-extrabold tracking-tight">GEN-TECH GENERATORS</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Enterprise Portal</div>
          </div>
        </div>

        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] text-xs font-semibold uppercase tracking-wider">
            {s.tag}
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">{s.title}</h1>
          <p className="text-white/70 max-w-md">{s.sub}</p>

          <div className="flex gap-1.5">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i+1}`}
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-[var(--brand-orange)]" : "w-4 bg-white/25"}`} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-md">
            <Stat n="17+" l="Years" />
            <Stat n="8,400+" l="Installed" />
            <Stat n="120+" l="Dealers" />
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-white/50">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
          ISO 9001:2015 · Authorized OEM Partner · © 2026 Gen-Tech Generators
        </div>
      </div>

      {/* RIGHT — login form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-navy)] text-white">
              <Zap className="h-4 w-4 text-[var(--brand-orange)]" />
            </div>
            <div className="font-extrabold tracking-tight">GEN-TECH GENERATORS</div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">Sign in to your workspace</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            One portal for Admin, Employee, Dealer and Customer accounts.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="username" className="pl-9 h-11" value={username}
                  onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a className="text-xs text-[var(--brand-orange)] hover:underline" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-9 h-11" value={password}
                  onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                Remember me
              </label>
              <span className="text-xs text-muted-foreground">Secure · 2FA available</span>
            </div>

            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
                Demo: sign in as a different role
              </summary>
              <div className="mt-2">
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </details>

            <Button type="submit" size="lg"
              className="w-full h-11 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white shadow-glow">
              Sign In
            </Button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              New dealer? <Link to="/contact" className="text-[var(--brand-orange)] font-semibold hover:underline">Request access →</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-[var(--brand-orange)]">{n}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/60">{l}</div>
    </div>
  );
}
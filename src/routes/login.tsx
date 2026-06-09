import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { Zap, ArrowLeft, KeyRound, User as UserIcon, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useBranch } from "@/lib/branch-context";

export const Route = createFileRoute("/login")({ component: LoginPage });

const REMEMBER_KEY = "gentech_remember";

const heroSlides = [
  { tag: "Industrial Power", title: "Generators built to outlast.", sub: "5 kVA – 2500 kVA · CPCB-IV+ compliant · Pan-India service." },
  { tag: "AMC Service Drive", title: "Free Health Check + 15% off AMC.", sub: "Genuine spares · Certified engineers · 24×7 emergency response." },
  { tag: "Dealer Network", title: "120+ authorized dealers.", sub: "One service standard across every state in India." },
];

function nowHHMM() {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}
const b64 = (s: string) => (typeof btoa !== "undefined" ? btoa(s) : Buffer.from(s, "utf-8").toString("base64"));

function LoginPage() {
  const { login } = useAuth();
  const { employees, branches } = useData();
  const { setSelectedBranchId } = useBranch();
  const nav = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [slide, setSlide] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotMsg, setForgotMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) { setUsername(saved); setRemember(true); }
  }, []);

  React.useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Demo accounts derive directly from seeded employees (single source of truth)
  const demos = React.useMemo(
    () => employees.filter((e) => !!e.userId).slice(0, 6),
    [employees]
  );

  const fill = (u: string) => { setUsername(u); setPassword("demo1234"); setError(null); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const u = username.trim().toLowerCase();
    const p = password;
    if (!u || !p) { setError("Please enter both username and password."); return; }

    const emp = employees.find((e) => (e.userId ?? "").toLowerCase() === u);
    if (!emp) { setError("Invalid username. No such user exists."); return; }
    if (emp.passwordHash && emp.passwordHash !== b64(p)) {
      setError("Invalid password. Please try again."); return;
    }
    if (emp.status === "Locked")    { setError(`Account ${u} is locked. Contact administrator.`); return; }
    if (emp.status === "Inactive")  { setError(`Account ${u} is inactive. Contact administrator.`); return; }

    // Login window enforcement (skipped for Super Admin / Admin)
    if (emp.role !== "Super Admin" && emp.role !== "Admin" && emp.loginStart && emp.loginEnd) {
      const now = nowHHMM();
      if (now < emp.loginStart || now > emp.loginEnd) {
        setError(`Login allowed only between ${emp.loginStart} and ${emp.loginEnd}. Current time ${now}.`);
        return;
      }
    }

    if (remember) localStorage.setItem(REMEMBER_KEY, u);
    else localStorage.removeItem(REMEMBER_KEY);

    const access = emp.branchAccess ?? "ALL";
    // Specific-branch employees are auto-routed into their dashboard
    if (access !== "ALL") {
      const target = branches.find((b) => b.id === access);
      if (!target) { setError("Assigned branch not found. Contact administrator."); return; }
      setSelectedBranchId(access);
      login({
        email: emp.email || `${u}@gentech.in`, role: emp.role ?? "Sales Executive",
        empId: emp.empId, name: emp.name, branchAccess: access, branchId: access,
      });
      nav({ to: "/dashboard" });
      return;
    }

    // All-branch users must pick a working branch first
    login({
      email: emp.email || `${u}@gentech.in`, role: emp.role ?? "Super Admin",
      empId: emp.empId, name: emp.name, branchAccess: "ALL",
    });
    nav({ to: "/select-branch" });
  };

  const submitForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes("@")) { setForgotMsg("Please enter a valid email."); return; }
    setForgotMsg(`Password reset link sent to ${forgotEmail}.`);
  };

  const s = heroSlides[slide];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative bg-background">
      <Button asChild size="sm" className="absolute top-4 left-4 z-20 bg-white text-[var(--brand-navy)] hover:bg-white/90 shadow-elevated border">
        <Link to="/"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Website</Link>
      </Button>

      <div className="hidden lg:flex flex-col justify-between bg-[var(--brand-navy)] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[var(--brand-orange)]/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-white/10"><Zap className="h-5 w-5 text-[var(--brand-orange)]" /></div>
          <div>
            <div className="font-extrabold tracking-tight">GEN-TECH GENERATORS</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Enterprise Portal</div>
          </div>
        </div>
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] text-xs font-semibold uppercase tracking-wider">{s.tag}</div>
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">{s.title}</h1>
          <p className="text-white/70 max-w-md">{s.sub}</p>
          <div className="flex gap-1.5">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i+1}`}
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-[var(--brand-orange)]" : "w-4 bg-white/25"}`} />
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-white/50">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
          ISO 9001:2015 · Authorized OEM Partner · © 2026 Gen-Tech Generators
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-navy)] text-white"><Zap className="h-4 w-4 text-[var(--brand-orange)]" /></div>
            <div className="font-extrabold tracking-tight">GEN-TECH GENERATORS</div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">Sign in to your workspace</h2>
          <p className="mt-2 text-sm text-muted-foreground">One portal for Admin, Employee, Dealer and Customer accounts.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /><span>{error}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="username" className="pl-9 h-11" value={username}
                  onChange={(e) => setUsername(e.target.value)} autoComplete="username" placeholder="admin" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" onClick={() => { setForgotOpen(true); setForgotMsg(null); }}
                  className="text-xs text-[var(--brand-orange)] hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-9 h-11" value={password}
                  onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="demo1234" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
              Remember me
            </label>

            <Button type="submit" size="lg"
              className="w-full h-11 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white shadow-glow">
              Sign In
            </Button>

            <div className="rounded-md border bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                <Clock className="h-3 w-3" /> Demo accounts · click to fill (password: demo1234)
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {demos.map((e) => (
                  <button key={e.id} type="button" onClick={() => fill(e.userId!)}
                    className="text-left rounded-md border bg-background hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/5 px-2.5 py-1.5 transition-colors">
                    <div className="text-xs font-semibold">{e.role}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{e.userId} · {e.branchAccess === "ALL" ? "All branches" : (branches.find((b) => b.id === e.branchAccess)?.name ?? "—")}</div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground pt-2">
              New dealer? <Link to="/contact" className="text-[var(--brand-orange)] font-semibold hover:underline">Request access →</Link>
            </p>
          </form>

          {forgotOpen && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setForgotOpen(false)}>
              <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-lg bg-background p-6 shadow-elevated border">
                <h3 className="text-lg font-bold">Reset password</h3>
                <p className="text-xs text-muted-foreground mt-1">Enter your registered email and we'll send a reset link.</p>
                <form onSubmit={submitForgot} className="mt-4 space-y-3">
                  <Input type="email" placeholder="you@company.com" value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)} required />
                  {forgotMsg && <p className="text-xs text-[var(--brand-orange)]">{forgotMsg}</p>}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setForgotOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">Send link</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

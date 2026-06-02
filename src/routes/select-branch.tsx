import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { Building2, ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/store";
import { useBranch } from "@/lib/branch-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/select-branch")({ component: SelectBranchPage });

function SelectBranchPage() {
  const { user } = useAuth();
  const { branches, companies } = useData();
  const { selectedBranchId, setSelectedBranchId } = useBranch();
  const nav = useNavigate();
  const [pick, setPick] = React.useState<string | null>(selectedBranchId);

  React.useEffect(() => {
    if (!user) nav({ to: "/login" });
  }, [user, nav]);

  const proceed = () => {
    if (!pick) return;
    setSelectedBranchId(pick);
    nav({ to: "/dashboard" });
  };

  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen bg-[var(--brand-navy)] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--brand-orange)]/15 blur-3xl" />

      <Button asChild size="sm" variant="secondary"
        className="absolute top-4 left-4 z-20 bg-white text-[var(--brand-navy)] hover:bg-white/90 shadow-elevated">
        <Link to="/login"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Login</Link>
      </Button>

      <div className="relative w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] text-xs font-semibold uppercase tracking-wider mb-3">
            Branch Selection
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome{user ? `, ${user.name}` : ""}.
          </h1>
          <p className="mt-2 text-white/70">Select the branch you'll be operating from for this session.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {branches.filter((b) => b.active && b.type === "Branch Office").map((b) => {
            const co = companyMap[b.companyId];
            const active = pick === b.id;
            return (
              <button key={b.id} onClick={() => setPick(b.id)}
                className={`text-left rounded-lg border p-4 transition-all ${active
                  ? "border-[var(--brand-orange)] bg-white/10 ring-2 ring-[var(--brand-orange)]/60"
                  : "border-white/15 hover:border-white/30 bg-white/5"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-orange)]/20 text-[var(--brand-orange)]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold">{b.name}</div>
                      <div className="text-[11px] text-white/60">{co?.name}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white border-0 text-[10px]">{b.type}</Badge>
                </div>
                <div className="mt-3 text-xs text-white/70 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> {b.district}, {b.state} · {b.pincode}
                </div>
                <div className="mt-1 text-[11px] text-white/50 font-mono">GSTIN: {b.gstin}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" disabled={!pick} onClick={proceed}
            className="h-12 px-8 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white shadow-glow">
            Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-xs text-white/50 mt-4">
          Your branch can be switched anytime from the header.
        </p>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Zap, ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_public/recommend")({ component: RecommendPage });

function RecommendPage() {
  const { products } = useData();
  const [step, setStep] = React.useState(0);
  const [kw, setKw] = React.useState("50");
  const [kva, setKva] = React.useState("");
  const [fuel, setFuel] = React.useState("Diesel");
  const [industry, setIndustry] = React.useState("Industrial");
  const [budget, setBudget] = React.useState("medium");
  const [done, setDone] = React.useState(false);

  const targetKva = kva ? Number(kva) : Math.ceil(Number(kw || 0) / 0.8);
  const matches = React.useMemo(() => {
    const filtered = products.filter(p => p.fuel === fuel);
    return filtered
      .map(p => ({ ...p, score: Math.abs(p.capacityKVA - targetKva) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }, [products, fuel, targetKva]);

  const steps = ["Power need", "Fuel", "Application", "Budget", "Results"];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-center mb-8">
        <div className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] mb-4"><Sparkles className="h-7 w-7" /></div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Generator Recommendation Wizard</h1>
        <p className="mt-2 text-muted-foreground">Answer 4 quick questions — we'll match the perfect generator.</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s} className={`h-1.5 rounded-full transition-all ${i <= step ? "bg-[var(--brand-orange)] w-12" : "bg-muted w-6"}`} />
        ))}
      </div>

      <Card className="p-8">
        {!done && step === 0 && (
          <div className="space-y-4">
            <div className="text-xl font-bold">What's your power requirement?</div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Load in KW</Label><Input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="e.g. 50" /></div>
              <div><Label>Or KVA (optional)</Label><Input value={kva} onChange={(e) => setKva(e.target.value)} placeholder="auto-calculated" /></div>
            </div>
            <p className="text-xs text-muted-foreground">Tip: KVA ≈ KW / 0.8 (typical power factor)</p>
          </div>
        )}
        {!done && step === 1 && (
          <div className="space-y-4">
            <div className="text-xl font-bold">Preferred fuel type?</div>
            <div className="grid grid-cols-3 gap-3">
              {["Diesel", "Petrol", "Gas"].map(f => (
                <button key={f} onClick={() => setFuel(f)} className={`p-4 rounded-lg border-2 transition-all ${fuel === f ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/5" : "border-border"}`}>{f}</button>
              ))}
            </div>
          </div>
        )}
        {!done && step === 2 && (
          <div className="space-y-4">
            <div className="text-xl font-bold">Industry / Application</div>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Industrial", "Commercial", "Residential", "Hospital", "Telecom", "Construction", "Events", "Agriculture"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        {!done && step === 3 && (
          <div className="space-y-4">
            <div className="text-xl font-bold">Budget range?</div>
            <div className="grid grid-cols-3 gap-3">
              {[{ k: "low", l: "₹0–5L" }, { k: "medium", l: "₹5L–15L" }, { k: "high", l: "₹15L+" }].map(b => (
                <button key={b.k} onClick={() => setBudget(b.k)} className={`p-4 rounded-lg border-2 transition-all ${budget === b.k ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/5" : "border-border"}`}>{b.l}</button>
              ))}
            </div>
          </div>
        )}
        {done && (
          <div>
            <div className="text-xl font-bold mb-1">Recommended for you</div>
            <p className="text-sm text-muted-foreground mb-5">Based on ~{targetKva} KVA, {fuel}, {industry}</p>
            <div className="space-y-3">
              {matches.map((p, i) => (
                <Card key={p.id} className="p-4 flex gap-4 items-center">
                  <div className="grid h-16 w-16 place-items-center rounded bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)]"><Zap className="h-8 w-8 text-[var(--brand-orange)]" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><Badge className="bg-[var(--brand-orange)] text-white border-0">{p.capacityKVA} KVA</Badge>{i === 0 && <Badge variant="outline" className="text-green-700 border-green-300">Best Match</Badge>}</div>
                    <div className="font-bold mt-1">{p.model}</div>
                    <div className="text-sm text-muted-foreground">{p.fuel} · {inr(p.sellingPrice)}</div>
                  </div>
                  <Button asChild size="sm"><Link to="/products/$id" params={{ id: p.id }}>View</Link></Button>
                </Card>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => { if (done) { setDone(false); setStep(3); } else setStep(Math.max(0, step - 1)); }} disabled={!done && step === 0}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
          {!done ? (
            <Button className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white" onClick={() => { if (step === 3) setDone(true); else setStep(step + 1); }}>
              {step === 3 ? "Get Recommendations" : "Next"} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button asChild className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact">Get Quote</Link></Button>
          )}
        </div>
      </Card>
    </div>
  );
}

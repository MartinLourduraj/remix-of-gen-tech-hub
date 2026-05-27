import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/warranty")({ component: WarrantyPage });

function WarrantyPage() {
  const [done, setDone] = React.useState(false);
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-center mb-8">
        <div className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] mb-4"><ShieldCheck className="h-7 w-7" /></div>
        <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Warranty</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Register Your Warranty</h1>
        <p className="mt-2 text-muted-foreground">Activate your warranty in under a minute and receive a QR-coded certificate by email.</p>
      </div>

      {done ? (
        <Card className="p-10 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <div className="text-xl font-bold">Warranty Registered</div>
          <p className="mt-2 text-muted-foreground">Your certificate will arrive in your inbox shortly.</p>
          <Button asChild className="mt-6"><Link to="/">Back to Home</Link></Button>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); toast.success("Warranty submitted"); }} className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name"><Input required /></Field>
            <Field label="Mobile"><Input required type="tel" /></Field>
            <Field label="Email"><Input required type="email" /></Field>
            <Field label="Pincode"><Input required /></Field>
            <Field label="Generator Model"><Input required placeholder="e.g. GT-Silent 25" /></Field>
            <Field label="Serial Number"><Input required placeholder="GT-S25-2026-0042" /></Field>
            <Field label="Invoice Number"><Input required /></Field>
            <Field label="Date of Purchase"><Input required type="date" /></Field>
            <Button type="submit" className="col-span-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">Register Warranty</Button>
          </form>
        </Card>
      )}
    </div>
  );
}
function Field({ label, children }: any) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }

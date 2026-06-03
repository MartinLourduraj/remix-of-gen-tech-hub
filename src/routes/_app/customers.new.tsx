import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { useBranch } from "@/lib/branch-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { Customer } from "@/lib/types";

export const Route = createFileRoute("/_app/customers/new")({ component: NewCustomerPage });

function NewCustomerPage() {
  const { customers, add, logAudit } = useData();
  const { selectedBranchId } = useBranch();
  const nav = useNavigate();
  const [f, setF] = React.useState<Omit<Customer, "id" | "code" | "outstanding">>({
    name: "", type: "Retail", gstin: "", pan: "", mobile: "", email: "",
    city: "", state: "Tamil Nadu", pincode: "", creditLimit: 0, branchId: selectedBranchId ?? undefined,
  });
  const set = (k: keyof typeof f, v: any) => setF((x) => ({ ...x, [k]: v }));
  const save = (exit: boolean) => {
    if (!f.name || !f.mobile) { toast.error("Name and mobile are required"); return; }
    const c: Customer = { ...f, id: `c${Date.now()}`, code: `CUST-${String(customers.length + 1).padStart(4, "0")}`, outstanding: 0 };
    add("customers", c);
    logAudit({ user: "current", entity: "Customer", entityId: c.code, action: "Created", newValue: c.name });
    toast.success(`Customer ${c.code} created`);
    if (exit) nav({ to: "/customers" });
    else setF({ ...f, name: "", mobile: "", email: "", gstin: "", pan: "" });
  };
  return (
    <div>
      <PageHeader title="New Customer" description="Create a customer master record">
        <Button size="sm" variant="outline" asChild><Link to="/customers"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Name *"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Type">
            <Select value={f.type} onValueChange={(v) => set("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Retail","Corporate","Government","Dealer","Distributor"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Mobile *"><Input value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="GSTIN"><Input value={f.gstin} onChange={(e) => set("gstin", e.target.value)} /></Field>
          <Field label="PAN"><Input value={f.pan} onChange={(e) => set("pan", e.target.value)} /></Field>
          <Field label="City"><Input value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="State"><Input value={f.state} onChange={(e) => set("state", e.target.value)} /></Field>
          <Field label="Pincode"><Input value={f.pincode} onChange={(e) => set("pincode", e.target.value)} /></Field>
          <Field label="Credit Limit (₹)"><Input type="number" value={f.creditLimit} onChange={(e) => set("creditLimit", Number(e.target.value))} /></Field>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
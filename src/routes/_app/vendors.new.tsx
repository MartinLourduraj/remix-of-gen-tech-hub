import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { Vendor } from "@/lib/types";

export const Route = createFileRoute("/_app/vendors/new")({ component: NewVendorPage });

function NewVendorPage() {
  const { vendors, add, logAudit } = useData();
  const nav = useNavigate();
  const [f, setF] = React.useState<Omit<Vendor, "id" | "code">>({ name: "", gstin: "", contact: "", mobile: "", terms: "Net 30" });
  const set = (k: any, v: any) => setF({ ...f, [k]: v });
  const save = (exit: boolean) => {
    if (!f.name) { toast.error("Vendor name is required"); return; }
    const v: Vendor = { ...f, id: `v${Date.now()}`, code: `VEN-${String(vendors.length + 1).padStart(3, "0")}` };
    add("vendors", v);
    logAudit({ user: "current", entity: "Vendor", entityId: v.code, action: "Created", newValue: v.name });
    toast.success(`Vendor ${v.code} created`);
    if (exit) nav({ to: "/vendors" });
    else setF({ name: "", gstin: "", contact: "", mobile: "", terms: "Net 30" });
  };
  return (
    <div>
      <PageHeader title="New Vendor">
        <Button size="sm" variant="outline" asChild><Link to="/vendors"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <Card className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Fl label="Name *"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Fl>
        <Fl label="GSTIN"><Input value={f.gstin} onChange={(e) => set("gstin", e.target.value)} /></Fl>
        <Fl label="Contact Person"><Input value={f.contact} onChange={(e) => set("contact", e.target.value)} /></Fl>
        <Fl label="Mobile"><Input value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></Fl>
        <Fl label="Payment Terms"><Input value={f.terms} onChange={(e) => set("terms", e.target.value)} /></Fl>
      </Card>
    </div>
  );
}
function Fl({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
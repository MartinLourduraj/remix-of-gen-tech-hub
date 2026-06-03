import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Save, X, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/customers/$id/edit")({ component: EditCustomerPage });

function EditCustomerPage() {
  const { id } = useParams({ from: "/_app/customers/$id/edit" });
  const { customers, update, remove, logAudit } = useData();
  const cur = customers.find((c) => c.id === id);
  const nav = useNavigate();
  const [f, setF] = React.useState(cur);
  React.useEffect(() => { setF(cur); }, [cur?.id]);
  if (!cur || !f) return <div className="p-6 text-sm text-muted-foreground">Customer not found. <Link to="/customers" className="underline">Back to list</Link></div>;
  const set = (k: any, v: any) => setF({ ...f, [k]: v });
  const save = (exit: boolean) => {
    update("customers", cur.id, f);
    logAudit({ user: "current", entity: "Customer", entityId: cur.code, action: "Edited", oldValue: cur.name, newValue: f.name });
    toast.success("Customer updated");
    if (exit) nav({ to: "/customers" });
  };
  const del = () => {
    if (!confirm("Delete this customer?")) return;
    remove("customers", cur.id);
    logAudit({ user: "current", entity: "Customer", entityId: cur.code, action: "Deleted" });
    toast.success("Customer deleted");
    nav({ to: "/customers" });
  };
  return (
    <div>
      <PageHeader title={`Edit · ${cur.code}`} description={cur.name}>
        <Button size="sm" variant="outline" asChild><Link to="/customers"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="destructive" onClick={del}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <F label="Name"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></F>
          <F label="Type">
            <Select value={f.type} onValueChange={(v) => set("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Retail","Corporate","Government","Dealer","Distributor"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Mobile"><Input value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></F>
          <F label="Email"><Input value={f.email} onChange={(e) => set("email", e.target.value)} /></F>
          <F label="GSTIN"><Input value={f.gstin ?? ""} onChange={(e) => set("gstin", e.target.value)} /></F>
          <F label="PAN"><Input value={f.pan ?? ""} onChange={(e) => set("pan", e.target.value)} /></F>
          <F label="City"><Input value={f.city} onChange={(e) => set("city", e.target.value)} /></F>
          <F label="State"><Input value={f.state} onChange={(e) => set("state", e.target.value)} /></F>
          <F label="Pincode"><Input value={f.pincode} onChange={(e) => set("pincode", e.target.value)} /></F>
          <F label="Credit Limit (₹)"><Input type="number" value={f.creditLimit} onChange={(e) => set("creditLimit", Number(e.target.value))} /></F>
        </div>
      </Card>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
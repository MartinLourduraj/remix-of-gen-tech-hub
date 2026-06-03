import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Save, X, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/vendors/$id/edit")({ component: EditVendorPage });

function EditVendorPage() {
  const { id } = useParams({ from: "/_app/vendors/$id/edit" });
  const { vendors, update, remove, logAudit } = useData();
  const cur = vendors.find((v) => v.id === id);
  const nav = useNavigate();
  const [f, setF] = React.useState(cur);
  React.useEffect(() => { setF(cur); }, [cur?.id]);
  if (!cur || !f) return <div className="p-6 text-sm">Not found. <Link to="/vendors" className="underline">Back</Link></div>;
  const set = (k: any, v: any) => setF({ ...f, [k]: v });
  const save = (exit: boolean) => {
    update("vendors", cur.id, f);
    logAudit({ user: "current", entity: "Vendor", entityId: cur.code, action: "Edited" });
    toast.success("Vendor updated");
    if (exit) nav({ to: "/vendors" });
  };
  const del = () => {
    if (!confirm("Delete vendor?")) return;
    remove("vendors", cur.id);
    logAudit({ user: "current", entity: "Vendor", entityId: cur.code, action: "Deleted" });
    nav({ to: "/vendors" });
  };
  return (
    <div>
      <PageHeader title={`Edit · ${cur.code}`} description={cur.name}>
        <Button size="sm" variant="outline" asChild><Link to="/vendors"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="destructive" onClick={del}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <Card className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Fl label="Name"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Fl>
        <Fl label="GSTIN"><Input value={f.gstin} onChange={(e) => set("gstin", e.target.value)} /></Fl>
        <Fl label="Contact"><Input value={f.contact} onChange={(e) => set("contact", e.target.value)} /></Fl>
        <Fl label="Mobile"><Input value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></Fl>
        <Fl label="Terms"><Input value={f.terms} onChange={(e) => set("terms", e.target.value)} /></Fl>
      </Card>
    </div>
  );
}
function Fl({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
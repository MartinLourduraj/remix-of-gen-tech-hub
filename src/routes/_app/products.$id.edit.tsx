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

export const Route = createFileRoute("/_app/products/$id/edit")({ component: EditProductPage });

function EditProductPage() {
  const { id } = useParams({ from: "/_app/products/$id/edit" });
  const { products, update, remove, logAudit } = useData();
  const cur = products.find((p) => p.id === id);
  const nav = useNavigate();
  const [f, setF] = React.useState(cur);
  React.useEffect(() => { setF(cur); }, [cur?.id]);
  if (!cur || !f) return <div className="p-6 text-sm">Not found. <Link to="/products" className="underline">Back</Link></div>;
  const set = (k: any, v: any) => setF({ ...f, [k]: v });
  const save = (exit: boolean) => {
    update("products", cur.id, f);
    logAudit({ user: "current", entity: "Product", entityId: cur.sku, action: "Edited" });
    toast.success("Product updated");
    if (exit) nav({ to: "/products" });
  };
  const del = () => {
    if (!confirm("Delete product?")) return;
    remove("products", cur.id);
    logAudit({ user: "current", entity: "Product", entityId: cur.sku, action: "Deleted" });
    nav({ to: "/products" });
  };
  return (
    <div>
      <PageHeader title={`Edit · ${cur.sku}`} description={cur.model}>
        <Button size="sm" variant="outline" asChild><Link to="/products"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="destructive" onClick={del}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <Card className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Fl label="SKU"><Input value={f.sku} onChange={(e) => set("sku", e.target.value)} /></Fl>
        <Fl label="Model"><Input value={f.model} onChange={(e) => set("model", e.target.value)} /></Fl>
        <Fl label="Capacity (kVA)"><Input type="number" value={f.capacityKVA} onChange={(e) => set("capacityKVA", Number(e.target.value))} /></Fl>
        <Fl label="Fuel">
          <Select value={f.fuel} onValueChange={(v) => set("fuel", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Diesel","Petrol","Gas"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </Fl>
        <Fl label="HSN"><Input value={f.hsn} onChange={(e) => set("hsn", e.target.value)} /></Fl>
        <Fl label="GST %"><Input type="number" value={f.gst} onChange={(e) => set("gst", Number(e.target.value))} /></Fl>
        <Fl label="Purchase Price"><Input type="number" value={f.purchasePrice} onChange={(e) => set("purchasePrice", Number(e.target.value))} /></Fl>
        <Fl label="Selling Price"><Input type="number" value={f.sellingPrice} onChange={(e) => set("sellingPrice", Number(e.target.value))} /></Fl>
        <Fl label="Dealer Price"><Input type="number" value={f.dealerPrice} onChange={(e) => set("dealerPrice", Number(e.target.value))} /></Fl>
        <Fl label="Warranty (months)"><Input type="number" value={f.warrantyMonths} onChange={(e) => set("warrantyMonths", Number(e.target.value))} /></Fl>
        <Fl label="Stock"><Input type="number" value={f.stock} onChange={(e) => set("stock", Number(e.target.value))} /></Fl>
      </Card>
    </div>
  );
}
function Fl({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
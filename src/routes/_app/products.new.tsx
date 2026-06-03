import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/_app/products/new")({ component: NewProductPage });

function NewProductPage() {
  const { products, add, logAudit } = useData();
  const nav = useNavigate();
  const [f, setF] = React.useState<Omit<Product, "id">>({
    sku: "", model: "", capacityKVA: 0, fuel: "Diesel", hsn: "85021100", gst: 18,
    purchasePrice: 0, sellingPrice: 0, dealerPrice: 0, warrantyMonths: 24, stock: 0,
  });
  const set = (k: any, v: any) => setF({ ...f, [k]: v });
  const save = (exit: boolean) => {
    if (!f.sku || !f.model) { toast.error("SKU and Model are required"); return; }
    const p: Product = { ...f, id: `p${Date.now()}` };
    add("products", p);
    logAudit({ user: "current", entity: "Product", entityId: p.sku, action: "Created", newValue: p.model });
    toast.success(`Product ${p.sku} created`);
    if (exit) nav({ to: "/products" });
    else setF({ ...f, sku: "", model: "" });
  };
  return (
    <div>
      <PageHeader title="New Product">
        <Button size="sm" variant="outline" asChild><Link to="/products"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <Card className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Fl label="SKU *"><Input value={f.sku} onChange={(e) => set("sku", e.target.value)} /></Fl>
        <Fl label="Model *"><Input value={f.model} onChange={(e) => set("model", e.target.value)} /></Fl>
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
        <Fl label="Opening Stock"><Input type="number" value={f.stock} onChange={(e) => set("stock", Number(e.target.value))} /></Fl>
      </Card>
    </div>
  );
}
function Fl({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
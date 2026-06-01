import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { useBranch } from "@/lib/branch-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Save } from "lucide-react";
import type { BillType } from "@/lib/types";

export const Route = createFileRoute("/_app/sales/invoices/new")({ component: NewInvoicePage });

function NewInvoicePage() {
  const { customers, products, invoices, add, logAudit } = useData();
  const { branch, company } = useBranch();
  const nav = useNavigate();

  const [customerId, setCustomerId] = React.useState(customers[0]?.id ?? "");
  const [productId, setProductId] = React.useState(products[0]?.id ?? "");
  const [qty, setQty] = React.useState(1);
  const [discount, setDiscount] = React.useState(0);
  const [billType, setBillType] = React.useState<BillType>("B2B");

  const product = products.find((p) => p.id === productId);
  const subtotal = (product?.sellingPrice ?? 0) * qty - discount;
  const gstAmount = subtotal * ((product?.gst ?? 18) / 100);
  const total = subtotal + gstAmount;

  const save = () => {
    if (!branch || !company) { alert("Select a branch first"); return; }
    const num = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`;
    add("invoices", {
      id: `i_${Date.now()}`, number: num, customerId, date: new Date().toISOString().slice(0, 10),
      productId, qty, subtotal, gstAmount, total, paid: 0,
      status: "Pending", branchId: branch.id, billType,
    });
    logAudit({ user: "Current User", entity: "Invoice", entityId: num, action: "Created", newValue: customers.find((c) => c.id === customerId)?.name ?? "" });
    nav({ to: "/sales/invoices" });
  };

  return (
    <div>
      <PageHeader title="New Invoice" description={`Branch: ${branch?.name ?? "—"} · ${company?.name ?? ""}`} />
      <Card className="p-5 space-y-4 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bill Type</Label>
            <Select value={billType} onValueChange={(v) => setBillType(v as BillType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="B2B">B2B (with GST)</SelectItem>
                <SelectItem value="B2C">B2C (consumer)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.model}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Quantity</Label><Input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} /></div>
          <div><Label>Discount</Label><Input type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)} /></div>
        </div>
        <div className="flex justify-end">
          <div className="text-sm space-y-1 min-w-64">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>{inr(gstAmount)}</span></div>
            <div className="flex justify-between text-base font-bold border-t pt-1"><span>Total</span><span>{inr(total)}</span></div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => nav({ to: "/sales/invoices" })}>Cancel</Button>
          <Button onClick={save}><Save className="mr-1.5 h-4 w-4" /> Save Invoice</Button>
        </div>
      </Card>
    </div>
  );
}

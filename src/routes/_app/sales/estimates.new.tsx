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
import { Plus, Trash2, Save } from "lucide-react";
import type { BillType, LineItem } from "@/lib/types";

export const Route = createFileRoute("/_app/sales/estimates/new")({ component: NewEstimatePage });

function NewEstimatePage() {
  const { products, estimates, add, logAudit } = useData();
  const { branch, company } = useBranch();
  const nav = useNavigate();

  const [customerName, setCustomerName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [gstin, setGstin] = React.useState("");
  const [billType, setBillType] = React.useState<BillType>("B2B");
  const [items, setItems] = React.useState<LineItem[]>([{ productId: products[0]?.id ?? "", qty: 1, rate: products[0]?.sellingPrice ?? 0, discount: 0, taxPct: 18 }]);

  const addLine = () => setItems((x) => [...x, { productId: products[0]?.id ?? "", qty: 1, rate: products[0]?.sellingPrice ?? 0, discount: 0, taxPct: 18 }]);
  const removeLine = (i: number) => setItems((x) => x.filter((_, idx) => idx !== i));
  const updLine = (i: number, patch: Partial<LineItem>) => setItems((x) => x.map((l, idx) => idx === i ? { ...l, ...patch } : l));

  const calc = items.map((l) => {
    const base = l.qty * l.rate - l.discount;
    const tax = base * (l.taxPct / 100);
    return { base, tax, total: base + tax };
  });
  const subtotal = calc.reduce((a, b) => a + b.base, 0);
  const taxAmount = calc.reduce((a, b) => a + b.tax, 0);
  const total = subtotal + taxAmount;

  const save = () => {
    if (!branch || !company) { alert("Select a branch first"); return; }
    const num = `EST-${new Date().getFullYear()}-${String(estimates.length + 1).padStart(4, "0")}`;
    const e = {
      id: `es_${Date.now()}`, number: num, branchId: branch.id, companyId: company.id,
      customerId: `walk_${Date.now()}`, customerName, mobile, address, gstin: gstin || undefined,
      billType, date: new Date().toISOString().slice(0, 10),
      items, subtotal, taxAmount, total, status: "Draft" as const,
    };
    add("estimates", e);
    logAudit({ user: "Current User", entity: "Estimate", entityId: num, action: "Created", newValue: customerName });
    nav({ to: "/sales/estimates" });
  };

  return (
    <div>
      <PageHeader title="New Estimate" description={`Branch: ${branch?.name ?? "—"} · ${company?.name ?? ""}`} />
      <Card className="p-5 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Customer Name *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div>
          <div><Label>Mobile *</Label><Input value={mobile} onChange={(e) => setMobile(e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          <div><Label>GSTIN</Label><Input value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="Optional for B2C" /></div>
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
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Line Items</Label>
            <Button size="sm" variant="outline" onClick={addLine}><Plus className="mr-1 h-3 w-3" /> Add Line</Button>
          </div>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs">
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-right w-20">Qty</th>
                  <th className="p-2 text-right w-32">Rate</th>
                  <th className="p-2 text-right w-28">Discount</th>
                  <th className="p-2 text-right w-20">Tax%</th>
                  <th className="p-2 text-right w-32">Total</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((l, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-1">
                      <Select value={l.productId} onValueChange={(v) => {
                        const p = products.find((x) => x.id === v);
                        updLine(i, { productId: v, rate: p?.sellingPrice ?? l.rate, taxPct: p?.gst ?? l.taxPct });
                      }}>
                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.model}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="p-1"><Input type="number" className="h-9 text-right" value={l.qty} onChange={(e) => updLine(i, { qty: +e.target.value })} /></td>
                    <td className="p-1"><Input type="number" className="h-9 text-right" value={l.rate} onChange={(e) => updLine(i, { rate: +e.target.value })} /></td>
                    <td className="p-1"><Input type="number" className="h-9 text-right" value={l.discount} onChange={(e) => updLine(i, { discount: +e.target.value })} /></td>
                    <td className="p-1"><Input type="number" className="h-9 text-right" value={l.taxPct} onChange={(e) => updLine(i, { taxPct: +e.target.value })} /></td>
                    <td className="p-2 text-right font-medium">{inr(calc[i].total)}</td>
                    <td className="p-1"><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeLine(i)}><Trash2 className="h-3 w-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="text-sm space-y-1 min-w-64">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>{inr(taxAmount)}</span></div>
            <div className="flex justify-between text-base font-bold border-t pt-1"><span>Total</span><span>{inr(total)}</span></div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => nav({ to: "/sales/estimates" })}>Cancel</Button>
          <Button onClick={save}><Save className="mr-1.5 h-4 w-4" /> Save Estimate</Button>
        </div>
      </Card>
    </div>
  );
}

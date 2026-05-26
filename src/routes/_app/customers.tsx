import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { Customer } from "@/lib/types";

export const Route = createFileRoute("/_app/customers")({ component: CustomersPage });

function CustomersPage() {
  const { customers, add } = useData();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = customers.filter((c) =>
    [c.name, c.code, c.gstin, c.mobile, c.city].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const save = (data: Omit<Customer, "id" | "code" | "outstanding">) => {
    const c: Customer = {
      ...data,
      id: `c${Date.now()}`,
      code: `CUST-${String(customers.length + 1).padStart(4, "0")}`,
      outstanding: 0,
    };
    add("customers", c);
    toast.success(`Customer ${c.code} created`);
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Retail, corporate, government, dealer and distributor accounts."
      >
        <Input
          placeholder="Search name, GSTIN, mobile..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-9 w-64"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm">+ New Customer</Button></DialogTrigger>
          <CustomerForm onSave={save} />
        </Dialog>
      </PageHeader>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Credit Limit</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.code}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="secondary">{c.type}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{c.gstin ?? "—"}</TableCell>
                  <TableCell>{c.mobile}</TableCell>
                  <TableCell>{c.city}, {c.state}</TableCell>
                  <TableCell className="text-right">{inr(c.creditLimit)}</TableCell>
                  <TableCell className={`text-right font-medium ${c.outstanding > 0 ? "text-rose-600" : ""}`}>{inr(c.outstanding)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">No customers match.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function CustomerForm({ onSave }: { onSave: (c: Omit<Customer, "id" | "code" | "outstanding">) => void }) {
  const [form, setForm] = React.useState({
    name: "", type: "Retail" as Customer["type"], gstin: "", pan: "",
    mobile: "", email: "", city: "", state: "", pincode: "", creditLimit: 0,
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
      <div className="grid grid-cols-2 gap-3 py-2">
        <div className="col-span-2 space-y-1"><Label>Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="space-y-1">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Retail","Corporate","Government","Dealer","Distributor"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Mobile</Label><Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} /></div>
        <div className="space-y-1"><Label>GSTIN</Label><Input value={form.gstin} onChange={(e) => set("gstin", e.target.value)} /></div>
        <div className="space-y-1"><Label>PAN</Label><Input value={form.pan} onChange={(e) => set("pan", e.target.value)} /></div>
        <div className="col-span-2 space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div className="space-y-1"><Label>City</Label><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
        <div className="space-y-1"><Label>State</Label><Input value={form.state} onChange={(e) => set("state", e.target.value)} /></div>
        <div className="space-y-1"><Label>Pincode</Label><Input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} /></div>
        <div className="space-y-1"><Label>Credit Limit (₹)</Label><Input type="number" value={form.creditLimit} onChange={(e) => set("creditLimit", Number(e.target.value))} /></div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(form)} disabled={!form.name || !form.mobile}>Create Customer</Button>
      </DialogFooter>
    </DialogContent>
  );
}
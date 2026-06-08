import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QrCode, Download, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Warranty } from "@/lib/types";

export const Route = createFileRoute("/_app/warranty-admin")({ component: WarrantyPage });

const tone: Record<string, any> = { Active: "default", Expired: "destructive", Claimed: "secondary" };

function WarrantyPage() {
  const { warranties, customers, products, add, update, remove, logAudit } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));

  const empty = (): Warranty => ({
    id: `wr_${Date.now()}`, serial: "", engineNo: "",
    customerId: customers[0]?.id ?? "", productId: products[0]?.id ?? "",
    invoiceNumber: "",
    installationDate: new Date().toISOString().slice(0, 10),
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "Active",
  });

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Warranty | null>(null);
  const openNew = () => { setEditing(empty()); setOpen(true); };
  const openEdit = (w: Warranty) => { setEditing({ ...w }); setOpen(true); };

  const save = () => {
    if (!editing) return;
    if (!editing.serial) { toast.error("Serial # is required."); return; }
    const exists = warranties.find((w) => w.id === editing.id);
    if (exists) {
      update("warranties", editing.id, editing);
      logAudit({ user: "current", entity: "Warranty", entityId: editing.serial, action: "Edited" });
      toast.success("Warranty updated");
    } else {
      add("warranties", editing);
      logAudit({ user: "current", entity: "Warranty", entityId: editing.serial, action: "Registered" });
      toast.success("Warranty registered");
    }
    setOpen(false);
  };

  const del = (w: Warranty) => {
    if (!window.confirm(`Delete warranty ${w.serial}?`)) return;
    remove("warranties", w.id);
    logAudit({ user: "current", entity: "Warranty", entityId: w.serial, action: "Deleted" });
  };

  return (
    <div>
      <PageHeader title="Warranty Management" description="Registrations, certificates with QR, and claim tracking.">
        <Button size="sm" onClick={openNew}><Plus className="mr-1.5 h-3.5 w-3.5" /> Register Warranty</Button>
      </PageHeader>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial #</TableHead><TableHead>Engine #</TableHead><TableHead>Customer</TableHead>
                <TableHead>Product</TableHead><TableHead>Invoice</TableHead><TableHead>Installed</TableHead>
                <TableHead>Expires</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warranties.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-mono text-xs">{w.serial}</TableCell>
                  <TableCell className="font-mono text-xs">{w.engineNo}</TableCell>
                  <TableCell className="font-medium">{cMap[w.customerId]}</TableCell>
                  <TableCell>{pMap[w.productId]}</TableCell>
                  <TableCell className="font-mono text-xs">{w.invoiceNumber}</TableCell>
                  <TableCell>{w.installationDate}</TableCell>
                  <TableCell>{w.endDate}</TableCell>
                  <TableCell><Badge variant={tone[w.status]}>{w.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Certificate"><QrCode className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Download"><Download className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit" onClick={() => openEdit(w)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" title="Delete" onClick={() => del(w)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editing && warranties.find((w) => w.id === editing.id) ? "Edit Warranty" : "Register Warranty"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3 py-2">
              <F label="Serial #"><Input value={editing.serial} onChange={(e) => setEditing({ ...editing, serial: e.target.value })} /></F>
              <F label="Engine #"><Input value={editing.engineNo} onChange={(e) => setEditing({ ...editing, engineNo: e.target.value })} /></F>
              <F label="Customer" full>
                <Select value={editing.customerId} onValueChange={(v) => setEditing({ ...editing, customerId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Product" full>
                <Select value={editing.productId} onValueChange={(v) => setEditing({ ...editing, productId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.model}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Invoice #" full><Input value={editing.invoiceNumber} onChange={(e) => setEditing({ ...editing, invoiceNumber: e.target.value })} /></F>
              <F label="Installation Date"><Input type="date" value={editing.installationDate} onChange={(e) => setEditing({ ...editing, installationDate: e.target.value })} /></F>
              <F label="Start Date"><Input type="date" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></F>
              <F label="End Date"><Input type="date" value={editing.endDate} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></F>
              <F label="Status">
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as Warranty["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Active","Expired","Claimed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><Label className="text-xs">{label}</Label>{children}</div>;
}

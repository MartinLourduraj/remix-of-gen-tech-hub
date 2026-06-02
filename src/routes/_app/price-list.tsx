import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { useBranchScope } from "@/lib/branch-context";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/price-list")({ component: PriceListPage });

type PriceRow = {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  branchName: string;
  onlinePrice: number;
  offlinePrice: number;
  dealerPrice: number;
  distributorPrice: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: "Active" | "Inactive";
};

function PriceListPage() {
  const { products, branches } = useData();

  const [rows, setRows] = React.useState<PriceRow[]>(() =>
    products.map((p) => {
      const branch = branches.find((b) => b.id === p.branchId) ?? branches[0];
      return {
        id: `pr_${p.id}`,
        productId: p.id,
        productName: p.model,
        branchId: p.branchId ?? branch.id,
        branchName: branch?.name ?? "",
        onlinePrice: p.sellingPrice,
        offlinePrice: Math.round(p.sellingPrice * 1.05),
        dealerPrice: p.dealerPrice,
        distributorPrice: Math.round(p.dealerPrice * 0.95),
        effectiveFrom: "2026-01-01",
        effectiveTo: "",
        status: "Active",
      };
    })
  );
  const scoped = useBranchScope(rows);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PriceRow | null>(null);

  const openNew = () => {
    setEditing({
      id: `pr_${Date.now()}`,
      productId: products[0]?.id ?? "",
      productName: products[0]?.model ?? "",
      branchId: branches[0]?.id ?? "",
      branchName: branches[0]?.name ?? "",
      onlinePrice: 0, offlinePrice: 0, dealerPrice: 0, distributorPrice: 0,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      status: "Active",
    });
    setOpen(true);
  };
  const openEdit = (r: PriceRow) => { setEditing(r); setOpen(true); };

  const save = () => {
    if (!editing) return;
    const product = products.find((p) => p.id === editing.productId);
    const branch = branches.find((b) => b.id === editing.branchId);
    const next: PriceRow = {
      ...editing,
      productName: product?.model ?? editing.productName,
      branchName: branch?.name ?? editing.branchName,
    };
    setRows((all) => {
      const idx = all.findIndex((x) => x.id === next.id);
      if (idx >= 0) { const copy = [...all]; copy[idx] = next; return copy; }
      return [next, ...all];
    });
    setOpen(false);
    toast.success("Price list saved.");
  };

  const del = (id: string) => {
    if (!window.confirm("Delete this price entry?")) return;
    setRows((all) => all.filter((x) => x.id !== id));
  };

  const cols: GridColumn<PriceRow>[] = [
    { accessorKey: "productName", header: "Product", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "branchName", header: "Branch" },
    { accessorKey: "onlinePrice", header: "Online", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "offlinePrice", header: "Offline", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "dealerPrice", header: "Dealer", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "distributorPrice", header: "Distributor", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "effectiveFrom", header: "From" },
    { accessorKey: "effectiveTo", header: "To", format: (v) => v || "—" },
    { accessorKey: "status", header: "Status", format: (v) => <Badge variant={v === "Active" ? "default" : "secondary"}>{v}</Badge> },
    { accessorKey: "id", header: "Actions", exportable: false, format: (_v, row) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(row)} title="Edit"><Pencil className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(row.id)} title="Delete"><Trash2 className="h-3 w-3" /></Button>
      </div>
    )},
  ];

  return (
    <>
      <DataGrid id="price-list" title="Price List"
        description="Branch-wise price book — Online, Offline, Dealer and Distributor rates with effective windows."
        data={scoped} columns={cols} dateField="effectiveFrom"
        toolbarExtra={
          <Button size="sm" onClick={openNew}><Plus className="mr-1.5 h-3.5 w-3.5" /> New Price</Button>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing && rows.find((r) => r.id === editing.id) ? "Edit Price" : "New Price"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="col-span-2">
                <Label>Product</Label>
                <Select value={editing.productId} onValueChange={(v) => setEditing({ ...editing, productId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.model}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Branch</Label>
                <Select value={editing.branchId} onValueChange={(v) => setEditing({ ...editing, branchId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Online Price</Label><Input type="number" value={editing.onlinePrice} onChange={(e) => setEditing({ ...editing, onlinePrice: +e.target.value })} /></div>
              <div><Label>Offline Price</Label><Input type="number" value={editing.offlinePrice} onChange={(e) => setEditing({ ...editing, offlinePrice: +e.target.value })} /></div>
              <div><Label>Dealer Price</Label><Input type="number" value={editing.dealerPrice} onChange={(e) => setEditing({ ...editing, dealerPrice: +e.target.value })} /></div>
              <div><Label>Distributor Price</Label><Input type="number" value={editing.distributorPrice} onChange={(e) => setEditing({ ...editing, distributorPrice: +e.target.value })} /></div>
              <div><Label>Effective From</Label><Input type="date" value={editing.effectiveFrom} onChange={(e) => setEditing({ ...editing, effectiveFrom: e.target.value })} /></div>
              <div><Label>Effective To</Label><Input type="date" value={editing.effectiveTo ?? ""} onChange={(e) => setEditing({ ...editing, effectiveTo: e.target.value })} /></div>
              <div className="col-span-2">
                <Label>Status</Label>
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as PriceRow["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
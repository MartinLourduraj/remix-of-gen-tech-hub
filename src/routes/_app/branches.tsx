import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Branch, BranchType } from "@/lib/types";

export const Route = createFileRoute("/_app/branches")({ component: BranchesPage });

const TYPES: BranchType[] = ["Head Office", "Branch Office", "Warehouse", "Service Center", "Dealer Office"];

function BranchesPage() {
  const { branches, companies, employees, add, update, remove, logAudit } = useData();
  const coMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));
  const emMap = Object.fromEntries(employees.map((e) => [e.id, e.name]));

  const empty = (): Branch => ({
    id: `br_${Date.now()}`, code: "", name: "", companyId: companies[0]?.id ?? "",
    gstin: "", address: "", state: "Tamil Nadu", district: "", pincode: "",
    mobile: "", email: "", type: "Branch Office", active: true,
  });

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Branch | null>(null);
  const openNew = () => { setEditing(empty()); setOpen(true); };
  const openEdit = (b: Branch) => { setEditing({ ...b }); setOpen(true); };

  const save = () => {
    if (!editing) return;
    if (!editing.code || !editing.name) { toast.error("Code and Name are required."); return; }
    const exists = branches.find((b) => b.id === editing.id);
    if (exists) {
      update("branches", editing.id, editing);
      logAudit({ user: "current", entity: "Branch", entityId: editing.code, action: "Edited" });
      toast.success("Branch updated");
    } else {
      add("branches", editing);
      logAudit({ user: "current", entity: "Branch", entityId: editing.code, action: "Created" });
      toast.success("Branch created");
    }
    setOpen(false);
  };

  const del = (b: Branch) => {
    if (!window.confirm(`Delete ${b.name}?`)) return;
    remove("branches", b.id);
    logAudit({ user: "current", entity: "Branch", entityId: b.code, action: "Deleted" });
    toast.success(`Deleted ${b.name}`);
  };

  const rows = branches.map((b) => ({ ...b, companyName: coMap[b.companyId] ?? "", managerName: emMap[b.managerEmpId ?? ""] ?? "—" }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "code", header: "Code", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "name", header: "Branch", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "companyName", header: "Company" },
    { accessorKey: "type", header: "Type", format: (v) => <Badge variant="outline">{v}</Badge> },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "pincode", header: "Pincode" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "active", header: "Status", format: (v) => <Badge variant={v ? "default" : "secondary"}>{v ? "Active" : "Inactive"}</Badge> },
    { accessorKey: "id", header: "Actions", exportable: false, format: (_v, row) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(row)}><Pencil className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(row)}><Trash2 className="h-3 w-3" /></Button>
      </div>
    )},
  ];

  return (
    <>
      <DataGrid id="branches" title="Branches"
        description="Head office, branches, warehouses, service centers and dealer offices grouped by company."
        data={rows} columns={cols}
        toolbarExtra={<Button size="sm" onClick={openNew}><Plus className="mr-1.5 h-3.5 w-3.5" /> New Branch</Button>}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing && branches.find((b) => b.id === editing.id) ? "Edit Branch" : "New Branch"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3 py-2">
              <F label="Code"><Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></F>
              <F label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
              <F label="Company" full>
                <Select value={editing.companyId} onValueChange={(v) => setEditing({ ...editing, companyId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Type">
                <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v as BranchType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="GSTIN"><Input value={editing.gstin} onChange={(e) => setEditing({ ...editing, gstin: e.target.value })} /></F>
              <F label="Address" full><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></F>
              <F label="District"><Input value={editing.district} onChange={(e) => setEditing({ ...editing, district: e.target.value })} /></F>
              <F label="State"><Input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} /></F>
              <F label="Pincode"><Input value={editing.pincode} onChange={(e) => setEditing({ ...editing, pincode: e.target.value })} /></F>
              <F label="Mobile"><Input value={editing.mobile} onChange={(e) => setEditing({ ...editing, mobile: e.target.value })} /></F>
              <F label="Email" full><Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></F>
              <F label="Manager" full>
                <Select value={editing.managerEmpId ?? ""} onValueChange={(v) => setEditing({ ...editing, managerEmpId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
                  <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Active" full>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                  Branch is active
                </label>
              </F>
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

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><Label className="text-xs">{label}</Label>{children}</div>;
}

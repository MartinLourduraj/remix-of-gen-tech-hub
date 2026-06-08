import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/lib/types";

export const Route = createFileRoute("/_app/companies")({ component: CompaniesPage });

const empty = (): Company => ({
  id: `co_${Date.now()}`, code: "", name: "", legalName: "",
  gstin: "", pan: "", address1: "", city: "", district: "",
  state: "Tamil Nadu", country: "India", pincode: "",
  mobile: "", email: "", active: true,
});

function CompaniesPage() {
  const { companies, add, update, remove, logAudit } = useData();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Company | null>(null);

  const openNew = () => { setEditing(empty()); setOpen(true); };
  const openEdit = (c: Company) => { setEditing({ ...c }); setOpen(true); };

  const save = () => {
    if (!editing) return;
    if (!editing.code || !editing.name) { toast.error("Code and Name are required."); return; }
    const exists = companies.find((c) => c.id === editing.id);
    if (exists) {
      update("companies", editing.id, editing);
      logAudit({ user: "current", entity: "Company", entityId: editing.code, action: "Edited" });
      toast.success("Company updated");
    } else {
      add("companies", editing);
      logAudit({ user: "current", entity: "Company", entityId: editing.code, action: "Created" });
      toast.success("Company created");
    }
    setOpen(false);
  };

  const del = (c: Company) => {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    remove("companies", c.id);
    logAudit({ user: "current", entity: "Company", entityId: c.code, action: "Deleted" });
    toast.success(`Deleted ${c.name}`);
  };

  const cols: GridColumn<Company>[] = [
    { accessorKey: "code", header: "Code", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "name", header: "Name", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "legalName", header: "Legal Name" },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "pan", header: "PAN" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "state", header: "State" },
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
      <DataGrid id="companies" title="Companies"
        description="Master list of legal entities — GSTIN, PAN, registered address, contacts, branding."
        data={companies} columns={cols}
        toolbarExtra={<Button size="sm" onClick={openNew}><Plus className="mr-1.5 h-3.5 w-3.5" /> New Company</Button>}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing && companies.find((c) => c.id === editing.id) ? "Edit Company" : "New Company"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-3 py-2">
              <F label="Code"><Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></F>
              <F label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
              <F label="Legal Name" full><Input value={editing.legalName} onChange={(e) => setEditing({ ...editing, legalName: e.target.value })} /></F>
              <F label="GSTIN"><Input value={editing.gstin} onChange={(e) => setEditing({ ...editing, gstin: e.target.value })} /></F>
              <F label="PAN"><Input value={editing.pan} onChange={(e) => setEditing({ ...editing, pan: e.target.value })} /></F>
              <F label="CIN"><Input value={editing.cin ?? ""} onChange={(e) => setEditing({ ...editing, cin: e.target.value })} /></F>
              <F label="Website"><Input value={editing.website ?? ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} /></F>
              <F label="Address 1" full><Input value={editing.address1} onChange={(e) => setEditing({ ...editing, address1: e.target.value })} /></F>
              <F label="Address 2" full><Input value={editing.address2 ?? ""} onChange={(e) => setEditing({ ...editing, address2: e.target.value })} /></F>
              <F label="City"><Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></F>
              <F label="District"><Input value={editing.district} onChange={(e) => setEditing({ ...editing, district: e.target.value })} /></F>
              <F label="State"><Input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} /></F>
              <F label="Pincode"><Input value={editing.pincode} onChange={(e) => setEditing({ ...editing, pincode: e.target.value })} /></F>
              <F label="Mobile"><Input value={editing.mobile} onChange={(e) => setEditing({ ...editing, mobile: e.target.value })} /></F>
              <F label="Email"><Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></F>
              <F label="Active" full>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                  Company is active
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

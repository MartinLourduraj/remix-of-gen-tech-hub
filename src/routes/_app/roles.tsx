import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/roles")({ component: RolesPage });

const DEFAULT_ROLES = [
  "Super Admin","Admin","Accounts","Sales","Service","Store","Dealer",
];
const MODULES = [
  "Dashboard","Companies","Branches","Customers","Products","Price List","Vendors",
  "Employees","Estimates","Quotations","Sales Orders","Invoices","Credit Notes",
  "Debit Notes","Inventory","Warranty","Service","Reports","GST","Audit Log",
  "Roles & Access","Settings",
];
const PERMS = ["View","Create","Edit","Delete","Approve","Export","Print","Import"] as const;
type Perm = (typeof PERMS)[number];

type Matrix = Record<string, Record<string, Record<Perm, boolean>>>;

function seedMatrix(roles: string[]): Matrix {
  const m: Matrix = {};
  for (const r of roles) {
    m[r] = {};
    for (const mod of MODULES) {
      const all = r === "Super Admin";
      const admin = r === "Admin";
      m[r][mod] = PERMS.reduce((acc, p) => {
        let v = false;
        if (all) v = true;
        else if (admin) v = p !== "Delete" || mod !== "Audit Log";
        else if (r === "Accounts") v = ["Dashboard","Invoices","Credit Notes","Debit Notes","Customers","Reports","GST"].includes(mod) && ["View","Create","Edit","Export","Print"].includes(p);
        else if (r === "Sales") v = ["Dashboard","Customers","Products","Estimates","Quotations","Sales Orders","Invoices","Reports"].includes(mod) && p !== "Delete";
        else if (r === "Service") v = ["Dashboard","Service","Warranty","Customers","Products","Reports"].includes(mod) && ["View","Create","Edit","Print"].includes(p);
        else if (r === "Store") v = ["Dashboard","Products","Inventory","Vendors","Reports"].includes(mod) && p !== "Delete";
        else if (r === "Dealer") v = ["Dashboard","Products","Price List","Estimates","Quotations"].includes(mod) && ["View","Create","Print"].includes(p);
        acc[p] = v;
        return acc;
      }, {} as Record<Perm, boolean>);
    }
  }
  return m;
}

function RolesPage() {
  const [roles, setRoles] = React.useState<string[]>(DEFAULT_ROLES);
  const [active, setActive] = React.useState<string>(DEFAULT_ROLES[0]);
  const [matrix, setMatrix] = React.useState<Matrix>(() => seedMatrix(DEFAULT_ROLES));

  const toggle = (mod: string, p: Perm) =>
    setMatrix((m) => ({
      ...m,
      [active]: { ...m[active], [mod]: { ...m[active][mod], [p]: !m[active][mod][p] } },
    }));

  const setRow = (mod: string, value: boolean) =>
    setMatrix((m) => ({
      ...m,
      [active]: { ...m[active], [mod]: PERMS.reduce((a, p) => ({ ...a, [p]: value }), {} as Record<Perm, boolean>) },
    }));

  const setCol = (p: Perm, value: boolean) =>
    setMatrix((m) => ({
      ...m,
      [active]: Object.fromEntries(
        MODULES.map((mod) => [mod, { ...m[active][mod], [p]: value }])
      ) as Matrix[string],
    }));

  const setAll = (value: boolean) =>
    setMatrix((m) => ({
      ...m,
      [active]: Object.fromEntries(
        MODULES.map((mod) => [mod, PERMS.reduce((a, p) => ({ ...a, [p]: value }), {} as Record<Perm, boolean>)])
      ) as Matrix[string],
    }));

  const addRole = () => {
    const name = window.prompt("New role name?");
    if (!name || roles.includes(name)) return;
    setRoles((r) => [...r, name]);
    setMatrix((m) => ({ ...m, [name]: seedMatrix([name])[name] }));
    setActive(name);
  };

  const cloneRole = () => {
    const name = window.prompt(`Clone "${active}" as:`);
    if (!name || roles.includes(name)) return;
    setRoles((r) => [...r, name]);
    setMatrix((m) => ({ ...m, [name]: JSON.parse(JSON.stringify(m[active])) }));
    setActive(name);
  };

  const deleteRole = () => {
    if (DEFAULT_ROLES.includes(active)) { toast.error("System role cannot be deleted."); return; }
    if (!window.confirm(`Delete role "${active}"?`)) return;
    setRoles((r) => r.filter((x) => x !== active));
    setMatrix((m) => { const { [active]: _, ...rest } = m; return rest; });
    setActive(DEFAULT_ROLES[0]);
  };

  const save = () => {
    localStorage.setItem("gentech_role_matrix", JSON.stringify(matrix));
    toast.success(`Permissions saved for ${roles.length} roles.`);
  };

  return (
    <div>
      <PageHeader title="Roles & Access Control"
        description="Stateful permission matrix. Click any checkbox to toggle. Select All / Remove All works per row, per column or globally."
      />

      <Card className="mb-4 p-3 flex flex-wrap items-center gap-2">
        {roles.map((r) => (
          <button key={r} onClick={() => setActive(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              active === r
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted"
            }`}>
            {r}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={addRole}><Plus className="mr-1 h-3.5 w-3.5" /> New Role</Button>
          <Button size="sm" variant="outline" onClick={cloneRole}><Copy className="mr-1 h-3.5 w-3.5" /> Clone</Button>
          <Button size="sm" variant="outline" onClick={deleteRole} className="text-destructive"><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</Button>
          <Button size="sm" onClick={save}><Save className="mr-1 h-3.5 w-3.5" /> Save</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b p-3 bg-muted/30">
          <Badge variant="secondary">Editing: {active}</Badge>
          <span className="text-xs text-muted-foreground ml-2">Quick actions:</span>
          <Button size="sm" variant="outline" onClick={() => setAll(true)}>Select All</Button>
          <Button size="sm" variant="outline" onClick={() => setAll(false)}>Remove All</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background min-w-[180px]">Module</TableHead>
                {PERMS.map((p) => (
                  <TableHead key={p} className="text-center">
                    <div>{p}</div>
                    <div className="mt-1 flex justify-center gap-1">
                      <button onClick={() => setCol(p, true)} className="text-[9px] text-primary hover:underline">all</button>
                      <span className="text-[9px] text-muted-foreground">/</span>
                      <button onClick={() => setCol(p, false)} className="text-[9px] text-muted-foreground hover:underline">none</button>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center">Row</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULES.map((m) => (
                <TableRow key={m}>
                  <TableCell className="sticky left-0 bg-background font-medium">{m}</TableCell>
                  {PERMS.map((p) => (
                    <TableCell key={p} className="text-center">
                      <Checkbox checked={!!matrix[active]?.[m]?.[p]}
                        onCheckedChange={() => toggle(m, p)} />
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => setRow(m, true)} className="text-[10px] text-primary hover:underline">all</button>
                      <span className="text-[10px] text-muted-foreground">/</span>
                      <button onClick={() => setRow(m, false)} className="text-[10px] text-muted-foreground hover:underline">none</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-3 text-xs text-muted-foreground border-t">
          {MODULES.length} modules × {PERMS.length} permissions × {roles.length} roles · Click <b>Save</b> to persist changes.
        </div>
      </Card>
    </div>
  );
}
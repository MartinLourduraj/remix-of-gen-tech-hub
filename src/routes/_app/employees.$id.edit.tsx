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
import type { Role } from "@/lib/types";

const ROLES: Role[] = ["Super Admin","Admin","Accounts Manager","Sales Manager","Sales Executive","Service Manager","Service Engineer","Inventory Manager","Branch Manager","Dealer","Customer"];

export const Route = createFileRoute("/_app/employees/$id/edit")({ component: EditEmployeePage });

function EditEmployeePage() {
  const { id } = useParams({ from: "/_app/employees/$id/edit" });
  const { employees, branches, departments, designations, update, remove, logAudit } = useData();
  const cur = employees.find((e) => e.id === id);
  const nav = useNavigate();
  const [f, setF] = React.useState(cur);
  React.useEffect(() => { setF(cur); }, [cur?.id]);
  if (!cur || !f) return <div className="p-6 text-sm">Not found. <Link to="/employees" className="underline">Back</Link></div>;
  const set = (k: any, v: any) => setF({ ...f, [k]: v });
  const save = (exit: boolean) => {
    update("employees", cur.id, f);
    logAudit({ user: "current", entity: "Employee", entityId: cur.empId, action: "Edited" });
    toast.success("Employee updated");
    if (exit) nav({ to: "/employees" });
  };
  const del = () => {
    if (!confirm("Delete employee?")) return;
    remove("employees", cur.id);
    logAudit({ user: "current", entity: "Employee", entityId: cur.empId, action: "Deleted" });
    nav({ to: "/employees" });
  };
  return (
    <div>
      <PageHeader title={`Edit · ${cur.empId}`} description={cur.name}>
        <Button size="sm" variant="outline" asChild><Link to="/employees"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="destructive" onClick={del}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <Card className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Fl label="Name"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Fl>
        <Fl label="Mobile"><Input value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></Fl>
        <Fl label="Email"><Input value={f.email} onChange={(e) => set("email", e.target.value)} /></Fl>
        <Fl label="Branch">
          <Select value={f.branchId} onValueChange={(v) => { const br = branches.find((b) => b.id === v); set("branchId", v); set("branch", br?.name ?? ""); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
        </Fl>
        <Fl label="Department">
          <Select value={f.department} onValueChange={(v) => set("department", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
        </Fl>
        <Fl label="Designation">
          <Select value={f.designation} onValueChange={(v) => set("designation", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{designations.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
        </Fl>
        <Fl label="Joining Date"><Input type="date" value={f.joiningDate} onChange={(e) => set("joiningDate", e.target.value)} /></Fl>
        <Fl label="Login Start"><Input type="time" value={f.loginStart ?? "09:00"} onChange={(e) => set("loginStart", e.target.value)} /></Fl>
        <Fl label="Login End"><Input type="time" value={f.loginEnd ?? "18:00"} onChange={(e) => set("loginEnd", e.target.value)} /></Fl>
        <Fl label="Role">
          <Select value={(f.role as string) ?? ""} onValueChange={(v) => set("role", v as Role)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </Fl>
        <Fl label="Status">
          <Select value={f.status ?? "Active"} onValueChange={(v) => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Active","Inactive","Locked"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </Fl>
        <Fl label="Branch Access">
          <Select value={f.branchAccess ?? "ALL"} onValueChange={(v) => set("branchAccess", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Branches (HQ user)</SelectItem>
              {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Fl>
        <Fl label="Current Salary (₹)"><Input type="number" value={f.currentSalary ?? 0} onChange={(e) => set("currentSalary", +e.target.value as any)} /></Fl>
      </Card>
    </div>
  );
}

function Fl({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
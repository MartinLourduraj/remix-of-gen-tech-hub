import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Printer, Lock, Unlock, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/employees")({ component: EmployeesPage });

function EmployeesPage() {
  const { employees, update, remove, logAudit } = useData();
  const [q, setQ] = React.useState("");
  const nav = useNavigate();
  const filtered = employees.filter((e) => [e.name, e.empId, e.email, e.mobile, e.department].join(" ").toLowerCase().includes(q.toLowerCase()));
  const del = (id: string, empId: string) => { if (!confirm(`Delete ${empId}?`)) return; remove("employees", id); logAudit({ user: "current", entity: "Employee", entityId: empId, action: "Deleted" }); toast.success(`Deleted ${empId}`); };
  const setStatus = (id: string, empId: string, status: "Active" | "Inactive" | "Locked") => {
    update("employees", id, { status } as any);
    logAudit({ user: "current", entity: "Employee", entityId: empId, action: `Status: ${status}` });
    toast.success(`${empId} → ${status}`);
  };
  const resetPwd = (empId: string) => { logAudit({ user: "current", entity: "Employee", entityId: empId, action: "Password Reset" }); toast.success(`Password reset for ${empId}`); };
  return (
    <div>
      <PageHeader title="Employees" description="Workforce across sales, service, accounts and warehouse.">
        <Input placeholder="Search employee..." value={q} onChange={(e) => setQ(e.target.value)} className="h-9 w-64" />
        <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        <Button size="sm" asChild><Link to="/employees/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add New</Link></Button>
      </PageHeader>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emp ID</TableHead><TableHead>Name</TableHead><TableHead>Designation</TableHead>
              <TableHead>Department</TableHead><TableHead>Branch</TableHead><TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-xs">{e.empId}</TableCell>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell>{e.designation}</TableCell>
                <TableCell><Badge variant="secondary">{e.department}</Badge></TableCell>
                <TableCell>{e.branch}</TableCell>
                <TableCell>{e.mobile}</TableCell>
                <TableCell className="text-muted-foreground">{e.email}</TableCell>
                <TableCell>
                  <Badge variant={e.status === "Locked" ? "destructive" : e.status === "Inactive" ? "secondary" : "default"}>
                    {e.status ?? "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit" onClick={() => nav({ to: "/employees/$id/edit", params: { id: e.id } })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Reset Password" onClick={() => resetPwd(e.empId)}><RotateCcw className="h-3.5 w-3.5" /></Button>
                    {e.status === "Locked"
                      ? <Button size="icon" variant="ghost" className="h-7 w-7" title="Unlock" onClick={() => setStatus(e.id, e.empId, "Active")}><Unlock className="h-3.5 w-3.5" /></Button>
                      : <Button size="icon" variant="ghost" className="h-7 w-7" title="Lock" onClick={() => setStatus(e.id, e.empId, "Locked")}><Lock className="h-3.5 w-3.5" /></Button>}
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" title="Delete" onClick={() => del(e.id, e.empId)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
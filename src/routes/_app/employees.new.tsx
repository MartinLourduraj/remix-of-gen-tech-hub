import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import type { Employee, Role } from "@/lib/types";

const ROLES: Role[] = ["Super Admin","Admin","Accounts Manager","Sales Manager","Sales Executive","Service Manager","Service Engineer","Inventory Manager","Branch Manager","Dealer","Customer"];

function calcAge(dob: string) { if (!dob) return ""; const d = new Date(dob); if (isNaN(d.getTime())) return ""; const diff = Date.now() - d.getTime(); return String(Math.floor(diff / (365.25 * 24 * 3600 * 1000))); }

export const Route = createFileRoute("/_app/employees/new")({ component: NewEmployeePage });

function NewEmployeePage() {
  const { employees, branches, departments, designations, add, logAudit } = useData();
  const nav = useNavigate();
  const [f, setF] = React.useState<Partial<Employee> & { password?: string; confirmPassword?: string }>({
    firstName: "", lastName: "", gender: "Male", dob: "",
    mobile: "", altMobile: "", email: "",
    address1: "", address2: "", city: "", district: "", state: "Tamil Nadu", pincode: "",
    department: "", designation: "", branch: branches[0]?.name ?? "", branchId: branches[0]?.id,
    employeeType: "Permanent", joiningDate: new Date().toISOString().slice(0,10), reportingManager: "",
    userId: "", password: "", confirmPassword: "",
    loginStart: "09:00", loginEnd: "18:00",
    role: "Sales Executive", status: "Active",
    branchAccess: "ALL", currentSalary: 0,
  });

  const set = (k: any, v: any) => setF({ ...f, [k]: v });
  const age = calcAge(f.dob ?? "");
  const save = (exit: boolean) => {
    if (!f.firstName || !f.mobile || !f.userId) { toast.error("First name, mobile, user ID are required"); return; }
    if ((f.password ?? "").length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (f.password !== f.confirmPassword) { toast.error("Passwords do not match"); return; }
    const empId = `EMP-${String(employees.length + 1).padStart(3, "0")}`;
    const name = `${f.firstName} ${f.lastName ?? ""}`.trim();
    const e: Employee = {
      id: `e${Date.now()}`, empId, name,
      designation: f.designation ?? "", department: f.department ?? "", branch: f.branch ?? "",
      mobile: f.mobile!, email: f.email ?? "", joiningDate: f.joiningDate ?? "",
      branchId: f.branchId,
      firstName: f.firstName, lastName: f.lastName, gender: f.gender, dob: f.dob,
      altMobile: f.altMobile, address1: f.address1, address2: f.address2,
      city: f.city, district: f.district, state: f.state, pincode: f.pincode,
      employeeType: f.employeeType, reportingManager: f.reportingManager,
      userId: f.userId, passwordHash: btoa(f.password ?? ""),
      loginStart: f.loginStart, loginEnd: f.loginEnd, role: f.role, status: f.status,
      branchAccess: f.branchAccess ?? "ALL", currentSalary: Number(f.currentSalary ?? 0),
    };

    add("employees", e);
    logAudit({ user: "current", entity: "Employee", entityId: empId, action: "Created", newValue: name });
    toast.success(`Employee ${empId} created`);
    if (exit) nav({ to: "/employees" });
  };
  return (
    <div>
      <PageHeader title="New Employee" description="Personal, official, login and access details">
        <Button size="sm" variant="outline" asChild><Link to="/employees"><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Link></Button>
        <Button size="sm" variant="outline" onClick={() => save(false)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        <Button size="sm" onClick={() => save(true)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save & Exit</Button>
      </PageHeader>
      <div className="space-y-4">
        <Section title="Personal Information">
          <Fl label="First Name *"><Input value={f.firstName ?? ""} onChange={(e) => set("firstName", e.target.value)} /></Fl>
          <Fl label="Last Name"><Input value={f.lastName ?? ""} onChange={(e) => set("lastName", e.target.value)} /></Fl>
          <Fl label="Gender">
            <Select value={f.gender} onValueChange={(v) => set("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Male","Female","Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </Fl>
          <Fl label="Date of Birth"><Input type="date" value={f.dob ?? ""} onChange={(e) => set("dob", e.target.value)} /></Fl>
          <Fl label="Age (auto)"><Input value={age} disabled /></Fl>
        </Section>
        <Section title="Contact Information">
          <Fl label="Mobile *"><Input value={f.mobile ?? ""} onChange={(e) => set("mobile", e.target.value)} /></Fl>
          <Fl label="Alternate Mobile"><Input value={f.altMobile ?? ""} onChange={(e) => set("altMobile", e.target.value)} /></Fl>
          <Fl label="Email"><Input type="email" value={f.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Fl>
          <Fl label="Address Line 1"><Input value={f.address1 ?? ""} onChange={(e) => set("address1", e.target.value)} /></Fl>
          <Fl label="Address Line 2"><Input value={f.address2 ?? ""} onChange={(e) => set("address2", e.target.value)} /></Fl>
          <Fl label="City"><Input value={f.city ?? ""} onChange={(e) => set("city", e.target.value)} /></Fl>
          <Fl label="District"><Input value={f.district ?? ""} onChange={(e) => set("district", e.target.value)} /></Fl>
          <Fl label="State"><Input value={f.state ?? ""} onChange={(e) => set("state", e.target.value)} /></Fl>
          <Fl label="Pincode"><Input value={f.pincode ?? ""} onChange={(e) => set("pincode", e.target.value)} /></Fl>
        </Section>
        <Section title="Official Information">
          <Fl label="Branch">
            <Select value={f.branchId} onValueChange={(v) => { const br = branches.find((b) => b.id === v); set("branchId", v); set("branch", br?.name ?? ""); }}>
              <SelectTrigger><SelectValue placeholder="Branch" /></SelectTrigger>
              <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </Fl>
          <Fl label="Department">
            <Select value={f.department} onValueChange={(v) => set("department", v)}>
              <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
          </Fl>
          <Fl label="Designation">
            <Select value={f.designation} onValueChange={(v) => set("designation", v)}>
              <SelectTrigger><SelectValue placeholder="Designation" /></SelectTrigger>
              <SelectContent>{designations.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
          </Fl>
          <Fl label="Employee Type">
            <Select value={f.employeeType} onValueChange={(v) => set("employeeType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Permanent","Contract","Intern","Consultant"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </Fl>
          <Fl label="Joining Date"><Input type="date" value={f.joiningDate ?? ""} onChange={(e) => set("joiningDate", e.target.value)} /></Fl>
          <Fl label="Reporting Manager"><Input value={f.reportingManager ?? ""} onChange={(e) => set("reportingManager", e.target.value)} /></Fl>
        </Section>
        <Section title="Login Information">
          <Fl label="User ID *"><Input value={f.userId ?? ""} onChange={(e) => set("userId", e.target.value)} /></Fl>
          <Fl label="Password *"><Input type="password" value={f.password ?? ""} onChange={(e) => set("password", e.target.value)} /></Fl>
          <Fl label="Confirm Password *"><Input type="password" value={f.confirmPassword ?? ""} onChange={(e) => set("confirmPassword", e.target.value)} /></Fl>
        </Section>
        <Section title="Working Hours (login window)">
          <Fl label="Login Start"><Input type="time" value={f.loginStart ?? "09:00"} onChange={(e) => set("loginStart", e.target.value)} /></Fl>
          <Fl label="Login End"><Input type="time" value={f.loginEnd ?? "18:00"} onChange={(e) => set("loginEnd", e.target.value)} /></Fl>
          <p className="md:col-span-3 text-xs text-muted-foreground">System will block login outside this window. Use 00:00 → 23:59 for 24×7 access.</p>
        </Section>
        <Section title="Profile & Role Assignment">
          <Fl label="Role / Profile">
            <Select value={f.role} onValueChange={(v) => set("role", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
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
          <Fl label="Status">
            <Select value={f.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Active","Inactive","Locked"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Fl>
          <Fl label="Current Salary (₹)"><Input type="number" value={f.currentSalary ?? 0} onChange={(e) => set("currentSalary", +e.target.value)} /></Fl>
          <p className="md:col-span-3 text-xs text-muted-foreground">
            Branch Access controls login routing. <b>All Branches</b> users will see the branch picker after login. Specific-branch users go straight to the dashboard for their branch.
          </p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </Card>
  );
}
function Fl({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
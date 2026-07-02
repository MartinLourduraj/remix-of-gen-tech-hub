import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Check, X, Printer, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Promotion, PromotionApproval, PromotionStatus } from "@/lib/types";

export const Route = createFileRoute("/_app/promotions")({ component: PromotionsPage });

const TYPES = ["Regular","Merit","Performance","Special","Transfer","Temporary"] as const;
const APPROVAL_LEVELS: { level: 1|2|3|4; role: PromotionApproval["role"] }[] = [
  { level: 1, role: "Reporting Manager" },
  { level: 2, role: "Department Head" },
  { level: 3, role: "HR Manager" },
  { level: 4, role: "Managing Director" },
];

function nextStatusAfterApproval(level: 1|2|3|4): PromotionStatus {
  if (level === 1) return "Pending L2";
  if (level === 2) return "Pending L3";
  if (level === 3) return "Pending L4";
  return "Approved";
}

function PromotionsPage() {
  const { promotions, employees, branches, departments, designations, add, update, logAudit } = useData();
  const { user } = useAuth();
  const [newOpen, setNewOpen] = React.useState(false);
  const [viewing, setViewing] = React.useState<Promotion | null>(null);
  const [letterFor, setLetterFor] = React.useState<Promotion | null>(null);

  const monthCount = promotions.filter((p) => p.createdAt.startsWith(new Date().toISOString().slice(0, 7))).length;
  const pendingCount = promotions.filter((p) => p.status.startsWith("Pending")).length;
  const totalIncrease = promotions
    .filter((p) => p.status === "Approved" || p.status === "Applied")
    .reduce((a, p) => a + (p.revisedSalary - p.currentSalary), 0);

  const approve = (p: Promotion, level: 1|2|3|4, decision: "Approved" | "Rejected", remarks?: string) => {
    const approvals: PromotionApproval[] = p.approvals.map((a) =>
      a.level === level ? { ...a, decision, at: new Date().toISOString().slice(0, 16).replace("T", " "), approver: user?.name ?? "Current User", remarks } : a
    );
    let status: PromotionStatus = p.status;
    if (decision === "Rejected") status = "Rejected";
    else status = nextStatusAfterApproval(level);
    update("promotions", p.id, { approvals, status });
    logAudit({ user: user?.name ?? "current", entity: "Promotion", entityId: p.number, action: `${decision} L${level}` });
    toast.success(`Level ${level} ${decision.toLowerCase()}`);
    setViewing({ ...p, approvals, status });

    // Auto-apply on final approval
    if (status === "Approved") {
      setTimeout(() => applyPromotion({ ...p, approvals, status }), 100);
    }
  };

  const applyPromotion = (p: Promotion) => {
    const emp = employees.find((e) => e.id === p.employeeId);
    if (emp) {
      update("employees", emp.id, {
        designation: p.promotedDesignation,
        department: p.promotedDepartment,
        branch: p.promotedBranch,
        branchId: p.promotedBranchId,
        currentSalary: p.revisedSalary,
      } as any);
    }
    update("promotions", p.id, { status: "Applied", appliedAt: new Date().toISOString().slice(0, 16).replace("T", " ") });
    logAudit({ user: user?.name ?? "current", entity: "Promotion", entityId: p.number, action: "Applied to Employee",
      oldValue: `${p.currentDesignation} · ${inr(p.currentSalary)}`, newValue: `${p.promotedDesignation} · ${inr(p.revisedSalary)}` });
    toast.success(`${p.empName} record updated`);
  };

  return (
    <div>
      <PageHeader title="Promotion Management" description="Request, approve, and apply employee promotions across the organization.">
        <Button size="sm" onClick={() => setNewOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> New Promotion</Button>
      </PageHeader>

      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <StatCard label="This Month" value={String(monthCount)} icon={TrendingUp} />
        <StatCard label="Pending Approvals" value={String(pendingCount)} />
        <StatCard label="Total Salary Increase" value={inr(totalIncrease)} />
        <StatCard label="Total Promotions" value={String(promotions.length)} />
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotion #</TableHead><TableHead>Employee</TableHead>
              <TableHead>From</TableHead><TableHead>To</TableHead>
              <TableHead className="text-right">Salary Change</TableHead>
              <TableHead>Effective</TableHead><TableHead>Type</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.number}</TableCell>
                <TableCell className="font-medium">{p.empName}</TableCell>
                <TableCell className="text-xs">{p.currentDesignation} · {p.currentBranch}</TableCell>
                <TableCell className="text-xs">{p.promotedDesignation} · {p.promotedBranch}</TableCell>
                <TableCell className="text-right text-xs">
                  <div className="text-muted-foreground line-through">{inr(p.currentSalary)}</div>
                  <div className="font-semibold text-green-700">{inr(p.revisedSalary)}</div>
                </TableCell>
                <TableCell>{p.effectiveDate}</TableCell>
                <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                <TableCell>
                  <Badge variant={p.status === "Rejected" ? "destructive" : p.status === "Applied" ? "default" : "secondary"}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setViewing(p)}><Eye className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setLetterFor(p)} title="Promotion Letter"><Printer className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {promotions.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-10">No promotions yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {newOpen && (
        <NewPromotionDialog
          onClose={() => setNewOpen(false)}
          onCreate={(p: Promotion) => {
            add("promotions", p);
            logAudit({ user: user?.name ?? "current", entity: "Promotion", entityId: p.number, action: "Created", newValue: p.empName });
            toast.success(`Promotion ${p.number} created`);
            setNewOpen(false);
          }}
          employees={employees} branches={branches} departments={departments} designations={designations}
          nextNumber={`PROMO-${new Date().getFullYear()}-${String(promotions.length + 1).padStart(4, "0")}`}
          currentUser={user?.name ?? "Current User"}
        />
      )}

      {viewing && (
        <Dialog open onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>{viewing.number} · {viewing.empName}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1"><div className="text-xs text-muted-foreground uppercase">From</div>
                <div className="font-medium">{viewing.currentDesignation}</div>
                <div className="text-xs">{viewing.currentDepartment} · {viewing.currentBranch}</div>
                <div className="text-xs font-mono">{inr(viewing.currentSalary)}</div>
              </div>
              <div className="space-y-1"><div className="text-xs text-muted-foreground uppercase">To</div>
                <div className="font-medium">{viewing.promotedDesignation}</div>
                <div className="text-xs">{viewing.promotedDepartment} · {viewing.promotedBranch}</div>
                <div className="text-xs font-mono text-green-700">{inr(viewing.revisedSalary)}</div>
              </div>
              <div className="col-span-2"><div className="text-xs text-muted-foreground uppercase">Reason</div><div>{viewing.reason}</div></div>
            </div>
            <div className="border-t pt-3 mt-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Approval Workflow</div>
              <div className="space-y-2">
                {viewing.approvals.map((a) => {
                  const isCurrent = viewing.status === `Pending L${a.level}` as PromotionStatus;
                  return (
                    <div key={a.level} className="flex items-center justify-between rounded-md border p-2">
                      <div className="text-sm">
                        <div className="font-medium">Level {a.level} — {a.role}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.decision ? `${a.decision} by ${a.approver ?? "—"} on ${a.at}` : isCurrent ? "Awaiting decision" : "Pending earlier approvals"}
                        </div>
                        {a.remarks && <div className="text-xs italic">"{a.remarks}"</div>}
                      </div>
                      {isCurrent && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7" onClick={() => approve(viewing, a.level, "Approved")}><Check className="h-3.5 w-3.5 mr-1" />Approve</Button>
                          <Button size="sm" variant="destructive" className="h-7" onClick={() => approve(viewing, a.level, "Rejected")}><X className="h-3.5 w-3.5 mr-1" />Reject</Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLetterFor(viewing)}><Printer className="h-3.5 w-3.5 mr-1.5" /> Promotion Letter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {letterFor && <PromotionLetter promo={letterFor} onClose={() => setLetterFor(null)} />}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1 flex items-center gap-2">{Icon && <Icon className="h-5 w-5 text-[var(--brand-orange)]" />}{value}</div>
    </Card>
  );
}

function NewPromotionDialog({ onClose, onCreate, employees, branches, departments, designations, nextNumber, currentUser }: any) {
  const [empId, setEmpId] = React.useState(employees[0]?.id ?? "");
  const emp = employees.find((e: any) => e.id === empId);
  const [promotedBranchId, setPromotedBranchId] = React.useState(emp?.branchId ?? branches[0]?.id);
  const [promotedDepartment, setPromotedDepartment] = React.useState(emp?.department ?? "");
  const [promotedDesignation, setPromotedDesignation] = React.useState(emp?.designation ?? "");
  const [revisedSalary, setRevisedSalary] = React.useState(emp?.currentSalary ? Math.round(emp.currentSalary * 1.15) : 0);
  const [effectiveDate, setEffectiveDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = React.useState<typeof TYPES[number]>("Merit");
  const [reason, setReason] = React.useState("");
  const [remarks, setRemarks] = React.useState("");

  React.useEffect(() => {
    if (!emp) return;
    setPromotedBranchId(emp.branchId ?? branches[0]?.id);
    setPromotedDepartment(emp.department ?? "");
    setPromotedDesignation(emp.designation ?? "");
    setRevisedSalary(emp.currentSalary ? Math.round(emp.currentSalary * 1.15) : 0);
  }, [empId]);

  const create = () => {
    if (!emp) return toast.error("Pick an employee");
    if (!reason.trim()) return toast.error("Reason is required");
    const promoBranch = branches.find((b: any) => b.id === promotedBranchId);
    const p: Promotion = {
      id: `pr_${Date.now()}`, number: nextNumber, employeeId: emp.id, empName: emp.name,
      currentBranchId: emp.branchId ?? "", currentBranch: emp.branch ?? "",
      currentDepartment: emp.department ?? "", currentDesignation: emp.designation ?? "",
      currentSalary: emp.currentSalary ?? 0,
      promotedBranchId: promotedBranchId, promotedBranch: promoBranch?.name ?? "",
      promotedDepartment, promotedDesignation, revisedSalary,
      effectiveDate, type, reason, remarks,
      status: "Pending L1",
      approvals: APPROVAL_LEVELS.map((l) => ({ ...l })),
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "), createdBy: currentUser,
    };
    onCreate(p);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>New Promotion · {nextNumber}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Employee</Label>
            <Select value={empId} onValueChange={setEmpId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.name} · {e.empId}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t} Promotion</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Promoted Department</Label>
            <Select value={promotedDepartment} onValueChange={setPromotedDepartment}>
              <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>{departments.map((d: any) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Promoted Designation</Label>
            <Select value={promotedDesignation} onValueChange={setPromotedDesignation}>
              <SelectTrigger><SelectValue placeholder="Designation" /></SelectTrigger>
              <SelectContent>{designations.map((d: any) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Promoted Branch</Label>
            <Select value={promotedBranchId} onValueChange={setPromotedBranchId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{branches.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Effective Date</Label><Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} /></div>
          <div><Label>Current Salary (₹)</Label><Input value={inr(emp?.currentSalary ?? 0)} disabled /></div>
          <div><Label>Revised Salary (₹)</Label><Input type="number" value={revisedSalary} onChange={(e) => setRevisedSalary(+e.target.value)} /></div>
          <div className="col-span-2"><Label>Reason *</Label><Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
          <div className="col-span-2"><Label>Remarks</Label><Textarea rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={create}>Submit for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PromotionLetter({ promo, onClose }: { promo: Promotion; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto print:bg-white print:static">
      <div className="max-w-[210mm] mx-auto my-6 bg-white text-black shadow-xl print:my-0 print:shadow-none">
        <div className="flex items-center justify-between p-3 border-b print:hidden bg-muted/30">
          <div className="text-xs text-muted-foreground">Promotion Letter · A4</div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print / PDF</Button>
            <Button size="sm" variant="outline" onClick={onClose}><X className="mr-1.5 h-3.5 w-3.5" /> Close</Button>
          </div>
        </div>
        <div className="p-10 text-sm leading-relaxed">
          <div className="text-center border-b-2 border-[#0b1f3a] pb-3 mb-6">
            <div className="text-2xl font-extrabold text-[#0b1f3a]">GEN-TECH GENERATORS PVT LTD</div>
            <div className="text-xs text-gray-600">Plot 14, SIPCOT Industrial Park, Hosur Road · 635126 · GSTIN: 33GENTC1234F1Z5</div>
          </div>
          <div className="flex justify-between text-xs mb-4">
            <div>Ref: {promo.number}</div>
            <div>Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</div>
          </div>
          <div className="font-bold mb-4">Subject: Letter of Promotion</div>
          <p className="mb-3">Dear <b>{promo.empName}</b>,</p>
          <p className="mb-3">
            We are pleased to inform you that in recognition of your dedication, performance and valuable contribution to Gen-Tech Generators Pvt Ltd,
            your role has been revised effective <b>{promo.effectiveDate}</b> as detailed below:
          </p>
          <table className="w-full text-xs border my-4">
            <tbody>
              <tr className="border-b"><td className="p-2 bg-gray-50 w-1/3 font-semibold">New Designation</td><td className="p-2">{promo.promotedDesignation}</td></tr>
              <tr className="border-b"><td className="p-2 bg-gray-50 font-semibold">Department</td><td className="p-2">{promo.promotedDepartment}</td></tr>
              <tr className="border-b"><td className="p-2 bg-gray-50 font-semibold">Branch / Location</td><td className="p-2">{promo.promotedBranch}</td></tr>
              <tr className="border-b"><td className="p-2 bg-gray-50 font-semibold">Revised Monthly Salary</td><td className="p-2 font-bold">{inr(promo.revisedSalary)} (previously {inr(promo.currentSalary)})</td></tr>
              <tr><td className="p-2 bg-gray-50 font-semibold">Effective Date</td><td className="p-2">{promo.effectiveDate}</td></tr>
            </tbody>
          </table>
          <p className="mb-3">All other terms & conditions of your employment shall remain unchanged. We trust that you will continue to contribute towards the growth of the organization with renewed enthusiasm.</p>
          <p className="mb-8">Congratulations and best wishes!</p>
          <div className="mt-12">
            <div className="font-bold">For Gen-Tech Generators Pvt Ltd</div>
            <div className="h-12" />
            <div className="border-t border-gray-400 inline-block pt-1 text-xs">Authorized Signatory · Human Resources</div>
          </div>
        </div>
        <style>{`@media print { body * { visibility: hidden; } .fixed.inset-0, .fixed.inset-0 * { visibility: visible; } .fixed.inset-0 { position: absolute; inset: 0; } @page { size: A4; margin: 12mm; } }`}</style>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, AlertTriangle, MessageSquare, User as UserIcon, ArrowUpCircle, Eye } from "lucide-react";
import type { ServiceTicket, TicketCategory, TicketNote } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/service")({ component: ServicePage });

const STATUSES: ServiceTicket["status"][] = ["New","Open","Assigned","In Progress","Pending Parts","Waiting for Customer","Waiting for Developer","Resolved","Closed","Reopened"];
const PRIORITIES: ServiceTicket["priority"][] = ["Low","Medium","High","Critical"];
const CATEGORIES: TicketCategory[] = ["Hardware","Software","Service","Billing","AMC","Spares","Other"];

const statusTone: Record<string, any> = {
  New: "secondary", Open: "secondary", Assigned: "default", "In Progress": "default",
  "Pending Parts": "secondary", "Waiting for Customer": "secondary", "Waiting for Developer": "secondary",
  Resolved: "default", Closed: "default", Reopened: "destructive",
};
const prioTone: Record<string, any> = { Low: "secondary", Medium: "default", High: "destructive", Critical: "destructive" };

function nowStr() {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function ServicePage() {
  const { tickets, customers, products, employees, add, update, logAudit } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  const technicians = employees.filter((e) => /service|engineer|technician/i.test(e.department + " " + e.designation));

  const [filter, setFilter] = React.useState<"All" | ServiceTicket["status"]>("All");
  const [newOpen, setNewOpen] = React.useState(false);
  const [detailId, setDetailId] = React.useState<string | null>(null);

  const filtered = filter === "All" ? tickets : tickets.filter((t) => t.status === filter);
  const detail = tickets.find((t) => t.id === detailId);

  const counts = tickets.reduce<Record<string, number>>((acc, t) => { acc[t.status] = (acc[t.status] ?? 0) + 1; return acc; }, {});

  // New ticket form
  const [nt, setNt] = React.useState({
    customerId: "", productId: "", problem: "",
    priority: "Medium" as ServiceTicket["priority"],
    category: "Service" as TicketCategory, sla: "24h",
  });
  const resetNt = () => setNt({ customerId: "", productId: "", problem: "", priority: "Medium", category: "Service", sla: "24h" });

  const createTicket = () => {
    if (!nt.customerId || !nt.productId || !nt.problem.trim()) { toast.error("Customer, product and problem are required."); return; }
    const number = `TKT-${Math.floor(Math.random() * 90000) + 10000}`;
    const t: ServiceTicket = {
      id: `tk_${Date.now()}`, number,
      customerId: nt.customerId, productId: nt.productId, problem: nt.problem.trim(),
      priority: nt.priority, status: "New",
      createdAt: new Date().toISOString().slice(0, 10),
      category: nt.category, sla: nt.sla, notes: [], escalated: false, updatedAt: nowStr(),
    };
    add("tickets", t);
    logAudit({ user: "current", entity: "Ticket", entityId: number, action: "Created" });
    toast.success(`Ticket ${number} created`);
    setNewOpen(false); resetNt();
  };

  const patchTicket = (id: string, patch: Partial<ServiceTicket>, action: string) => {
    update("tickets", id, { ...patch, updatedAt: nowStr() } as Partial<ServiceTicket>);
    const t = tickets.find((x) => x.id === id);
    if (t) logAudit({ user: "current", entity: "Ticket", entityId: t.number, action });
  };

  const addNote = (id: string, kind: "Internal" | "Customer", body: string) => {
    if (!body.trim()) return;
    const t = tickets.find((x) => x.id === id);
    if (!t) return;
    const note: TicketNote = { id: `nt_${Date.now()}`, at: nowStr(), author: "current", kind, body: body.trim() };
    patchTicket(id, { notes: [...(t.notes ?? []), note] } as any, `Note added (${kind})`);
    toast.success(`${kind} note added`);
  };

  return (
    <div>
      <PageHeader title="Service & Complaint Tickets" description="Intake, technician assignment, AMC, escalation and SLA tracking.">
        <Button size="sm" onClick={() => setNewOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> New Ticket</Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-4">
        {(["Open","Assigned","In Progress","Pending Parts","Closed"] as const).map((s) => (
          <Card key={s} className={"cursor-pointer transition-colors " + (filter === s ? "ring-2 ring-primary" : "")}
            onClick={() => setFilter(filter === s ? "All" : s)}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s}</div>
              <div className="text-2xl font-semibold mt-1">{counts[s] ?? 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b p-3 bg-muted/30">
          <span className="text-xs text-muted-foreground">Filter:</span>
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="h-8 w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-2">{filtered.length} of {tickets.length}</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead><TableHead>Created</TableHead><TableHead>Customer</TableHead>
              <TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Problem</TableHead>
              <TableHead>Priority</TableHead><TableHead>Technician</TableHead><TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} className={t.escalated ? "bg-destructive/5" : ""}>
                <TableCell className="font-mono text-xs">
                  {t.escalated && <AlertTriangle className="inline h-3 w-3 text-destructive mr-1" />}
                  {t.number}
                </TableCell>
                <TableCell>{t.createdAt}</TableCell>
                <TableCell className="font-medium">{cMap[t.customerId]}</TableCell>
                <TableCell>{pMap[t.productId]}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10px]">{t.category ?? "—"}</Badge></TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{t.problem}</TableCell>
                <TableCell><Badge variant={prioTone[t.priority]}>{t.priority}</Badge></TableCell>
                <TableCell>{t.technician ?? <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell><Badge variant={statusTone[t.status]}>{t.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDetailId(t.id)}><Eye className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* New ticket */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Service Ticket</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2">
              <Label>Customer</Label>
              <Select value={nt.customerId} onValueChange={(v) => setNt({ ...nt, customerId: v })}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Product</Label>
              <Select value={nt.productId} onValueChange={(v) => setNt({ ...nt, productId: v })}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.model}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={nt.category} onValueChange={(v) => setNt({ ...nt, category: v as TicketCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={nt.priority} onValueChange={(v) => setNt({ ...nt, priority: v as ServiceTicket["priority"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>SLA</Label>
              <Select value={nt.sla} onValueChange={(v) => setNt({ ...nt, sla: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["4h","8h","24h","48h","72h","7d"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Problem Description</Label>
              <Textarea rows={3} value={nt.problem} onChange={(e) => setNt({ ...nt, problem: e.target.value })} placeholder="Describe the issue…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={createTicket}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="max-w-2xl">
          {detail && (
            <TicketDetail
              t={detail}
              cMap={cMap} pMap={pMap}
              technicians={technicians}
              onPatch={(p, a) => patchTicket(detail.id, p, a)}
              onAddNote={(k, b) => addNote(detail.id, k, b)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TicketDetail({ t, cMap, pMap, technicians, onPatch, onAddNote }: {
  t: ServiceTicket;
  cMap: Record<string, string>;
  pMap: Record<string, string>;
  technicians: { id: string; name: string }[];
  onPatch: (patch: Partial<ServiceTicket>, action: string) => void;
  onAddNote: (kind: "Internal" | "Customer", body: string) => void;
}) {
  const [noteKind, setNoteKind] = React.useState<"Internal" | "Customer">("Internal");
  const [noteBody, setNoteBody] = React.useState("");
  const [resolution, setResolution] = React.useState(t.resolution ?? "");

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {t.escalated && <AlertTriangle className="h-4 w-4 text-destructive" />}
          {t.number} · {cMap[t.customerId]}
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="overview" className="mt-3">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes ({(t.notes ?? []).length})</TabsTrigger>
          <TabsTrigger value="resolve">Resolve</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Product" value={pMap[t.productId]} />
            <Info label="Category" value={t.category ?? "—"} />
            <Info label="Created" value={t.createdAt} />
            <Info label="Updated" value={t.updatedAt ?? "—"} />
            <Info label="SLA" value={t.sla ?? "—"} />
            <Info label="Priority" value={<Badge variant={prioTone[t.priority]}>{t.priority}</Badge>} />
          </div>
          <div className="rounded-md border p-3 bg-muted/30 text-sm">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Problem</div>
            {t.problem}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={t.status} onValueChange={(v) => onPatch({ status: v as ServiceTicket["status"] }, `Status → ${v}`)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={t.priority} onValueChange={(v) => onPatch({ priority: v as ServiceTicket["priority"] }, `Priority → ${v}`)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Assign Technician</Label>
              <Select value={t.technician ?? ""} onValueChange={(v) => onPatch({ technician: v, status: t.status === "New" || t.status === "Open" ? "Assigned" : t.status }, `Assigned to ${v}`)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  {technicians.length === 0
                    ? <SelectItem value="—" disabled>No technicians available</SelectItem>
                    : technicians.map((e) => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <Button variant={t.escalated ? "default" : "outline"} size="sm"
              onClick={() => onPatch({ escalated: !t.escalated }, t.escalated ? "De-escalated" : "Escalated")}>
              <ArrowUpCircle className="mr-1.5 h-3.5 w-3.5" />
              {t.escalated ? "Remove Escalation" : "Escalate"}
            </Button>
            <Badge variant={statusTone[t.status]}>{t.status}</Badge>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="pt-3">
          <div className="max-h-64 overflow-y-auto space-y-2 mb-3">
            {(t.notes ?? []).length === 0 && <div className="text-xs text-muted-foreground text-center py-6">No notes yet.</div>}
            {(t.notes ?? []).map((n) => (
              <div key={n.id} className={"rounded-md border p-2.5 text-sm " + (n.kind === "Internal" ? "bg-amber-50 dark:bg-amber-950/20" : "bg-muted/30")}>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <span className="inline-flex items-center gap-1"><UserIcon className="h-3 w-3" />{n.author} · {n.kind}</span>
                  <span>{n.at}</span>
                </div>
                {n.body}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Select value={noteKind} onValueChange={(v) => setNoteKind(v as any)}>
                <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal">Internal note</SelectItem>
                  <SelectItem value="Customer">Customer reply</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Type a note…" value={noteBody} onChange={(e) => setNoteBody(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { onAddNote(noteKind, noteBody); setNoteBody(""); } }} />
              <Button size="sm" onClick={() => { onAddNote(noteKind, noteBody); setNoteBody(""); }}>
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resolve" className="pt-3 space-y-3">
          <div>
            <Label className="text-xs">Resolution Summary</Label>
            <Textarea rows={5} value={resolution} onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe the fix, parts used, and follow-up actions…" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => { onPatch({ resolution, status: "Resolved" }, "Resolved"); toast.success("Marked Resolved"); }}>
              Mark Resolved
            </Button>
            <Button size="sm" onClick={() => { onPatch({ resolution, status: "Closed" }, "Closed"); toast.success("Ticket closed"); }}>
              Close Ticket
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

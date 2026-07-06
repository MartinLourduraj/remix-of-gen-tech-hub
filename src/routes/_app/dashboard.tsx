import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import {
  IndianRupee, TrendingUp, Users, ShieldCheck, Wrench, Boxes, Wallet, FileText,
  ArrowUpRight, ArrowDownRight, Search, RefreshCw, Download, Bell, Truck,
  AlertTriangle, CheckCircle2, XCircle, Clock, Percent, PackageOpen,
  Building2, PhoneCall, TrendingDown, Award, ShoppingCart, ClipboardCheck,
  UserPlus, Zap, ArrowRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line,
} from "recharts";
import { useData, inr, inrShort } from "@/lib/store";
import { monthlySales, branchSales, productMix } from "@/lib/seed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

const COLORS = ["hsl(var(--chart-1, 220 90% 55%))", "hsl(var(--chart-2, 200 90% 50%))", "hsl(var(--chart-3, 142 70% 45%))", "hsl(var(--chart-4, 40 95% 55%))", "hsl(var(--chart-5, 0 80% 60%))", "hsl(var(--chart-6, 265 70% 60%))"];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/* -------------------- Header -------------------- */
function OwnerHeader({ onRefresh }: { onRefresh: () => void }) {
  const [q, setQ] = React.useState("");
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr_1fr] items-center">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-primary font-semibold">Owner Command Center</div>
          <div className="mt-0.5 flex items-baseline flex-wrap gap-x-2">
            <span className="text-lg sm:text-xl font-extrabold truncate">{greeting()}, Rajesh</span>
            <span className="text-sm text-muted-foreground truncate">· Gen-Tech Generators</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            <span className="mx-1.5">·</span>
            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoice, customer, product, vendor, quotation..." className="pl-9" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Select defaultValue="today">
            <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Today","Yesterday","Last 7 Days","This Week","This Month","Last Month","This Quarter","This Year","Custom"].map(x=>
                <SelectItem key={x} value={x.toLowerCase().replace(/\s/g,"-")}>{x}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="tn">Tamil Nadu</SelectItem>
              <SelectItem value="pdy">Puducherry</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="outline" onClick={onRefresh} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" title="Export"><Download className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" className="relative" title="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] leading-4 text-center">7</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- KPI Card -------------------- */
type KpiProps = {
  label: string; value: string; icon: React.ElementType;
  delta?: string; positive?: boolean;
  sub?: React.ReactNode;
  tone?: "default" | "warn" | "critical" | "success";
  onClick?: () => void;
};
function Kpi({ label, value, delta, icon: Icon, positive = true, sub, tone = "default", onClick }: KpiProps) {
  const toneRing = tone === "critical" ? "ring-1 ring-rose-500/30" : tone === "warn" ? "ring-1 ring-amber-500/30" : tone === "success" ? "ring-1 ring-emerald-500/30" : "";
  const toneIcon = tone === "critical" ? "bg-rose-500/10 text-rose-600" : tone === "warn" ? "bg-amber-500/10 text-amber-600" : tone === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary";
  return (
    <Card onClick={onClick} className={cn("cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5", toneRing)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-medium text-muted-foreground truncate">{label}</div>
            <div className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight">{value}</div>
            {delta && (
              <div className={`mt-1 inline-flex items-center gap-1 text-xs ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {delta}
              </div>
            )}
          </div>
          <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md", toneIcon)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {sub && <div className="mt-2 text-[11px] text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

/* -------------------- Section -------------------- */
function Section({ title, right, children, className }: { title: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
        {right}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

/* -------------------- Dashboard -------------------- */
function Dashboard() {
  const { invoices, customers, warranties, tickets, products, vendors, employees, quotations } = useData();
  const [nonce, setNonce] = React.useState(0);
  const onRefresh = () => setNonce((n) => n + 1);
  void nonce;

  // Aggregates
  const totalSales = invoices.reduce((s, i) => s + i.total, 0);
  const outstanding = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const collections = invoices.reduce((s, i) => s + i.paid, 0);
  const todaySales = Math.round(totalSales * 0.03);
  const yesterdaySales = Math.round(todaySales * 0.88);
  const todayCollection = Math.round(collections * 0.04);
  const todayPurchase = Math.round(totalSales * 0.018);
  const grossProfit = Math.round(totalSales * 0.22);
  const grossMargin = 22;
  const receivable = outstanding;
  const payable = Math.round(totalSales * 0.12);
  const stockValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= (p.reorderLevel ?? 5)).length;
  const outStock = products.filter((p) => p.stock === 0).length;
  const activeWar = warranties.filter((w) => w.status === "Active").length;
  const openTickets = tickets.filter((t) => t.status !== "Closed").length;

  // Fake approvals derived from data
  const approvals = [
    { id: "AP-101", type: "Discount", ref: "INV-2026-0007", by: employees[0]?.name ?? "Priya S.", branch: "Chennai", cust: customers[0]?.name ?? "PowerLine", oldV: 1_25_000, newV: 1_08_000, reason: "Repeat customer bulk order", priority: "HIGH" as const, time: "8m" },
    { id: "AP-102", type: "Purchase", ref: "PO-2026-0034", by: employees[1]?.name ?? "Arun K.", branch: "Hosur", cust: vendors[0]?.name ?? "Kirloskar", oldV: 8_40_000, newV: 8_40_000, reason: "125 KVA silent DG × 2", priority: "CRITICAL" as const, time: "22m" },
    { id: "AP-103", type: "Payment", ref: "PAY-0089", by: employees[2]?.name ?? "Meena R.", branch: "Puducherry", cust: vendors[1]?.name ?? "Cummins Spares", oldV: 1_75_000, newV: 1_75_000, reason: "Overdue vendor payment", priority: "HIGH" as const, time: "1h" },
    { id: "AP-104", type: "Credit Limit", ref: "CUST-018", by: employees[0]?.name ?? "Priya S.", branch: "Chennai", cust: customers[1]?.name ?? "Sundaram Hospital", oldV: 5_00_000, newV: 8_00_000, reason: "AMC extension", priority: "MEDIUM" as const, time: "3h" },
    { id: "AP-105", type: "Sales Return", ref: "SR-0021", by: employees[1]?.name ?? "Arun K.", branch: "Chennai", cust: customers[2]?.name ?? "Bharat Constructions", oldV: 62_000, newV: 62_000, reason: "Defective AVR", priority: "MEDIUM" as const, time: "5h" },
    { id: "AP-106", type: "Quotation", ref: "QTN-2026-0018", by: employees[2]?.name ?? "Meena R.", branch: "Puducherry", cust: customers[3]?.name ?? "Karnataka PWD", oldV: 22_50_000, newV: 22_50_000, reason: "Sync pack 500 KVA × 2", priority: "LOW" as const, time: "7h" },
  ];
  const critApprovals = approvals.filter(a => a.priority === "CRITICAL" || a.priority === "HIGH").length;

  // Discount approvals subset
  const discountReqs = approvals.filter(a => a.type === "Discount");

  // Cash abstract mock
  const cash = { opening: 1_25_000, in: 4_80_000, out: 3_15_000, refunds: 6_500, expected: 1_25_000 + 4_80_000 - 3_15_000 - 6_500, actual: 1_25_000 + 4_80_000 - 3_15_000 - 6_500 - 1_200 };
  const cashDiff = cash.actual - cash.expected;

  // Aging buckets
  const receivableAging = [
    { bucket: "Current", value: Math.round(receivable * 0.42) },
    { bucket: "1–30 d", value: Math.round(receivable * 0.28) },
    { bucket: "31–60 d", value: Math.round(receivable * 0.16) },
    { bucket: "61–90 d", value: Math.round(receivable * 0.09) },
    { bucket: "90+ d", value: Math.round(receivable * 0.05) },
  ];
  const payableAging = [
    { bucket: "Current", value: Math.round(payable * 0.50) },
    { bucket: "1–30 d", value: Math.round(payable * 0.25) },
    { bucket: "31–60 d", value: Math.round(payable * 0.15) },
    { bucket: "61–90 d", value: Math.round(payable * 0.07) },
    { bucket: "90+ d", value: Math.round(payable * 0.03) },
  ];

  const cashFlow = monthlySales.map((m, i) => ({
    month: m.month,
    inflow: Math.round(m.revenue * 1.1),
    outflow: Math.round(m.revenue * 0.72 + i * 5),
    net: Math.round(m.revenue * 0.38 - i * 5),
  }));

  const pipeline = [
    { stage: "New Enquiry", count: 42, value: 62_00_000 },
    { stage: "Contacted", count: 34, value: 54_00_000 },
    { stage: "Requirement", count: 26, value: 44_00_000 },
    { stage: "Site Visit", count: 18, value: 32_00_000 },
    { stage: "Quotation", count: 14, value: 26_00_000 },
    { stage: "Negotiation", count: 9, value: 18_00_000 },
    { stage: "Won", count: 6, value: 12_00_000 },
  ];
  const leadSources = [
    { name: "Website", value: 34 }, { name: "Walk-In", value: 22 },
    { name: "Phone", value: 18 }, { name: "Dealer", value: 14 },
    { name: "Referral", value: 8 }, { name: "Campaign", value: 4 },
  ];

  const topCustomers = customers.slice(0, 6).map((c, i) => {
    const cust = invoices.filter(x => x.customerId === c.id);
    const sales = cust.reduce((s, x) => s + x.total, 0) || (5_00_000 - i * 40_000);
    const paid = cust.reduce((s, x) => s + x.paid, 0) || Math.round(sales * 0.7);
    const due = sales - paid;
    return { ...c, sales, paid, due, aging: 20 + i * 15, limit: 6_00_000 };
  }).sort((a, b) => b.due - a.due);

  const topVendors = vendors.slice(0, 6).map((v, i) => ({
    ...v,
    opening: 80_000 - i * 5_000,
    purchase: 6_50_000 - i * 40_000,
    ret: 12_000,
    paid: 4_20_000 - i * 30_000,
    outstanding: 2_20_000 - i * 15_000,
    aging: 15 + i * 10,
  }));

  const empPerf = employees.slice(0, 6).map((e, i) => {
    const target = 15_00_000;
    const sales = 18_00_000 - i * 1_20_000;
    return { ...e, target, sales, ach: Math.round((sales / target) * 100), profit: Math.round(sales * 0.19), disc: 2 + i * 0.4, coll: Math.round(sales * 0.85), leads: 22 - i * 2, ret: (0.8 + i * 0.3).toFixed(1) };
  }).sort((a, b) => b.ach - a.ach);

  const productPerf = products.slice(0, 8).map((p, i) => {
    const qtySold = 22 - i * 2;
    const salesV = qtySold * p.sellingPrice;
    return { ...p, qtySold, salesV, profit: Math.round(salesV * 0.22), margin: 22, disc: 3 + i * 0.5, ret: (0.5 + i * 0.2).toFixed(1) };
  });

  const supplierPurchase = vendors.slice(0, 5).map((v, i) => ({ name: v.name, value: 4_50_000 - i * 45_000, otd: 88 + (i % 3) * 3 }));

  const gst = {
    taxSales: Math.round(totalSales / 1.18),
    outCGST: Math.round(totalSales * 0.045),
    outSGST: Math.round(totalSales * 0.045),
    outIGST: Math.round(totalSales * 0.035),
    taxPurchase: Math.round(totalSales * 0.55),
    inCGST: Math.round(totalSales * 0.028),
    inSGST: Math.round(totalSales * 0.028),
    inIGST: Math.round(totalSales * 0.020),
  };
  const netGST = (gst.outCGST + gst.outSGST + gst.outIGST) - (gst.inCGST + gst.inSGST + gst.inIGST);

  const exceptions = [
    { type: "Below-Cost Sale",       ref: "INV-2026-0011", detail: "Silent 15 KVA sold at ₹1.42L (cost ₹1.48L)", sev: "HIGH" as const },
    { type: "Credit Limit Exceeded", ref: "CUST-018",       detail: "Sundaram Hospital exceeded limit by ₹1.2L",  sev: "CRITICAL" as const },
    { type: "Excessive Discount",    ref: "QTN-2026-0022",  detail: "18% discount on 125 KVA (policy 10%)",       sev: "HIGH" as const },
    { type: "Overdue Vendor Payment",ref: "PO-2026-0018",   detail: "Cummins Spares · 72 days overdue",           sev: "HIGH" as const },
    { type: "Cash Shortage",         ref: "CA-2026-05-14",  detail: "Chennai branch short by ₹1,200",             sev: "MEDIUM" as const },
    { type: "Negative Stock",        ref: "SPR-A342",       detail: "Fuel filter GT-FF-2 shows −3 in Hosur WH",    sev: "MEDIUM" as const },
  ];

  const trolleyBookings = [
    { no: "TRB-001042", cust: "Bharat Constructions", mobile: "9840012345", gen: "Silent 125 KVA", kva: 125, type: "Double Axle", from: "Chennai", to: "Trichy", date: "07 Jul", status: "Confirmed" },
    { no: "TRB-001041", cust: "Sundaram Hospital",    mobile: "9812233445", gen: "Silent 62.5 KVA", kva: 62.5, type: "Single Axle", from: "Chennai", to: "Vellore", date: "07 Jul", status: "Pending" },
    { no: "TRB-001040", cust: "PowerLine Dealers",    mobile: "9822334455", gen: "Industrial 250 KVA", kva: 250, type: "Heavy Duty", from: "Hosur", to: "Bengaluru", date: "06 Jul", status: "In Transit" },
    { no: "TRB-001039", cust: "Karnataka PWD",        mobile: "9833445566", gen: "Sync 500 KVA", kva: 500, type: "Industrial", from: "Chennai", to: "Mysuru", date: "06 Jul", status: "Completed" },
  ];

  return (
    <div className="space-y-4">
      <OwnerHeader onRefresh={onRefresh} />

      <Tabs defaultValue="main" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          {["Main","Sales","CRM","Accounts","Inventory","Purchase","Approvals","Customers","Vendors","Branches","Generator Ops"].map(t => (
            <TabsTrigger key={t} value={t.toLowerCase().replace(/\s/g,"-")}>{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* ===================== MAIN TAB ===================== */}
        <TabsContent value="main" className="space-y-4 mt-0">
          {/* KPI STRIP */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            <Kpi label="Today Sales" value={inrShort(todaySales)} icon={IndianRupee} delta={`+${Math.round(((todaySales-yesterdaySales)/yesterdaySales)*100)}% vs yesterday`}
              sub={<>Invoices: <b className="text-foreground">18</b> · Target: {inrShort(todaySales * 1.15)}</>} />
            <Kpi label="Today Collection" value={inrShort(todayCollection)} icon={Wallet} delta="+18.7% MoM" tone="success"
              sub={<>Cash {inrShort(todayCollection*.28)} · UPI {inrShort(todayCollection*.32)} · Card {inrShort(todayCollection*.20)} · Bank {inrShort(todayCollection*.20)}</>} />
            <Kpi label="Today Purchase" value={inrShort(todayPurchase)} icon={ShoppingCart} delta="+4.1% MoM"
              sub={<>POs: 6 · Cash: {inrShort(todayPurchase*.25)} · Credit: {inrShort(todayPurchase*.75)}</>} />
            <Kpi label="Gross Profit" value={inrShort(grossProfit)} icon={TrendingUp} delta={`Margin ${grossMargin}%`} tone="success"
              sub={<>vs Prev Period: +2.1 pts</>} />
            <Kpi label="Receivable" value={inrShort(receivable)} icon={FileText} delta="4 overdue" positive={false} tone="warn"
              sub={<>Due today: {inrShort(receivable*.06)} · Customers: {customers.length}</>} />
            <Kpi label="Payable" value={inrShort(payable)} icon={PackageOpen} delta="2 overdue" positive={false} tone="warn"
              sub={<>Due today: {inrShort(payable*.08)} · Vendors: {vendors.length}</>} />
            <Kpi label="Stock Value" value={inrShort(stockValue)} icon={Boxes}
              sub={<>SKUs: {products.length} · Low: <b className="text-amber-600">{lowStock}</b> · Out: <b className="text-rose-600">{outStock}</b></>} />
            <Kpi label="Owner Attention" value={String(approvals.length)} icon={AlertTriangle} tone="critical" delta={`${critApprovals} critical/high`} positive={false}
              sub={<>Approvals · Exceptions · Overdue</>} />
          </div>

          {/* ROW: Sales chart + Attention center */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Section className="lg:col-span-2" title="Sales Performance"
              right={
                <Select defaultValue="monthly">
                  <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Daily","Weekly","Monthly","Quarterly","Yearly"].map(x=><SelectItem key={x} value={x.toLowerCase()}>{x}</SelectItem>)}</SelectContent>
                </Select>
              }>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.4} /><stop offset="100%" stopColor={COLORS[0]} stopOpacity={0} /></linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS[2]} stopOpacity={0.35} /><stop offset="100%" stopColor={COLORS[2]} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                  <Legend />
                  <Area type="monotone" dataKey="sales" name="Sales (₹L)" stroke={COLORS[0]} fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="revenue" name="Revenue (₹L)" stroke={COLORS[2]} fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Owner Attention Center" right={<Badge variant="destructive">{critApprovals} critical/high</Badge>}>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {approvals.map(a => (
                  <div key={a.id} className="rounded-md border p-2.5 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <PriorityDot p={a.priority} />
                        <span className="text-xs font-semibold truncate">{a.type}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{a.ref}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0"><Clock className="inline h-3 w-3 mr-0.5" />{a.time}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground truncate">{a.by} · {a.branch} · {a.cust}</div>
                    {a.oldV !== a.newV && (
                      <div className="mt-1 text-[11px]">
                        <span className="line-through text-muted-foreground">{inr(a.oldV)}</span>
                        <span className="mx-1">→</span>
                        <span className="font-semibold text-primary">{inr(a.newV)}</span>
                        <span className="ml-1.5 text-rose-600">(-{inr(a.oldV - a.newV)})</span>
                      </div>
                    )}
                    <div className="mt-1.5 flex gap-1">
                      <Button size="sm" variant="default" className="h-6 text-[10px] px-2">Approve</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">Reject</Button>
                      <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* ROW: Cash flow + Aging */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Section className="lg:col-span-2" title="Cash Flow">
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={cashFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="inflow" stroke={COLORS[2]} strokeWidth={2} />
                  <Line type="monotone" dataKey="outflow" stroke={COLORS[4]} strokeWidth={2} />
                  <Line type="monotone" dataKey="net" stroke={COLORS[0]} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Section>
            <Section title="Receivable vs Payable Aging">
              <div className="text-xs font-semibold text-muted-foreground mb-1">Receivable</div>
              <AgingBar rows={receivableAging} tone="warn" />
              <div className="text-xs font-semibold text-muted-foreground mt-4 mb-1">Payable</div>
              <AgingBar rows={payableAging} tone="critical" />
            </Section>
          </div>

          {/* ROW: CRM + Discount */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Section className="lg:col-span-2" title="Sales Pipeline Funnel">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pipeline} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="stage" fontSize={11} stroke="hsl(var(--muted-foreground))" width={90} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                  <Bar dataKey="count" fill={COLORS[0]} radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
            <Section title="Discount Approval">
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <MiniStat n={discountReqs.length} l="Pending" tone="warn" />
                <MiniStat n={12} l="Approved" tone="success" />
                <MiniStat n={4} l="Rejected" tone="critical" />
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                {discountReqs.map(d => (
                  <div key={d.id} className="rounded border p-2 text-xs">
                    <div className="font-semibold truncate">{d.cust}</div>
                    <div className="text-muted-foreground truncate">{d.ref} · {d.by}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-rose-600">Margin impact: -{inr(d.oldV - d.newV)}</span>
                      <Button size="sm" className="h-6 text-[10px]">Review</Button>
                    </div>
                  </div>
                ))}
                {discountReqs.length === 0 && <div className="text-xs text-muted-foreground">No pending discount requests.</div>}
              </div>
            </Section>
          </div>

          {/* ROW: Cash abstract + GST + Exceptions */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Section title="Daily Cash Abstract"
              right={<Badge className={cashDiff === 0 ? "bg-emerald-600" : cashDiff < 0 ? "bg-rose-600" : "bg-amber-600"}>{cashDiff === 0 ? "TALLIED" : cashDiff < 0 ? "SHORT" : "EXCESS"}</Badge>}>
              <dl className="text-sm space-y-1">
                <Row k="Opening Cash" v={inr(cash.opening)} />
                <Row k="Cash In" v={inr(cash.in)} pos />
                <Row k="Cash Out" v={inr(cash.out)} neg />
                <Row k="Refunds" v={inr(cash.refunds)} neg />
                <div className="h-px bg-border my-1" />
                <Row k="Expected Closing" v={inr(cash.expected)} />
                <Row k="Actual Closing" v={inr(cash.actual)} />
                <Row k="Difference" v={inr(cashDiff)} tone={cashDiff !== 0 ? "critical" : "success"} />
              </dl>
            </Section>
            <Section title="GST Snapshot">
              <dl className="text-sm space-y-1">
                <Row k="Taxable Sales" v={inr(gst.taxSales)} />
                <Row k="Output CGST/SGST" v={inr(gst.outCGST + gst.outSGST)} />
                <Row k="Output IGST" v={inr(gst.outIGST)} />
                <div className="h-px bg-border my-1" />
                <Row k="Taxable Purchase" v={inr(gst.taxPurchase)} />
                <Row k="Input CGST/SGST" v={inr(gst.inCGST + gst.inSGST)} />
                <Row k="Input IGST" v={inr(gst.inIGST)} />
                <div className="h-px bg-border my-1" />
                <Row k="Net GST Liability" v={inr(netGST)} tone="warn" />
              </dl>
            </Section>
            <Section title="Risk & Exception Center" right={<Badge variant="destructive">{exceptions.length}</Badge>}>
              <div className="space-y-1.5 max-h-[230px] overflow-y-auto pr-1">
                {exceptions.map((e, i) => (
                  <div key={i} className="rounded border p-2 text-xs flex items-start gap-2">
                    <PriorityDot p={e.sev} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{e.type} · <span className="text-muted-foreground font-normal">{e.ref}</span></div>
                      <div className="text-muted-foreground truncate">{e.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* ROW: Trolley + Product mix */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Section className="lg:col-span-2" title="Trolley Booking"
              right={<Button asChild size="sm" variant="outline"><Link to="/trolley-booking"><Truck className="h-3.5 w-3.5 mr-1" /> New Booking</Link></Button>}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-center">
                <MiniStat n={12} l="Today" />
                <MiniStat n={4} l="Pending" tone="warn" />
                <MiniStat n={7} l="Confirmed" tone="success" />
                <MiniStat n={2} l="In Transit" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-muted-foreground">
                    <tr className="border-b">
                      {["Booking","Customer","Generator","Trolley","Route","Date","Status"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {trolleyBookings.map(b => (
                      <tr key={b.no} className="border-b hover:bg-muted/40">
                        <td className="px-2 py-1.5 font-mono">{b.no}</td>
                        <td className="px-2 py-1.5 truncate max-w-[140px]">{b.cust}</td>
                        <td className="px-2 py-1.5 truncate">{b.gen}</td>
                        <td className="px-2 py-1.5">{b.type}</td>
                        <td className="px-2 py-1.5">{b.from} → {b.to}</td>
                        <td className="px-2 py-1.5">{b.date}</td>
                        <td className="px-2 py-1.5"><Badge variant={b.status==="Completed"?"secondary":b.status==="Pending"?"outline":"default"}>{b.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
            <Section title="Product Mix">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={productMix} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={2}>
                    {productMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </Section>
          </div>

          {/* Quick actions */}
          <Section title="Quick Owner Actions">
            <div className="flex flex-wrap gap-2">
              {[
                { l: "Check Stock", i: Boxes, to: "/inventory" },
                { l: "Approve Discount", i: Percent, to: "/dashboard" },
                { l: "Approve Purchase", i: ClipboardCheck, to: "/dashboard" },
                { l: "Create Quotation", i: FileText, to: "/quotations" },
                { l: "Create Invoice", i: IndianRupee, to: "/sales/invoices/new" },
                { l: "Add Customer", i: UserPlus, to: "/customers/new" },
                { l: "Receivable", i: Wallet, to: "/reports/outstanding" },
                { l: "Payable", i: PackageOpen, to: "/reports/purchases" },
                { l: "Book Trolley", i: Truck, to: "/trolley-booking" },
                { l: "CRM Follow-ups", i: PhoneCall, to: "/dashboard" },
                { l: "Reports", i: FileText, to: "/reports" },
              ].map(a => (
                <Button key={a.l} asChild variant="outline" size="sm">
                  <Link to={a.to as any}><a.i className="h-3.5 w-3.5 mr-1.5" /> {a.l}</Link>
                </Button>
              ))}
            </div>
          </Section>
        </TabsContent>

        {/* ===================== SALES TAB ===================== */}
        <TabsContent value="sales" className="space-y-4 mt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Cash Sales" value={inrShort(totalSales * .35)} icon={IndianRupee} />
            <Kpi label="Credit Sales" value={inrShort(totalSales * .65)} icon={FileText} />
            <Kpi label="Avg Bill Value" value={inrShort(totalSales / Math.max(1, invoices.length))} icon={TrendingUp} />
            <Kpi label="Return %" value="1.8%" icon={TrendingDown} tone="warn" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Branch-wise Sales">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={branchSales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="branch" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                  <Bar dataKey="value" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
            <Section title="Product Performance (Top)">
              <div className="overflow-x-auto max-h-[280px]">
                <table className="w-full text-xs">
                  <thead className="text-muted-foreground sticky top-0 bg-card">
                    <tr className="border-b"><th className="text-left px-2 py-1.5 font-medium">Product</th><th className="text-right px-2 py-1.5 font-medium">Qty</th><th className="text-right px-2 py-1.5 font-medium">Sales</th><th className="text-right px-2 py-1.5 font-medium">Profit</th><th className="text-right px-2 py-1.5 font-medium">Margin</th></tr>
                  </thead>
                  <tbody>
                    {productPerf.map(p => (
                      <tr key={p.id} className="border-b hover:bg-muted/40">
                        <td className="px-2 py-1.5 truncate max-w-[160px]">{p.name}</td>
                        <td className="px-2 py-1.5 text-right">{p.qtySold}</td>
                        <td className="px-2 py-1.5 text-right">{inrShort(p.salesV)}</td>
                        <td className="px-2 py-1.5 text-right text-emerald-600">{inrShort(p.profit)}</td>
                        <td className="px-2 py-1.5 text-right">{p.margin}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
          <Section title="Employee Performance">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b">
                  {["Employee","Target","Sales","Ach %","Profit","Discount %","Collection","Leads Won","Return %"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {empPerf.map((e, i) => (
                    <tr key={e.id} className="border-b hover:bg-muted/40">
                      <td className="px-2 py-1.5 flex items-center gap-2"><Award className={cn("h-3.5 w-3.5", i === 0 ? "text-amber-500" : "text-muted-foreground")} /> {e.name}</td>
                      <td className="px-2 py-1.5">{inrShort(e.target)}</td>
                      <td className="px-2 py-1.5">{inrShort(e.sales)}</td>
                      <td className="px-2 py-1.5"><div className="flex items-center gap-2"><Progress value={Math.min(100, e.ach)} className="h-1.5 w-16" /> {e.ach}%</div></td>
                      <td className="px-2 py-1.5 text-emerald-600">{inrShort(e.profit)}</td>
                      <td className="px-2 py-1.5">{e.disc.toFixed(1)}%</td>
                      <td className="px-2 py-1.5">{inrShort(e.coll)}</td>
                      <td className="px-2 py-1.5">{e.leads}</td>
                      <td className="px-2 py-1.5">{e.ret}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        {/* ===================== CRM TAB ===================== */}
        <TabsContent value="crm" className="space-y-4 mt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Kpi label="New Leads" value="42" icon={UserPlus} tone="success" />
            <Kpi label="Hot Leads" value="14" icon={Zap} tone="warn" />
            <Kpi label="Follow-ups Due" value="9" icon={PhoneCall} />
            <Kpi label="Pipeline Value" value={inrShort(2_48_00_000)} icon={TrendingUp} />
            <Kpi label="Conversion" value="14.3%" icon={CheckCircle2} tone="success" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Lead Sources">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={leadSources} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85}>
                    {leadSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Section>
            <Section title="Follow-ups Today">
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {customers.slice(0, 6).map((c, i) => (
                  <div key={c.id} className="rounded border p-2 text-xs flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{c.name}</div>
                      <div className="text-muted-foreground truncate">{employees[i % employees.length]?.name} · {i % 2 === 0 ? "High" : "Medium"} priority</div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7"><PhoneCall className="h-3 w-3 mr-1" /> Call</Button>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </TabsContent>

        {/* ===================== ACCOUNTS TAB ===================== */}
        <TabsContent value="accounts" className="space-y-4 mt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Opening Cash" value={inr(cash.opening)} icon={Wallet} />
            <Kpi label="Cash In" value={inr(cash.in)} icon={ArrowUpRight} tone="success" />
            <Kpi label="Cash Out" value={inr(cash.out)} icon={ArrowDownRight} tone="warn" />
            <Kpi label="Closing Cash" value={inr(cash.actual)} icon={Wallet} />
            <Kpi label="Bank Balance" value={inrShort(28_00_000)} icon={Building2} />
            <Kpi label="Receivable" value={inrShort(receivable)} icon={FileText} tone="warn" />
            <Kpi label="Payable" value={inrShort(payable)} icon={PackageOpen} tone="warn" />
            <Kpi label="Net Cash Flow" value={inrShort(collections - payable)} icon={TrendingUp} tone="success" />
          </div>
          <Section title="Customer & Vendor Movement">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">CUSTOMER SIDE</div>
                <dl className="text-sm space-y-1">
                  <Row k="Opening" v={inrShort(35_00_000)} />
                  <Row k="Sales" v={inrShort(totalSales)} pos />
                  <Row k="Sales Return" v={inrShort(totalSales * .015)} neg />
                  <Row k="Receipt" v={inrShort(collections)} neg />
                  <Row k="Debit Note" v={inrShort(50_000)} pos />
                  <Row k="Credit Note" v={inrShort(65_000)} neg />
                  <div className="h-px bg-border my-1" />
                  <Row k="Closing Receivable" v={inrShort(receivable)} tone="warn" />
                </dl>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">VENDOR SIDE</div>
                <dl className="text-sm space-y-1">
                  <Row k="Opening" v={inrShort(18_00_000)} />
                  <Row k="Purchase" v={inrShort(totalSales * 0.55)} pos />
                  <Row k="Purchase Return" v={inrShort(totalSales * 0.01)} neg />
                  <Row k="Payment" v={inrShort(totalSales * 0.42)} neg />
                  <Row k="Debit Note" v={inrShort(30_000)} neg />
                  <Row k="Credit Note" v={inrShort(45_000)} pos />
                  <div className="h-px bg-border my-1" />
                  <Row k="Closing Payable" v={inrShort(payable)} tone="warn" />
                </dl>
              </div>
            </div>
          </Section>
        </TabsContent>

        {/* ===================== INVENTORY TAB ===================== */}
        <TabsContent value="inventory" className="space-y-4 mt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Stock Value" value={inrShort(stockValue)} icon={Boxes} />
            <Kpi label="Total SKUs" value={String(products.length)} icon={Boxes} />
            <Kpi label="Low Stock" value={String(lowStock)} icon={AlertTriangle} tone="warn" />
            <Kpi label="Out of Stock" value={String(outStock)} icon={XCircle} tone="critical" />
          </div>
          <Section title="Owner Stock Check">
            <div className="mb-3"><Input placeholder="Search item, SKU, HSN, serial, brand..." /></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b">
                  {["Item","SKU","Available","Reorder","Purchase Rate","Sell Price","Stock Value","Status"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {products.slice(0, 10).map(p => {
                    const status = p.stock === 0 ? "Out" : p.stock <= (p.reorderLevel ?? 5) ? "Low" : "Healthy";
                    return (
                      <tr key={p.id} className="border-b hover:bg-muted/40">
                        <td className="px-2 py-1.5 truncate max-w-[180px]">{p.name}</td>
                        <td className="px-2 py-1.5 font-mono">{p.sku}</td>
                        <td className="px-2 py-1.5">{p.stock}</td>
                        <td className="px-2 py-1.5">{p.reorderLevel ?? "-"}</td>
                        <td className="px-2 py-1.5">{inrShort(p.purchasePrice)}</td>
                        <td className="px-2 py-1.5">{inrShort(p.sellingPrice)}</td>
                        <td className="px-2 py-1.5">{inrShort(p.stock * p.purchasePrice)}</td>
                        <td className="px-2 py-1.5"><Badge variant={status==="Out"?"destructive":status==="Low"?"outline":"secondary"}>{status}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        {/* ===================== PURCHASE TAB ===================== */}
        <TabsContent value="purchase" className="space-y-4 mt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Today Purchase" value={inrShort(todayPurchase)} icon={ShoppingCart} />
            <Kpi label="Pending PO" value="6" icon={ClipboardCheck} tone="warn" />
            <Kpi label="Supplier Due" value={inrShort(payable)} icon={PackageOpen} tone="warn" />
            <Kpi label="Return %" value="0.8%" icon={TrendingDown} />
          </div>
          <Section title="Top Suppliers">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b">
                  {["Supplier","Purchase Value","Outstanding","On-Time %"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {supplierPurchase.map((s, i) => (
                    <tr key={i} className="border-b hover:bg-muted/40">
                      <td className="px-2 py-1.5">{s.name}</td>
                      <td className="px-2 py-1.5">{inrShort(s.value)}</td>
                      <td className="px-2 py-1.5 text-rose-600">{inrShort(topVendors[i]?.outstanding ?? 0)}</td>
                      <td className="px-2 py-1.5"><div className="flex items-center gap-2"><Progress value={s.otd} className="h-1.5 w-16" /> {s.otd}%</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        {/* ===================== APPROVALS TAB ===================== */}
        <TabsContent value="approvals" className="space-y-4 mt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Total Pending" value={String(approvals.length)} icon={ClipboardCheck} tone="warn" />
            <Kpi label="Critical" value={String(approvals.filter(a=>a.priority==="CRITICAL").length)} icon={AlertTriangle} tone="critical" />
            <Kpi label="High" value={String(approvals.filter(a=>a.priority==="HIGH").length)} icon={AlertTriangle} tone="warn" />
            <Kpi label="Approved Today" value="18" icon={CheckCircle2} tone="success" />
          </div>
          <Section title="All Pending Approvals">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b">
                  {["Type","Ref","Requested By","Branch","Customer/Vendor","Original","Requested","Diff","Reason","Time","Priority","Actions"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {approvals.map(a => (
                    <tr key={a.id} className="border-b hover:bg-muted/40">
                      <td className="px-2 py-1.5">{a.type}</td>
                      <td className="px-2 py-1.5 font-mono">{a.ref}</td>
                      <td className="px-2 py-1.5">{a.by}</td>
                      <td className="px-2 py-1.5">{a.branch}</td>
                      <td className="px-2 py-1.5 truncate max-w-[140px]">{a.cust}</td>
                      <td className="px-2 py-1.5">{inrShort(a.oldV)}</td>
                      <td className="px-2 py-1.5">{inrShort(a.newV)}</td>
                      <td className={cn("px-2 py-1.5", a.oldV > a.newV && "text-rose-600")}>{a.oldV !== a.newV ? inrShort(a.oldV - a.newV) : "-"}</td>
                      <td className="px-2 py-1.5 truncate max-w-[160px] text-muted-foreground">{a.reason}</td>
                      <td className="px-2 py-1.5">{a.time}</td>
                      <td className="px-2 py-1.5"><Badge variant={a.priority==="CRITICAL"?"destructive":a.priority==="HIGH"?"outline":"secondary"}>{a.priority}</Badge></td>
                      <td className="px-2 py-1.5"><div className="flex gap-1"><Button size="sm" className="h-6 text-[10px]">Approve</Button><Button size="sm" variant="outline" className="h-6 text-[10px]">Reject</Button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        {/* ===================== CUSTOMERS TAB ===================== */}
        <TabsContent value="customers" className="space-y-4 mt-0">
          <Section title="Top Customer Outstanding">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b">
                  {["Customer","Mobile","Sales","Paid","Outstanding","Aging","Credit Limit","Status","Actions"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {topCustomers.map(c => {
                    const over = c.due > c.limit;
                    const critical = c.aging > 90;
                    return (
                      <tr key={c.id} className="border-b hover:bg-muted/40">
                        <td className="px-2 py-1.5">{c.name}</td>
                        <td className="px-2 py-1.5">{c.mobile}</td>
                        <td className="px-2 py-1.5">{inrShort(c.sales)}</td>
                        <td className="px-2 py-1.5 text-emerald-600">{inrShort(c.paid)}</td>
                        <td className="px-2 py-1.5 font-semibold text-rose-600">{inrShort(c.due)}</td>
                        <td className={cn("px-2 py-1.5", critical && "text-rose-600 font-semibold")}>{c.aging}d</td>
                        <td className="px-2 py-1.5">{inrShort(c.limit)}</td>
                        <td className="px-2 py-1.5">{over ? <Badge variant="destructive">Over Limit</Badge> : critical ? <Badge variant="outline">90+ d</Badge> : <Badge variant="secondary">OK</Badge>}</td>
                        <td className="px-2 py-1.5"><div className="flex gap-1"><Button size="sm" variant="outline" className="h-6 text-[10px]">Ledger</Button><Button size="sm" variant="outline" className="h-6 text-[10px]"><PhoneCall className="h-3 w-3" /></Button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        {/* ===================== VENDORS TAB ===================== */}
        <TabsContent value="vendors" className="space-y-4 mt-0">
          <Section title="Vendor Payable">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b">
                  {["Vendor","Opening","Purchase","Return","Paid","Outstanding","Aging","Status"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {topVendors.map(v => (
                    <tr key={v.id} className="border-b hover:bg-muted/40">
                      <td className="px-2 py-1.5">{v.name}</td>
                      <td className="px-2 py-1.5">{inrShort(v.opening)}</td>
                      <td className="px-2 py-1.5">{inrShort(v.purchase)}</td>
                      <td className="px-2 py-1.5">{inrShort(v.ret)}</td>
                      <td className="px-2 py-1.5 text-emerald-600">{inrShort(v.paid)}</td>
                      <td className="px-2 py-1.5 font-semibold text-rose-600">{inrShort(v.outstanding)}</td>
                      <td className="px-2 py-1.5">{v.aging}d</td>
                      <td className="px-2 py-1.5">{v.aging > 60 ? <Badge variant="destructive">Overdue</Badge> : <Badge variant="secondary">OK</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>

        {/* ===================== BRANCHES TAB ===================== */}
        <TabsContent value="branches" className="space-y-4 mt-0">
          <Section title="Branch Comparison">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={branchSales.map(b => ({ ...b, profit: Math.round(b.value * 0.22), collection: Math.round(b.value * 0.85) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="branch" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", color: "hsl(var(--popover-foreground))" }} />
                <Legend />
                <Bar dataKey="value" name="Sales" fill={COLORS[0]} radius={[4,4,0,0]} />
                <Bar dataKey="profit" name="Profit" fill={COLORS[2]} radius={[4,4,0,0]} />
                <Bar dataKey="collection" name="Collection" fill={COLORS[3]} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </TabsContent>

        {/* ===================== GENERATOR OPS TAB ===================== */}
        <TabsContent value="generator-ops" className="space-y-4 mt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Generators Available" value="42" icon={Zap} />
            <Kpi label="Generators Sold (MTD)" value="18" icon={CheckCircle2} tone="success" />
            <Kpi label="Pending Delivery" value="6" icon={Truck} tone="warn" />
            <Kpi label="Installation Pending" value="4" icon={Wrench} tone="warn" />
            <Kpi label="Warranty Active" value={String(activeWar)} icon={ShieldCheck} />
            <Kpi label="Warranty Expiring 30d" value="7" icon={Clock} tone="warn" />
            <Kpi label="AMC Due" value="9" icon={ClipboardCheck} />
            <Kpi label="Open Tickets" value={String(openTickets)} icon={Wrench} tone="warn" />
          </div>
          <Section title="Trolley Booking (Detail)" right={<Button asChild size="sm"><Link to="/trolley-booking"><Truck className="h-3.5 w-3.5 mr-1" /> New Booking</Link></Button>}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b">
                  {["Booking","Customer","Mobile","Generator","kVA","Trolley","Pickup","Destination","Date","Status"].map(h=><th key={h} className="text-left px-2 py-1.5 font-medium">{h}</th>)}
                </tr></thead>
                <tbody>
                  {trolleyBookings.map(b => (
                    <tr key={b.no} className="border-b hover:bg-muted/40">
                      <td className="px-2 py-1.5 font-mono">{b.no}</td>
                      <td className="px-2 py-1.5">{b.cust}</td>
                      <td className="px-2 py-1.5">{b.mobile}</td>
                      <td className="px-2 py-1.5">{b.gen}</td>
                      <td className="px-2 py-1.5">{b.kva}</td>
                      <td className="px-2 py-1.5">{b.type}</td>
                      <td className="px-2 py-1.5">{b.from}</td>
                      <td className="px-2 py-1.5">{b.to}</td>
                      <td className="px-2 py-1.5">{b.date}</td>
                      <td className="px-2 py-1.5"><Badge>{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* -------- helpers -------- */
function PriorityDot({ p }: { p: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" }) {
  const c = p === "CRITICAL" ? "bg-rose-500" : p === "HIGH" ? "bg-amber-500" : p === "MEDIUM" ? "bg-sky-500" : "bg-slate-400";
  return <span className={cn("h-2 w-2 rounded-full shrink-0", c)} title={p} />;
}
function MiniStat({ n, l, tone }: { n: React.ReactNode; l: string; tone?: "success" | "warn" | "critical" }) {
  const c = tone === "success" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : tone === "critical" ? "text-rose-600" : "text-foreground";
  return (
    <div className="rounded border p-2">
      <div className={cn("text-lg font-bold leading-none", c)}>{n}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}
function Row({ k, v, pos, neg, tone }: { k: string; v: React.ReactNode; pos?: boolean; neg?: boolean; tone?: "success" | "warn" | "critical" }) {
  const c = tone === "success" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : tone === "critical" ? "text-rose-600" : pos ? "text-emerald-600" : neg ? "text-rose-600" : "";
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={cn("font-medium", c)}>{v}</dd>
    </div>
  );
}
function AgingBar({ rows, tone }: { rows: { bucket: string; value: number }[]; tone: "warn" | "critical" }) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  const col = tone === "critical" ? "bg-rose-500/70" : "bg-amber-500/70";
  return (
    <div className="space-y-1">
      {rows.map(r => (
        <div key={r.bucket} className="flex items-center gap-2 text-xs">
          <span className="w-16 text-muted-foreground">{r.bucket}</span>
          <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
            <div className={cn("h-full", col)} style={{ width: `${(r.value / total) * 100}%` }} />
          </div>
          <span className="w-16 text-right font-medium">{inrShort(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

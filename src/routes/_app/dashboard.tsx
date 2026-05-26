import { createFileRoute } from "@tanstack/react-router";
import {
  IndianRupee, TrendingUp, Users, ShieldCheck, Wrench, Boxes, Wallet, FileText,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { useData, inrShort } from "@/lib/store";
import { monthlySales, branchSales, productMix } from "@/lib/seed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

const COLORS = ["#1f6feb", "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function Kpi({ label, value, delta, icon: Icon, positive = true }: {
  label: string; value: string; delta?: string; icon: any; positive?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground">{label}</div>
            <div className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</div>
            {delta && (
              <div className={`mt-1 inline-flex items-center gap-1 text-xs ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {delta}
              </div>
            )}
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { invoices, customers, warranties, tickets, products } = useData();
  const totalSales = invoices.reduce((s, i) => s + i.total, 0);
  const monthRev = invoices.filter((i) => i.date.startsWith("2026-05")).reduce((s, i) => s + i.total, 0);
  const outstanding = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const collections = invoices.reduce((s, i) => s + i.paid, 0);
  const activeWar = warranties.filter((w) => w.status === "Active").length;
  const openTickets = tickets.filter((t) => t.status !== "Closed").length;
  const stockValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live overview of sales, collections, service and inventory across all branches.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total Sales" value={inrShort(totalSales)} delta="+12.4% MoM" icon={IndianRupee} />
        <Kpi label="Monthly Revenue" value={inrShort(monthRev)} delta="+8.1% MoM" icon={TrendingUp} />
        <Kpi label="Outstanding" value={inrShort(outstanding)} delta="−4.2% MoM" icon={Wallet} positive={false} />
        <Kpi label="Collections" value={inrShort(collections)} delta="+18.7% MoM" icon={FileText} />
        <Kpi label="Total Customers" value={String(customers.length)} delta="+3 this month" icon={Users} />
        <Kpi label="Active Warranty" value={String(activeWar)} icon={ShieldCheck} />
        <Kpi label="Open Service Tickets" value={String(openTickets)} delta="2 high priority" icon={Wrench} positive={false} />
        <Kpi label="Inventory Value" value={inrShort(stockValue)} icon={Boxes} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sales & Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlySales}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f6feb" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1f6feb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" unit=" L" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="sales" name="Sales (₹L)" stroke="#1f6feb" fill="url(#g1)" />
                <Area type="monotone" dataKey="revenue" name="Revenue (₹L)" stroke="#22c55e" fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Product Mix</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={productMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {productMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {productMix.map((p, i) => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="truncate text-muted-foreground">{p.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Branch-wise Sales (units this quarter)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={branchSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="branch" fontSize={12} stroke="#94a3b8" />
                <YAxis fontSize={12} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#1f6feb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { tag: "Invoice", text: "INV-2026-0001 paid by PowerLine Dealers", time: "2h ago", tone: "default" },
              { tag: "Quote", text: "QTN-2026-0003 sent to Karnataka PWD", time: "5h ago", tone: "secondary" },
              { tag: "Ticket", text: "TKT-0001 escalated — Bharat Constructions", time: "1d ago", tone: "destructive" },
              { tag: "Order", text: "SO-2026-0002 dispatched from Bengaluru WH", time: "1d ago", tone: "secondary" },
              { tag: "Customer", text: "New customer onboarded — Sundaram Hospital", time: "2d ago", tone: "default" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <Badge variant={a.tone as any} className="mt-0.5 shrink-0">{a.tag}</Badge>
                <div className="flex-1">
                  <div className="text-foreground">{a.text}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
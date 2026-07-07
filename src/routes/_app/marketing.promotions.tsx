import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Plus, Search, Upload, Image as ImageIcon, Video, Calendar, CheckCircle2,
  Download, RefreshCw, Copy, Eye, Pencil, Pause, Play, Archive, Trash2,
  LayoutGrid, List as ListIcon, Filter, TrendingUp, Clock, AlertTriangle,
  Percent, IndianRupee, Users, Ticket, ShieldCheck, X, ChevronRight,
  ChevronLeft, Star, Monitor, Tablet, Smartphone, Settings2, Megaphone,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useData, inr } from "@/lib/store";
import { useMarketingPromos, makeEmpty, nextPromoNumber, logAudit, ensureSeed } from "@/lib/marketing-promotions";
import type {
  MPromo, MPromoStatus, MPromoType, MPromoPriority, MPromoImage, MPromoVideo,
  MPromoAction, MPromoRuleGroup, MPromoCoupon,
} from "@/lib/types";

export const Route = createFileRoute("/_app/marketing/promotions")({ component: MarketingPromotionsPage });

const STATUSES: MPromoStatus[] = ["Draft","Pending Approval","Approved","Scheduled","Active","Paused","Expired","Rejected","Archived"];
const TYPES: MPromoType[] = [
  "Percentage Discount","Fixed Amount Discount","Buy X Get Y","Buy One Get One","Bundle Offer",
  "Product Discount","Category Discount","Brand Discount","Cart Value Discount","Quantity Discount",
  "Tiered Discount","First Purchase Offer","Repeat Customer Offer","Loyalty Customer Offer","Dealer Offer",
  "B2B Offer","B2C Offer","Employee Offer","Branch-Specific Offer","Festival Offer","Seasonal Offer",
  "Flash Sale","Clearance Sale","Stock Clearance","Dead Stock Promotion","Slow-Moving Stock Promotion",
  "New Product Launch","Generator + Accessory Bundle","Generator + Service Bundle","Generator + AMC Bundle",
  "Spare Parts Bundle","Free Installation Offer","Free Delivery Offer","Free Service Offer",
  "Extended Warranty Offer","Trolley Booking Offer","Coupon Code Promotion","Automatic Promotion",
  "Referral Promotion","Customer-Specific Offer","Dealer-Specific Offer","Quote-Based Promotion",
  "Invoice-Based Promotion","Payment-Mode Offer","Limited-Time Offer",
];
const PLACEMENTS = [
  "Top Announcement Bar","Navbar","Mega Menu","Home Hero","Video Hero","Featured Section",
  "Product Listing","Product Detail","Category Page","Brand Page","Cart","Checkout","Popup","Footer",
  "Dashboard","Billing","Quotation","CRM","Customer Page","Customer Portal","Dealer Portal","Supplier Portal",
];
const CHANNELS = ["E-Commerce","ERP","Dealer Portal","Customer Portal","Email","WhatsApp","SMS"];
const CUSTOMER_TYPES = ["All Customers","New Customers","Existing Customers","B2B","B2C","Dealer","VIP","High Value","Inactive","Repeat Buyer"];
const FESTIVAL_TEMPLATES = [
  { key: "pongal", name: "Pongal", discount: 8, tag: "Regional" },
  { key: "tny", name: "Tamil New Year", discount: 8, tag: "Regional" },
  { key: "republic", name: "Republic Day", discount: 10, tag: "National" },
  { key: "independence", name: "Independence Day", discount: 15, tag: "National" },
  { key: "diwali", name: "Diwali", discount: 12, tag: "Festival" },
  { key: "christmas", name: "Christmas", discount: 10, tag: "Festival" },
  { key: "newyear", name: "New Year", discount: 12, tag: "Festival" },
  { key: "monsoon", name: "Monsoon Service Campaign", discount: 15, tag: "Service" },
  { key: "summer", name: "Summer Power Campaign", discount: 10, tag: "Seasonal" },
  { key: "yearend", name: "Year-End Clearance", discount: 20, tag: "Clearance" },
  { key: "fyclose", name: "Financial Year Closing", discount: 18, tag: "Clearance" },
  { key: "dealer", name: "Dealer Campaign", discount: 12, tag: "B2B" },
  { key: "servicecamp", name: "Generator Service Camp", discount: 20, tag: "Service" },
];

function statusColor(s: MPromoStatus): string {
  if (s === "Active") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  if (s === "Scheduled") return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
  if (s === "Pending Approval") return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
  if (s === "Paused") return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
  if (s === "Draft") return "bg-muted text-muted-foreground border-border";
  if (s === "Expired" || s === "Archived") return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30";
  if (s === "Rejected") return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
  return "bg-muted text-muted-foreground";
}

function MarketingPromotionsPage() {
  const { user } = useAuth();
  const { branches } = useData();
  const uname = user?.name ?? "System";
  React.useEffect(() => { ensureSeed(uname); }, [uname]);

  const { promos, upsert, remove, archive } = useMarketingPromos();

  const [view, setView] = React.useState<"table" | "card">("table");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [branchFilter, setBranchFilter] = React.useState<string>("all");
  const [channelFilter, setChannelFilter] = React.useState<string>("all");

  const [editing, setEditing] = React.useState<MPromo | null>(null);
  const [reviewing, setReviewing] = React.useState<MPromo | null>(null);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showApprovalQueue, setShowApprovalQueue] = React.useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = React.useState(false);
  const [showTemplates, setShowTemplates] = React.useState(false);

  const filtered = React.useMemo(() => {
    return promos.filter((p) => {
      if (search && !`${p.name} ${p.headline ?? ""} ${p.code ?? ""} ${p.internalCampaign ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (branchFilter !== "all" && !p.branches.includes(branchFilter) && !p.branches.includes("ALL")) return false;
      if (channelFilter !== "all" && !p.channels.includes(channelFilter)) return false;
      return true;
    });
  }, [promos, search, statusFilter, typeFilter, branchFilter, channelFilter]);

  // KPIs
  const kpi = React.useMemo(() => {
    const now = Date.now();
    const todayStr = new Date().toISOString().slice(0, 10);
    const weekEnd = new Date(now + 7 * 86400000).toISOString().slice(0, 10);
    const active = promos.filter((p) => p.status === "Active").length;
    const scheduled = promos.filter((p) => p.status === "Scheduled").length;
    const pending = promos.filter((p) => p.status === "Pending Approval").length;
    const expiringToday = promos.filter((p) => p.status === "Active" && p.endDate === todayStr).length;
    const expiringWeek = promos.filter((p) => p.status === "Active" && p.endDate >= todayStr && p.endDate <= weekEnd).length;
    const views = promos.reduce((a, p) => a + p.stats.impressions, 0);
    const clicks = promos.reduce((a, p) => a + p.stats.clicks, 0);
    const conv = promos.reduce((a, p) => a + p.stats.orders, 0);
    const rev = promos.reduce((a, p) => a + p.stats.revenue, 0);
    const disc = promos.reduce((a, p) => a + p.stats.discountGiven, 0);
    const gp = rev - disc;
    const best = [...promos].sort((a, b) => b.stats.revenue - a.stats.revenue)[0];
    return { active, scheduled, pending, expiringToday, expiringWeek, views, clicks, conv, rev, disc, gp, best };
  }, [promos]);

  const startNew = () => setEditing(makeEmpty(nextPromoNumber(promos), uname));
  const duplicate = (p: MPromo) => {
    const copy: MPromo = { ...p, id: `mp_${Date.now()}`, number: nextPromoNumber(promos), name: p.name + " (Copy)", status: "Draft", audit: [{ at: new Date().toISOString(), user: uname, action: "Duplicated from " + p.number }], stats: { impressions: 0, uniqueViews: 0, clicks: 0, addToCart: 0, checkoutStarted: 0, orders: 0, revenue: 0, discountGiven: 0, unitsSold: 0 } };
    upsert(copy); toast.success(`Duplicated as ${copy.number}`);
  };
  const togglePause = (p: MPromo) => {
    const next = p.status === "Active" ? "Paused" : (p.status === "Paused" ? "Active" : p.status);
    if (next === p.status) return toast.info("Only Active/Paused promotions can be toggled");
    upsert(logAudit({ ...p, status: next as MPromoStatus }, { user: uname, action: next === "Paused" ? "Paused" : "Resumed" }));
    toast.success(`Promotion ${next.toLowerCase()}`);
  };
  const doArchive = (p: MPromo) => { archive(p.id); toast.success("Archived"); };
  const doRemove = (p: MPromo) => {
    if (p.stats.orders > 0) return toast.error("Cannot delete — this promotion has historical orders. Archive instead.");
    if (!confirm(`Permanently delete ${p.number}? This cannot be undone.`)) return;
    remove(p.id); toast.success("Deleted");
  };
  const publish = (p: MPromo) => {
    const today = new Date().toISOString().slice(0, 10);
    const next: MPromoStatus = p.startDate > today ? "Scheduled" : "Active";
    upsert(logAudit({ ...p, status: next, publishedAt: new Date().toISOString() }, { user: uname, action: "Published" }));
    toast.success(`Promotion ${next.toLowerCase()}`);
    setEditing(null);
  };
  const submitForApproval = (p: MPromo) => {
    upsert(logAudit({ ...p, status: "Pending Approval" }, { user: uname, action: "Submitted for approval" }));
    toast.success("Submitted for approval");
    setEditing(null);
  };
  const exportCsv = () => {
    const rows = [["Number","Name","Type","Status","Start","End","Views","Clicks","Orders","Revenue","Discount"]];
    filtered.forEach((p) => rows.push([p.number, p.name, p.type, p.status, p.startDate, p.endDate, String(p.stats.impressions), String(p.stats.clicks), String(p.stats.orders), String(p.stats.revenue), String(p.stats.discountGiven)]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "promotions.csv"; a.click();
  };

  return (
    <div>
      <PageHeader title="Promotions & Campaigns" description="Command center for marketing promotions, coupons, media, approvals and analytics.">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowCalendar(true)}><Calendar className="mr-1.5 h-3.5 w-3.5" /> Calendar</Button>
          <Button size="sm" variant="outline" onClick={() => setShowApprovalQueue(true)}><ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Approvals ({kpi.pending})</Button>
          <Button size="sm" variant="outline" onClick={() => setShowMediaLibrary(true)}><ImageIcon className="mr-1.5 h-3.5 w-3.5" /> Media Library</Button>
          <Button size="sm" variant="outline" onClick={() => setShowTemplates(true)}><Megaphone className="mr-1.5 h-3.5 w-3.5" /> Templates</Button>
          <Button size="sm" variant="outline" onClick={exportCsv}><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" variant="outline" onClick={() => window.dispatchEvent(new Event("mpromo:changed"))}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh</Button>
          <Button size="sm" onClick={startNew}><Plus className="mr-1.5 h-3.5 w-3.5" /> Create Promotion</Button>
        </div>
      </PageHeader>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <KpiCard label="Active" value={kpi.active} icon={Play} onClick={() => setStatusFilter("Active")} accent="emerald" />
        <KpiCard label="Scheduled" value={kpi.scheduled} icon={Calendar} onClick={() => setStatusFilter("Scheduled")} accent="blue" />
        <KpiCard label="Pending Approval" value={kpi.pending} icon={ShieldCheck} onClick={() => setStatusFilter("Pending Approval")} accent="amber" />
        <KpiCard label="Expiring Today" value={kpi.expiringToday} icon={Clock} onClick={() => setStatusFilter("Active")} accent="red" />
        <KpiCard label="Expiring 7 Days" value={kpi.expiringWeek} icon={AlertTriangle} onClick={() => setStatusFilter("Active")} accent="yellow" />
        <KpiCard label="Impressions" value={kpi.views.toLocaleString("en-IN")} icon={Eye} accent="slate" />
        <KpiCard label="Clicks" value={kpi.clicks.toLocaleString("en-IN")} icon={TrendingUp} accent="slate" />
        <KpiCard label="Orders" value={kpi.conv} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Revenue" value={inr(kpi.rev)} icon={IndianRupee} accent="emerald" />
        <KpiCard label="Discount Given" value={inr(kpi.disc)} icon={Percent} accent="amber" />
        <KpiCard label="Gross Profit Impact" value={inr(kpi.gp)} icon={TrendingUp} accent="blue" />
        <KpiCard label="Best Campaign" value={kpi.best?.name.slice(0, 18) ?? "—"} icon={Star} accent="yellow" onClick={() => kpi.best && setReviewing(kpi.best)} />
      </div>

      {/* Filters */}
      <Card className="p-3 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="pl-7 h-8" placeholder="Search name, code, campaign…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[150px]"><Filter className="h-3.5 w-3.5 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Status</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent className="max-h-72"><SelectItem value="all">All Types</SelectItem>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="h-8 w-[150px]"><SelectValue placeholder="Branch" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Branches</SelectItem><SelectItem value="ALL">All-Branch Promos</SelectItem>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="h-8 w-[150px]"><SelectValue placeholder="Channel" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Channels</SelectItem>{CHANNELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <div className="ml-auto flex rounded-md border p-0.5">
            <button onClick={() => setView("table")} className={"px-2 py-1 rounded text-xs " + (view === "table" ? "bg-muted" : "")}><ListIcon className="h-3.5 w-3.5" /></button>
            <button onClick={() => setView("card")} className={"px-2 py-1 rounded text-xs " + (view === "card" ? "bg-muted" : "")}><LayoutGrid className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </Card>

      {view === "table" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promotion #</TableHead><TableHead>Name</TableHead>
                  <TableHead>Type</TableHead><TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead><TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Views</TableHead><TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.number}</TableCell>
                    <TableCell>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.internalCampaign ?? "—"} {p.code && `· ${p.code}`}</div>
                    </TableCell>
                    <TableCell className="text-xs">{p.type}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(p.status)}>{p.status}</Badge></TableCell>
                    <TableCell className="text-xs">{p.startDate} → {p.endDate}</TableCell>
                    <TableCell className="text-right text-xs font-medium">{describeAction(p.actions[0])}</TableCell>
                    <TableCell className="text-right text-xs">{p.stats.impressions.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right text-xs">{p.stats.orders}</TableCell>
                    <TableCell className="text-right text-xs font-mono">{inr(p.stats.revenue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <IconBtn title="Review" onClick={() => setReviewing(p)}><Eye className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title="Edit" onClick={() => setEditing(p)}><Pencil className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title="Duplicate" onClick={() => duplicate(p)}><Copy className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title={p.status === "Active" ? "Pause" : "Resume"} onClick={() => togglePause(p)}>
                          {p.status === "Active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </IconBtn>
                        <IconBtn title="Archive" onClick={() => doArchive(p)}><Archive className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title="Delete" onClick={() => doRemove(p)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></IconBtn>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-10">No promotions match filters</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] bg-muted flex items-center justify-center">
                {p.images[0] ? <img src={p.images[0].url} alt={p.images[0].alt} className="w-full h-full object-cover" /> : <ImageIcon className="h-10 w-10 text-muted-foreground" />}
                {p.videos.length > 0 && <div className="absolute top-2 right-2 bg-background/80 rounded px-1.5 py-0.5 text-xs flex items-center gap-1"><Video className="h-3 w-3" />Video</div>}
                <Badge variant="outline" className={"absolute top-2 left-2 " + statusColor(p.status)}>{p.status}</Badge>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div>
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.type}</div>
                </div>
                <div className="text-xs text-muted-foreground">{p.startDate} → {p.endDate}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-600">{inr(p.stats.revenue)}</span>
                  <span>{describeAction(p.actions[0])}</span>
                </div>
                <div className="flex gap-1 mt-auto pt-2 border-t">
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs" onClick={() => setReviewing(p)}>Review</Button>
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs" onClick={() => setEditing(p)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => duplicate(p)}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-muted-foreground py-10">No promotions match filters</div>}
        </div>
      )}

      {editing && <PromoWizard promo={editing} onClose={() => setEditing(null)}
        onSaveDraft={(p) => { upsert(logAudit(p, { user: uname, action: "Draft saved" })); toast.success("Draft saved"); }}
        onSubmit={submitForApproval} onPublish={publish}
        branches={branches} />}

      {reviewing && <PromoReview promo={reviewing} onClose={() => setReviewing(null)}
        onEdit={() => { setEditing(reviewing); setReviewing(null); }}
        onApprove={(p, level) => { const approvals = p.approvals.map((a) => a.level === level ? { ...a, decision: "Approved" as const, approver: uname, at: new Date().toISOString() } : a); const allApproved = approvals.every((a) => a.decision === "Approved"); const status: MPromoStatus = allApproved ? "Approved" : p.status; upsert(logAudit({ ...p, approvals, status }, { user: uname, action: `Approved L${level}` })); toast.success(`Level ${level} approved`); setReviewing({ ...p, approvals, status }); }}
        onReject={(p, level, reason) => { const approvals = p.approvals.map((a) => a.level === level ? { ...a, decision: "Rejected" as const, approver: uname, at: new Date().toISOString(), remarks: reason } : a); upsert(logAudit({ ...p, approvals, status: "Rejected" }, { user: uname, action: `Rejected L${level}`, reason })); toast.error("Rejected"); setReviewing({ ...p, approvals, status: "Rejected" }); }}
      />}

      {showCalendar && <CampaignCalendar promos={promos} onClose={() => setShowCalendar(false)} onPick={(p) => { setShowCalendar(false); setReviewing(p); }} />}
      {showApprovalQueue && <ApprovalQueue promos={promos.filter((p) => p.status === "Pending Approval")} onClose={() => setShowApprovalQueue(false)} onOpen={(p) => { setShowApprovalQueue(false); setReviewing(p); }} />}
      {showMediaLibrary && <MediaLibrary promos={promos} onClose={() => setShowMediaLibrary(false)} />}
      {showTemplates && <FestivalTemplates onClose={() => setShowTemplates(false)} onPick={(t) => {
        const p = makeEmpty(nextPromoNumber(promos), uname);
        p.name = t.name + " Campaign"; p.type = "Festival Offer"; p.headline = `Special ${t.name} discount ${t.discount}%`;
        p.actions = [{ kind: "Percentage Off", value: t.discount }]; p.internalCampaign = t.name;
        setShowTemplates(false); setEditing(p);
      }} />}
    </div>
  );
}

/* ---------- Small UI helpers ---------- */
function IconBtn({ children, onClick, title }: any) {
  return <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClick} title={title}>{children}</Button>;
}
function KpiCard({ label, value, icon: Icon, onClick, accent = "slate" }: any) {
  const map: Record<string, string> = {
    emerald: "text-emerald-600", blue: "text-blue-600", amber: "text-amber-600",
    red: "text-red-600", yellow: "text-yellow-600", slate: "text-muted-foreground",
  };
  return (
    <Card className={"p-3 " + (onClick ? "cursor-pointer hover:border-primary/50 transition-colors" : "")} onClick={onClick}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{label}</div>
          <div className="text-lg font-bold mt-0.5 truncate">{value}</div>
        </div>
        {Icon && <Icon className={"h-4 w-4 shrink-0 " + map[accent]} />}
      </div>
    </Card>
  );
}
function describeAction(a?: MPromoAction): string {
  if (!a) return "—";
  if (a.kind === "Percentage Off") return `${a.value ?? 0}% off`;
  if (a.kind === "Fixed Amount Off") return `${inr(a.value ?? 0)} off`;
  if (a.kind === "Fixed Price") return `Price ${inr(a.value ?? 0)}`;
  if (a.kind === "Buy X Get Y") return `Buy ${a.buyQty} Get ${a.getQty}`;
  if (a.kind === "Tiered Discount") return `Tiered ${a.tiers?.length ?? 0} slabs`;
  return a.kind;
}

/* ---------- Create/Edit multi-step Wizard ---------- */
const STEPS = [
  "Basic Info","Type","Products & Eligibility","Discount Rules","Media",
  "Placement & Channels","Schedule","Audience","Budget & Limits",
  "Preview","Approval","Publish",
];

function PromoWizard({ promo, onClose, onSaveDraft, onSubmit, onPublish, branches }: {
  promo: MPromo; onClose: () => void;
  onSaveDraft: (p: MPromo) => void; onSubmit: (p: MPromo) => void; onPublish: (p: MPromo) => void;
  branches: any[];
}) {
  const [p, setP] = React.useState<MPromo>(promo);
  const [step, setStep] = React.useState(0);
  const set = <K extends keyof MPromo>(k: K, v: MPromo[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  // Margin calc
  const marginBefore = p.sellingPrice && p.costPrice ? ((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100 : null;
  const promoPrice = p.actions[0]?.kind === "Percentage Off" && p.sellingPrice ? p.sellingPrice * (1 - (p.actions[0].value ?? 0) / 100) : p.actions[0]?.kind === "Fixed Amount Off" && p.sellingPrice ? p.sellingPrice - (p.actions[0].value ?? 0) : p.promoPrice ?? null;
  const marginAfter = promoPrice && p.costPrice ? ((promoPrice - p.costPrice) / promoPrice) * 100 : null;
  const belowCost = promoPrice && p.costPrice && promoPrice < p.costPrice;
  const belowMinMargin = marginAfter !== null && marginAfter < 10;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{p.number} · {p.name || "New Promotion"}</DialogTitle>
          <DialogDescription>Step {step + 1} of {STEPS.length}: {STEPS[step]}</DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="shrink-0 overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-max">
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => setStep(i)} className={"px-2 py-1 text-xs rounded whitespace-nowrap border " + (i === step ? "bg-primary text-primary-foreground border-primary" : i < step ? "bg-muted text-foreground" : "text-muted-foreground")}>
                {i + 1}. {s}
              </button>
            ))}
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-1 mt-2" />
        </div>

        <div className="flex-1 overflow-y-auto py-2 pr-1">
          {step === 0 && <StepBasic p={p} set={set} />}
          {step === 1 && <StepType p={p} set={set} />}
          {step === 2 && <StepEligibility p={p} set={set} branches={branches} />}
          {step === 3 && <StepRules p={p} set={set} marginAfter={marginAfter} marginBefore={marginBefore} belowCost={belowCost} belowMinMargin={belowMinMargin} promoPrice={promoPrice} />}
          {step === 4 && <StepMedia p={p} setP={setP} />}
          {step === 5 && <StepPlacement p={p} set={set} />}
          {step === 6 && <StepSchedule p={p} set={set} />}
          {step === 7 && <StepAudience p={p} set={set} />}
          {step === 8 && <StepBudget p={p} set={set} />}
          {step === 9 && <StepPreview p={p} />}
          {step === 10 && <StepApproval p={p} belowMinMargin={belowMinMargin} belowCost={belowCost} />}
          {step === 11 && <StepPublish p={p} onPublish={() => onPublish(p)} />}
        </div>

        <DialogFooter className="shrink-0 border-t pt-3 flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onSaveDraft(p)}>Save Draft</Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={prev} disabled={step === 0}><ChevronLeft className="h-3.5 w-3.5 mr-1" />Previous</Button>
          {step < STEPS.length - 1 && <Button size="sm" onClick={next}>Next<ChevronRight className="h-3.5 w-3.5 ml-1" /></Button>}
          {step === STEPS.length - 2 && <Button size="sm" onClick={() => onSubmit(p)}><ShieldCheck className="h-3.5 w-3.5 mr-1" />Submit for Approval</Button>}
          {step === STEPS.length - 1 && <Button size="sm" onClick={() => onPublish(p)}><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Publish</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StepBasic({ p, set }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Promotion Name *"><Input value={p.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Internal Campaign Name"><Input value={p.internalCampaign ?? ""} onChange={(e) => set("internalCampaign", e.target.value)} /></Field>
      <Field label="Promotion Code"><Input value={p.code ?? ""} onChange={(e) => set("code", e.target.value.toUpperCase())} /></Field>
      <Field label="Campaign ID"><Input value={p.campaignId ?? ""} onChange={(e) => set("campaignId", e.target.value)} /></Field>
      <Field label="Public Headline"><Input value={p.headline ?? ""} onChange={(e) => set("headline", e.target.value)} /></Field>
      <Field label="Short Title"><Input value={p.shortTitle ?? ""} onChange={(e) => set("shortTitle", e.target.value)} /></Field>
      <Field label="Subtitle" className="md:col-span-2"><Input value={p.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></Field>
      <Field label="Short Description" className="md:col-span-2"><Textarea rows={2} value={p.shortDesc ?? ""} onChange={(e) => set("shortDesc", e.target.value)} /></Field>
      <Field label="Full Description" className="md:col-span-2"><Textarea rows={4} value={p.fullDesc ?? ""} onChange={(e) => set("fullDesc", e.target.value)} /></Field>
      <Field label="Internal Notes" className="md:col-span-2"><Textarea rows={2} value={p.internalNotes ?? ""} onChange={(e) => set("internalNotes", e.target.value)} /></Field>
      <Field label="Terms & Conditions" className="md:col-span-2"><Textarea rows={3} value={p.terms ?? ""} onChange={(e) => set("terms", e.target.value)} /></Field>
      <Field label="Tags (comma-separated)" className="md:col-span-2">
        <Input value={p.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} />
      </Field>
      <Field label="Priority">
        <Select value={p.priority} onValueChange={(v) => set("priority", v as MPromoPriority)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{(["Critical","High","Medium","Low"] as MPromoPriority[]).map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Status">
        <Select value={p.status} onValueChange={(v) => set("status", v as MPromoStatus)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{STATUSES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
    </div>
  );
}

function StepType({ p, set }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Promotion Type" className="md:col-span-2">
        <Select value={p.type} onValueChange={(v) => set("type", v as MPromoType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-80">{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2">
        {TYPES.slice(0, 24).map((t) => (
          <button key={t} onClick={() => set("type", t as MPromoType)} className={"text-left rounded border p-2 text-xs hover:bg-muted transition " + (p.type === t ? "border-primary bg-primary/5" : "")}>
            <div className="font-medium">{t}</div>
          </button>
        ))}
      </div>
      <Field label="Automatic Promotion" className="md:col-span-2">
        <div className="flex items-center gap-2"><Switch checked={p.isAutomatic} onCheckedChange={(v) => set("isAutomatic", v)} /><span className="text-sm text-muted-foreground">Apply automatically without coupon code</span></div>
      </Field>
    </div>
  );
}

function StepEligibility({ p, set, branches }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <MultiChips label="Branches" values={p.branches} onChange={(v: string[]) => set("branches", v)} options={["ALL", ...branches.map((b: any) => b.id)]} labelMap={{ ALL: "All Branches", ...Object.fromEntries(branches.map((b: any) => [b.id, b.name])) }} />
      <MultiChips label="Customer Types" values={p.customerTypes} onChange={(v: string[]) => set("customerTypes", v)} options={CUSTOMER_TYPES} />
      <Field label="Products (comma-separated SKUs)"><Textarea rows={2} value={p.products.join(", ")} onChange={(e) => set("products", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></Field>
      <Field label="Categories (comma)"><Textarea rows={2} value={p.categories.join(", ")} onChange={(e) => set("categories", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></Field>
      <Field label="Brands (comma)"><Textarea rows={2} value={p.brands.join(", ")} onChange={(e) => set("brands", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></Field>
      <Field label="States"><Textarea rows={2} value={p.states.join(", ")} onChange={(e) => set("states", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></Field>
      <div className="md:col-span-2 border-t pt-2 mt-2">
        <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Generator-specific</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="kVA Min"><Input type="number" value={p.kvaMin ?? ""} onChange={(e) => set("kvaMin", e.target.value ? +e.target.value : undefined)} /></Field>
          <Field label="kVA Max"><Input type="number" value={p.kvaMax ?? ""} onChange={(e) => set("kvaMax", e.target.value ? +e.target.value : undefined)} /></Field>
          <Field label="Fuel Type">
            <Select value={p.fuelType ?? ""} onValueChange={(v) => set("fuelType", v)}>
              <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Petrol">Petrol</SelectItem><SelectItem value="Gas">Gas</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Phase">
            <Select value={p.phase ?? ""} onValueChange={(v) => set("phase", v)}>
              <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
              <SelectContent><SelectItem value="Single">Single</SelectItem><SelectItem value="Three">Three</SelectItem></SelectContent>
            </Select>
          </Field>
        </div>
      </div>
    </div>
  );
}

function StepRules({ p, set, marginBefore, marginAfter, belowCost, belowMinMargin, promoPrice }: any) {
  const addGroup = () => set("rules", [...p.rules, { id: `g_${Date.now()}`, joiner: "AND", conditions: [{ id: `c_${Date.now()}`, field: "Cart Value", op: ">=", value: "100000" }] } as MPromoRuleGroup]);
  const setAction0 = (patch: Partial<MPromoAction>) => set("actions", [{ ...p.actions[0], ...patch }, ...p.actions.slice(1)]);
  return (
    <div className="space-y-4">
      <Card className="p-3">
        <div className="text-xs font-semibold uppercase mb-2">Discount Action</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Action">
            <Select value={p.actions[0]?.kind ?? "Percentage Off"} onValueChange={(v) => setAction0({ kind: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Percentage Off","Fixed Amount Off","Fixed Price","Buy X Get Y","Free Item","Free Accessory","Free Installation","Free Delivery","Free Service","Extended Warranty","Bundle Price","Tiered Discount"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          {p.actions[0]?.kind !== "Buy X Get Y" && p.actions[0]?.kind !== "Tiered Discount" && (
            <Field label={p.actions[0]?.kind === "Percentage Off" ? "%" : "Amount (₹)"}>
              <Input type="number" value={p.actions[0]?.value ?? ""} onChange={(e) => setAction0({ value: +e.target.value })} />
            </Field>
          )}
          {p.actions[0]?.kind === "Buy X Get Y" && (
            <>
              <Field label="Buy Qty"><Input type="number" value={p.actions[0]?.buyQty ?? 1} onChange={(e) => setAction0({ buyQty: +e.target.value })} /></Field>
              <Field label="Get Qty Free"><Input type="number" value={p.actions[0]?.getQty ?? 1} onChange={(e) => setAction0({ getQty: +e.target.value })} /></Field>
            </>
          )}
          <Field label="Stacking Rule">
            <Select value={p.stacking} onValueChange={(v) => set("stacking", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Allow Stack","Do Not Stack","Best Discount Only","Priority Promotion","Owner Override"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold uppercase">Rule Engine (IF → THEN)</div>
          <Button size="sm" variant="outline" onClick={addGroup}><Plus className="h-3.5 w-3.5 mr-1" />Add Condition Group</Button>
        </div>
        {p.rules.length === 0 && <div className="text-xs text-muted-foreground py-4 text-center">Add condition groups to make the promotion conditional. Otherwise it applies to all matching products.</div>}
        <div className="space-y-2">
          {p.rules.map((g: MPromoRuleGroup, gi: number) => (
            <div key={g.id} className="border rounded p-2 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Select value={g.joiner} onValueChange={(v) => { const rr = [...p.rules]; rr[gi] = { ...g, joiner: v as any }; set("rules", rr); }}>
                  <SelectTrigger className="h-7 w-20 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="AND">AND</SelectItem><SelectItem value="OR">OR</SelectItem></SelectContent>
                </Select>
                <Button size="sm" variant="ghost" className="h-7 ml-auto" onClick={() => set("rules", p.rules.filter((x: any, i: number) => i !== gi))}><X className="h-3.5 w-3.5" /></Button>
              </div>
              {g.conditions.map((c, ci) => (
                <div key={c.id} className="grid grid-cols-12 gap-1 mb-1">
                  <Select value={c.field} onValueChange={(v) => { const rr = [...p.rules]; rr[gi].conditions[ci] = { ...c, field: v }; set("rules", rr); }}>
                    <SelectTrigger className="col-span-5 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-64">{["Product","Product Category","Brand","SKU","HSN","Generator kVA","Generator Model","Quantity","Cart Value","Customer","Customer Type","Customer Segment","Dealer","Branch","State","Date","Day of Week","Time","First Purchase","Previous Purchase Count","Lifetime Value","Payment Mode","Coupon Code","Stock Level","Slow Moving Status","Dead Stock Status"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={c.op} onValueChange={(v) => { const rr = [...p.rules]; rr[gi].conditions[ci] = { ...c, op: v }; set("rules", rr); }}>
                    <SelectTrigger className="col-span-2 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{["=","!=",">=","<=",">","<","in","contains"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input className="col-span-4 h-7 text-xs" value={c.value} onChange={(e) => { const rr = [...p.rules]; rr[gi].conditions[ci] = { ...c, value: e.target.value }; set("rules", rr); }} />
                  <Button size="icon" variant="ghost" className="col-span-1 h-7 w-7" onClick={() => { const rr = [...p.rules]; rr[gi].conditions = rr[gi].conditions.filter((_, i) => i !== ci); set("rules", rr); }}><X className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { const rr = [...p.rules]; rr[gi].conditions.push({ id: `c_${Date.now()}`, field: "Product", op: "=", value: "" }); set("rules", rr); }}><Plus className="h-3 w-3 mr-1" />Add condition</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Coupons */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold uppercase">Coupons</div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => set("coupons", [...p.coupons, { id: `c_${Date.now()}`, code: `PROMO${Math.floor(Math.random()*9000)+1000}`, used: 0 } as MPromoCoupon])}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
            <Button size="sm" variant="outline" onClick={() => { const codes = Array.from({ length: 10 }, (_, i) => ({ id: `c_${Date.now()}_${i}`, code: `BULK${Date.now().toString().slice(-5)}${i}`, used: 0 } as MPromoCoupon)); set("coupons", [...p.coupons, ...codes]); toast.success("Bulk generated 10 coupons"); }}>Bulk 10</Button>
          </div>
        </div>
        {p.coupons.length === 0 ? <div className="text-xs text-muted-foreground py-2">No coupons — this promotion applies automatically.</div> : (
          <div className="space-y-1">
            {p.coupons.map((c: MPromoCoupon, i: number) => (
              <div key={c.id} className="flex items-center gap-2 text-xs">
                <code className="px-2 py-1 bg-muted rounded font-mono">{c.code}</code>
                <Input className="h-7 w-24" type="number" placeholder="Limit" value={c.usageLimit ?? ""} onChange={(e) => { const cc = [...p.coupons]; cc[i] = { ...c, usageLimit: e.target.value ? +e.target.value : undefined }; set("coupons", cc); }} />
                <span className="text-muted-foreground">used {c.used}</span>
                <div className="flex-1" />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { navigator.clipboard.writeText(c.code); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => set("coupons", p.coupons.filter((_: any, x: number) => x !== i))}><X className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Margin protection */}
      <Card className="p-3">
        <div className="text-xs font-semibold uppercase mb-2">Margin Protection</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="Cost Price (₹)"><Input type="number" value={p.costPrice ?? ""} onChange={(e) => set("costPrice", e.target.value ? +e.target.value : undefined)} /></Field>
          <Field label="Selling Price (₹)"><Input type="number" value={p.sellingPrice ?? ""} onChange={(e) => set("sellingPrice", e.target.value ? +e.target.value : undefined)} /></Field>
          <Field label="Promo Price"><Input value={promoPrice ? inr(promoPrice) : "—"} disabled /></Field>
        </div>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <StatBadge label="Margin Before" value={marginBefore !== null ? marginBefore.toFixed(1) + "%" : "—"} />
          <StatBadge label="Margin After" value={marginAfter !== null ? marginAfter.toFixed(1) + "%" : "—"} tone={belowMinMargin ? "warn" : "ok"} />
          {belowCost && <div className="col-span-2 rounded border border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300 p-2 font-medium">⚠ BELOW COST — Owner approval required</div>}
          {!belowCost && belowMinMargin && <div className="col-span-2 rounded border border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 p-2 font-medium">⚠ BELOW MINIMUM MARGIN (10%) — Owner approval required</div>}
        </div>
      </Card>
    </div>
  );
}

function StepMedia({ p, setP }: any) {
  const addImage = async (files: FileList | null, usage: MPromoImage["usage"] = "Desktop Hero Banner") => {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) { toast.error(`${f.name}: not an image`); continue; }
      if (f.size > 8 * 1024 * 1024) { toast.error(`${f.name}: exceeds 8MB`); continue; }
      const url = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); });
      const img: MPromoImage = { id: `img_${Date.now()}_${Math.random()}`, url, name: f.name, size: f.size, format: f.type.split("/")[1] ?? "png", alt: p.name || f.name, usage, uploadedBy: p.createdBy, uploadedAt: new Date().toISOString(), primary: p.images.length === 0 };
      setP((cur: MPromo) => ({ ...cur, images: [...cur.images, img] }));
    }
  };
  const addVideo = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("video/")) { toast.error(`${f.name}: not a video`); continue; }
      if (f.size > 50 * 1024 * 1024) { toast.error(`${f.name}: exceeds 50MB`); continue; }
      const url = await new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); });
      const v: MPromoVideo = { id: `vid_${Date.now()}`, url, source: "upload", title: f.name, size: f.size, format: f.type.split("/")[1] ?? "mp4", uploadedBy: p.createdBy, uploadedAt: new Date().toISOString(), autoplay: false, muted: true, loop: false, showControls: true, playOnce: false, pauseOutOfView: true, mobileEnabled: true, desktopEnabled: true, lazyLoad: true, placement: ["Home Hero"] };
      setP((cur: MPromo) => ({ ...cur, videos: [...cur.videos, v] }));
    }
  };
  const [ytUrl, setYtUrl] = React.useState("");

  return (
    <div className="space-y-4">
      <Card className="p-3">
        <div className="text-xs font-semibold uppercase mb-2 flex items-center justify-between">Images ({p.images.length})
          <label className="cursor-pointer inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <Upload className="h-3.5 w-3.5" /> Add images
            <input type="file" accept="image/*" multiple hidden onChange={(e) => addImage(e.target.files)} />
          </label>
        </div>
        <div className="border-2 border-dashed rounded p-6 text-center text-xs text-muted-foreground" onDrop={(e) => { e.preventDefault(); addImage(e.dataTransfer.files); }} onDragOver={(e) => e.preventDefault()}>
          Drag & drop images here · JPG/PNG/WEBP/SVG · Max 8MB each
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {p.images.map((img: MPromoImage, i: number) => (
            <div key={img.id} className="border rounded overflow-hidden">
              <div className="aspect-video bg-muted"><img src={img.url} alt={img.alt} className="w-full h-full object-cover" /></div>
              <div className="p-2 space-y-1">
                <div className="text-xs font-medium truncate">{img.name}</div>
                <Input className="h-7 text-xs" placeholder="Alt text (required)" value={img.alt} onChange={(e) => { const im = [...p.images]; im[i] = { ...img, alt: e.target.value }; setP({ ...p, images: im }); }} />
                <Select value={img.usage} onValueChange={(v) => { const im = [...p.images]; im[i] = { ...img, usage: v as any }; setP({ ...p, images: im }); }}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64">{["Desktop Hero Banner","Mobile Hero Banner","Tablet Banner","Promotion Card","Product Offer Badge","Category Banner","Mega Menu Banner","Popup Image","Sidebar Banner","Dashboard Banner","Email Banner","Social Preview Image","Trolley Booking Promotion","Dealer Portal Banner"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 text-xs px-1 flex-1" onClick={() => setP({ ...p, images: p.images.map((x: any, xi: number) => ({ ...x, primary: xi === i })) })}>{img.primary ? "★ Primary" : "Set Primary"}</Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setP({ ...p, images: p.images.filter((_: any, xi: number) => xi !== i) })}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-xs font-semibold uppercase mb-2 flex items-center justify-between">Videos ({p.videos.length})
          <label className="cursor-pointer inline-flex items-center gap-1 text-xs text-primary hover:underline">
            <Upload className="h-3.5 w-3.5" /> Upload video
            <input type="file" accept="video/mp4,video/webm" hidden onChange={(e) => addVideo(e.target.files)} />
          </label>
        </div>
        <div className="border-2 border-dashed rounded p-6 text-center text-xs text-muted-foreground" onDrop={(e) => { e.preventDefault(); addVideo(e.dataTransfer.files); }} onDragOver={(e) => e.preventDefault()}>
          Drag & drop MP4/WEBM · Max 50MB
        </div>
        <div className="flex gap-2 mt-2">
          <Input placeholder="Or paste YouTube / Vimeo URL" className="h-8 text-xs" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} />
          <Button size="sm" onClick={() => { if (!ytUrl) return; const v: MPromoVideo = { id: `vid_${Date.now()}`, url: ytUrl, source: ytUrl.includes("vimeo") ? "vimeo" : "youtube", title: "External Video", uploadedBy: p.createdBy, uploadedAt: new Date().toISOString(), autoplay: false, muted: true, loop: false, showControls: true, playOnce: false, pauseOutOfView: true, mobileEnabled: true, desktopEnabled: true, lazyLoad: true, placement: ["Home Hero"] }; setP({ ...p, videos: [...p.videos, v] }); setYtUrl(""); }}>Add</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {p.videos.map((v: MPromoVideo, i: number) => (
            <div key={v.id} className="border rounded p-2 space-y-2">
              <div className="aspect-video bg-black rounded overflow-hidden">
                {v.source === "upload" ? <video src={v.url} controls={v.showControls} muted={v.muted} loop={v.loop} className="w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-white text-xs">External {v.source} video</div>}
              </div>
              <Input className="h-7 text-xs" placeholder="Title" value={v.title} onChange={(e) => { const vv = [...p.videos]; vv[i] = { ...v, title: e.target.value }; setP({ ...p, videos: vv }); }} />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-1"><Switch checked={v.autoplay} onCheckedChange={(x) => { const vv = [...p.videos]; vv[i] = { ...v, autoplay: x }; setP({ ...p, videos: vv }); }} />Autoplay</label>
                <label className="flex items-center gap-1"><Switch checked={v.muted} onCheckedChange={(x) => { const vv = [...p.videos]; vv[i] = { ...v, muted: x }; setP({ ...p, videos: vv }); }} />Muted</label>
                <label className="flex items-center gap-1"><Switch checked={v.loop} onCheckedChange={(x) => { const vv = [...p.videos]; vv[i] = { ...v, loop: x }; setP({ ...p, videos: vv }); }} />Loop</label>
                <label className="flex items-center gap-1"><Switch checked={v.showControls} onCheckedChange={(x) => { const vv = [...p.videos]; vv[i] = { ...v, showControls: x }; setP({ ...p, videos: vv }); }} />Controls</label>
                <label className="flex items-center gap-1"><Switch checked={v.lazyLoad} onCheckedChange={(x) => { const vv = [...p.videos]; vv[i] = { ...v, lazyLoad: x }; setP({ ...p, videos: vv }); }} />Lazy load</label>
                <label className="flex items-center gap-1"><Switch checked={v.pauseOutOfView} onCheckedChange={(x) => { const vv = [...p.videos]; vv[i] = { ...v, pauseOutOfView: x }; setP({ ...p, videos: vv }); }} />Pause off-screen</label>
              </div>
              <Button size="sm" variant="ghost" className="h-7 text-xs w-full" onClick={() => setP({ ...p, videos: p.videos.filter((_: any, xi: number) => xi !== i) })}><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StepPlacement({ p, set }: any) {
  return (
    <div className="space-y-4">
      <MultiChips label="Placements" values={p.placements} onChange={(v: string[]) => set("placements", v)} options={PLACEMENTS} />
      <MultiChips label="Channels" values={p.channels} onChange={(v: string[]) => set("channels", v)} options={CHANNELS} />
    </div>
  );
}

function StepSchedule({ p, set }: any) {
  const now = Date.now();
  const startMs = new Date(p.startDate).getTime();
  const endMs = new Date(p.endDate).getTime();
  const startsIn = Math.max(0, Math.round((startMs - now) / 86400000));
  const endsIn = Math.max(0, Math.round((endMs - now) / 86400000));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Start Date"><Input type="date" value={p.startDate} onChange={(e) => set("startDate", e.target.value)} /></Field>
      <Field label="End Date"><Input type="date" value={p.endDate} onChange={(e) => set("endDate", e.target.value)} /></Field>
      <Field label="Start Time"><Input type="time" value={p.startTime ?? ""} onChange={(e) => set("startTime", e.target.value)} /></Field>
      <Field label="End Time"><Input type="time" value={p.endTime ?? ""} onChange={(e) => set("endTime", e.target.value)} /></Field>
      <Field label="Timezone">
        <Select value={p.timezone ?? "Asia/Kolkata"} onValueChange={(v) => set("timezone", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem><SelectItem value="UTC">UTC</SelectItem></SelectContent>
        </Select>
      </Field>
      <Field label="Repeat">
        <Select value={p.repeat} onValueChange={(v) => set("repeat", v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{["Never","Daily","Weekly","Monthly","Custom"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Card className="md:col-span-2 p-3 grid grid-cols-2 gap-3">
        <StatBadge label="Starts In" value={startsIn + " days"} />
        <StatBadge label="Ends In" value={endsIn + " days"} tone={endsIn <= 3 ? "warn" : "ok"} />
      </Card>
    </div>
  );
}

function StepAudience({ p, set }: any) {
  return (
    <div className="space-y-4">
      <MultiChips label="Customer Types" values={p.customerTypes} onChange={(v: string[]) => set("customerTypes", v)} options={CUSTOMER_TYPES} />
      <Field label="Customer Segments (comma)"><Textarea rows={2} value={p.customerSegments.join(", ")} onChange={(e) => set("customerSegments", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></Field>
      <Field label="Specific Customer IDs (comma)"><Textarea rows={2} value={p.customers.join(", ")} onChange={(e) => set("customers", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></Field>
    </div>
  );
}

function StepBudget({ p, set }: any) {
  const budgetPct = p.budgetTotal && p.budgetUsed ? Math.min(100, (p.budgetUsed / p.budgetTotal) * 100) : 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Total Campaign Budget (₹)"><Input type="number" value={p.budgetTotal ?? ""} onChange={(e) => set("budgetTotal", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Discount Budget (₹)"><Input type="number" value={p.budgetDiscount ?? ""} onChange={(e) => set("budgetDiscount", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Media Budget (₹)"><Input type="number" value={p.budgetMedia ?? ""} onChange={(e) => set("budgetMedia", e.target.value ? +e.target.value : undefined)} /></Field>
      </div>
      {p.budgetTotal ? (
        <Card className="p-3"><div className="text-xs font-semibold mb-1">Budget Usage · {inr(p.budgetUsed ?? 0)} / {inr(p.budgetTotal)}</div><Progress value={budgetPct} className="h-2" /></Card>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Max Redemptions"><Input type="number" value={p.maxRedemptions ?? ""} onChange={(e) => set("maxRedemptions", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Max Total Discount Value"><Input type="number" value={p.maxDiscountValue ?? ""} onChange={(e) => set("maxDiscountValue", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Max Discount per Order"><Input type="number" value={p.maxDiscountPerOrder ?? ""} onChange={(e) => set("maxDiscountPerOrder", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Per Customer Limit"><Input type="number" value={p.perCustomerLimit ?? ""} onChange={(e) => set("perCustomerLimit", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Per Day Limit"><Input type="number" value={p.perDayLimit ?? ""} onChange={(e) => set("perDayLimit", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Per Branch Limit"><Input type="number" value={p.perBranchLimit ?? ""} onChange={(e) => set("perBranchLimit", e.target.value ? +e.target.value : undefined)} /></Field>
      </div>
    </div>
  );
}

function StepPreview({ p }: { p: MPromo }) {
  const [device, setDevice] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const primary = p.images.find((i) => i.primary) ?? p.images[0];
  const widths = { desktop: "w-full", tablet: "w-[600px]", mobile: "w-[360px]" };
  return (
    <div className="space-y-3">
      <div className="flex gap-1 justify-center">
        <Button size="sm" variant={device === "desktop" ? "default" : "outline"} onClick={() => setDevice("desktop")}><Monitor className="h-3.5 w-3.5 mr-1" />Desktop</Button>
        <Button size="sm" variant={device === "tablet" ? "default" : "outline"} onClick={() => setDevice("tablet")}><Tablet className="h-3.5 w-3.5 mr-1" />Tablet</Button>
        <Button size="sm" variant={device === "mobile" ? "default" : "outline"} onClick={() => setDevice("mobile")}><Smartphone className="h-3.5 w-3.5 mr-1" />Mobile</Button>
      </div>
      <div className="flex justify-center">
        <div className={"border rounded-lg overflow-hidden bg-card " + widths[device]}>
          <div className="relative aspect-[16/9] bg-muted">
            {primary ? <img src={primary.url} alt={primary.alt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon className="h-12 w-12" /></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="text-xs uppercase opacity-80">{p.type}</div>
              <div className="text-lg font-bold">{p.headline || p.name}</div>
              <div className="text-xs opacity-80">{p.shortDesc}</div>
              <Badge className="mt-2 bg-amber-500 text-black">{describeAction(p.actions[0])}</Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center">Preview under current theme · same tokens render across all 30 themes.</div>
    </div>
  );
}

function StepApproval({ p, belowMinMargin, belowCost }: any) {
  return (
    <div className="space-y-3">
      {(belowCost || belowMinMargin) && (
        <div className="rounded border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
          <div className="font-semibold mb-1 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Owner approval required</div>
          <div className="text-xs">{belowCost ? "Promotion price is below cost." : "Margin after promotion is below 10%."}</div>
        </div>
      )}
      <Card className="p-3">
        <div className="text-xs font-semibold uppercase mb-2">Approval Workflow</div>
        {p.approvals.map((a: any) => (
          <div key={a.level} className="flex items-center justify-between py-1.5 border-b last:border-0 text-xs">
            <div><span className="font-medium">L{a.level} · {a.role}</span></div>
            <div className="text-muted-foreground">{a.decision ? `${a.decision} by ${a.approver}` : "Pending"}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function StepPublish({ p, onPublish }: any) {
  return (
    <div className="text-center py-6 space-y-3">
      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
      <div className="text-lg font-semibold">Ready to publish</div>
      <div className="text-sm text-muted-foreground max-w-md mx-auto">{p.name} will go live on {p.startDate} across {p.channels.join(", ")}.</div>
      <Button size="lg" onClick={onPublish}><CheckCircle2 className="mr-2 h-4 w-4" />Publish now</Button>
    </div>
  );
}

/* ---------- Review Modal ---------- */
function PromoReview({ promo, onClose, onEdit, onApprove, onReject }: {
  promo: MPromo; onClose: () => void; onEdit: () => void;
  onApprove: (p: MPromo, level: 1 | 2 | 3 | 4) => void;
  onReject: (p: MPromo, level: 1 | 2 | 3 | 4, reason: string) => void;
}) {
  const [rejectReason, setRejectReason] = React.useState("");
  const nextLevel = promo.approvals.find((a) => !a.decision)?.level;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">{promo.number} · {promo.name}<Badge variant="outline" className={statusColor(promo.status)}>{promo.status}</Badge></DialogTitle>
          <DialogDescription>{promo.type} · {promo.startDate} → {promo.endDate}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="shrink-0">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="approval">Approval</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto py-3">
            <TabsContent value="info" className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Info label="Headline" value={promo.headline || "—"} />
                <Info label="Code" value={promo.code || "—"} />
                <Info label="Campaign" value={promo.internalCampaign || "—"} />
                <Info label="Priority" value={promo.priority} />
                <Info label="Placements" value={promo.placements.join(", ") || "—"} />
                <Info label="Channels" value={promo.channels.join(", ") || "—"} />
                <Info label="Branches" value={promo.branches.join(", ")} />
                <Info label="Customer Types" value={promo.customerTypes.join(", ")} />
              </div>
              {promo.terms && <Card className="p-3 text-xs"><div className="font-semibold mb-1">Terms & Conditions</div>{promo.terms}</Card>}
            </TabsContent>
            <TabsContent value="rules" className="space-y-3">
              <Card className="p-3"><div className="text-xs font-semibold mb-2">Discount Actions</div>{promo.actions.map((a, i) => <div key={i} className="text-sm py-1">{describeAction(a)}</div>)}</Card>
              <Card className="p-3"><div className="text-xs font-semibold mb-2">Rule Groups</div>{promo.rules.length === 0 ? <div className="text-xs text-muted-foreground">No conditions — applies to all eligible.</div> : promo.rules.map((g) => (
                <div key={g.id} className="text-xs border rounded p-2 mb-1"><span className="font-semibold">{g.joiner}: </span>{g.conditions.map((c) => `${c.field} ${c.op} ${c.value}`).join(` ${g.joiner} `)}</div>
              ))}</Card>
              {promo.coupons.length > 0 && <Card className="p-3"><div className="text-xs font-semibold mb-2">Coupons ({promo.coupons.length})</div><div className="flex flex-wrap gap-1">{promo.coupons.map((c) => <code key={c.id} className="px-2 py-1 bg-muted rounded text-xs font-mono">{c.code}</code>)}</div></Card>}
            </TabsContent>
            <TabsContent value="media">
              {promo.images.length === 0 && promo.videos.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">No media uploaded.</div>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {promo.images.map((img) => <div key={img.id} className="aspect-video bg-muted rounded overflow-hidden"><img src={img.url} alt={img.alt} className="w-full h-full object-cover" /></div>)}
                {promo.videos.map((v) => v.source === "upload" ? <video key={v.id} src={v.url} controls className="aspect-video rounded" /> : <div key={v.id} className="aspect-video rounded bg-muted flex items-center justify-center text-xs">External {v.source}</div>)}
              </div>
            </TabsContent>
            <TabsContent value="preview"><StepPreview p={promo} /></TabsContent>
            <TabsContent value="approval" className="space-y-2">
              {promo.approvals.map((a) => (
                <div key={a.level} className="flex items-center justify-between rounded border p-2">
                  <div className="text-sm"><div className="font-medium">Level {a.level} · {a.role}</div><div className="text-xs text-muted-foreground">{a.decision ? `${a.decision} by ${a.approver ?? "—"} on ${a.at?.slice(0, 16).replace("T", " ")}` : nextLevel === a.level ? "Awaiting decision" : "Pending earlier"}</div>{a.remarks && <div className="text-xs italic">"{a.remarks}"</div>}</div>
                  {nextLevel === a.level && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => onApprove(promo, a.level)}><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => { const r = prompt("Rejection reason?"); if (r) onReject(promo, a.level, r); }}><X className="h-3.5 w-3.5 mr-1" />Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="analytics">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KpiCard label="Impressions" value={promo.stats.impressions.toLocaleString("en-IN")} icon={Eye} />
                <KpiCard label="Clicks" value={promo.stats.clicks.toLocaleString("en-IN")} icon={TrendingUp} />
                <KpiCard label="CTR" value={promo.stats.impressions ? ((promo.stats.clicks / promo.stats.impressions) * 100).toFixed(2) + "%" : "—"} icon={Percent} />
                <KpiCard label="Orders" value={promo.stats.orders} icon={CheckCircle2} />
                <KpiCard label="Revenue" value={inr(promo.stats.revenue)} icon={IndianRupee} accent="emerald" />
                <KpiCard label="Discount Given" value={inr(promo.stats.discountGiven)} icon={Percent} accent="amber" />
                <KpiCard label="Gross Profit" value={inr(promo.stats.revenue - promo.stats.discountGiven)} icon={TrendingUp} accent="emerald" />
                <KpiCard label="Conversion %" value={promo.stats.clicks ? ((promo.stats.orders / promo.stats.clicks) * 100).toFixed(2) + "%" : "—"} icon={Percent} />
              </div>
            </TabsContent>
            <TabsContent value="audit">
              <Table>
                <TableHeader><TableRow><TableHead>When</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Details</TableHead></TableRow></TableHeader>
                <TableBody>{promo.audit.map((a, i) => <TableRow key={i}><TableCell className="text-xs">{a.at.slice(0, 16).replace("T", " ")}</TableCell><TableCell className="text-xs">{a.user}</TableCell><TableCell className="text-xs">{a.action}</TableCell><TableCell className="text-xs text-muted-foreground">{a.reason || (a.oldValue && a.newValue ? `${a.oldValue} → ${a.newValue}` : "")}</TableCell></TableRow>)}</TableBody>
              </Table>
            </TabsContent>
          </div>
        </Tabs>
        <DialogFooter className="shrink-0 border-t pt-3">
          <Button variant="outline" onClick={onEdit}><Pencil className="h-3.5 w-3.5 mr-1" />Edit</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Calendar / Approvals / Media / Templates ---------- */
function CampaignCalendar({ promos, onClose, onPick }: any) {
  const today = new Date();
  const [monthOffset, setMonthOffset] = React.useState(0);
  const current = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const firstDay = current.getDay();
  const cells = Array.from({ length: daysInMonth + firstDay }, (_, i) => i < firstDay ? null : i - firstDay + 1);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">Campaign Calendar
            <Button size="sm" variant="outline" onClick={() => setMonthOffset(monthOffset - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm">{current.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
            <Button size="sm" variant="outline" onClick={() => setMonthOffset(monthOffset + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="font-semibold text-center py-1">{d}</div>)}
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayPromos = promos.filter((p: MPromo) => dateStr >= p.startDate && dateStr <= p.endDate);
            return (
              <div key={i} className="border rounded min-h-[80px] p-1">
                <div className="text-xs font-medium mb-1">{day}</div>
                {dayPromos.slice(0, 3).map((p: MPromo) => (
                  <button key={p.id} onClick={() => onPick(p)} className={"w-full text-left px-1 py-0.5 rounded truncate mb-0.5 border text-[10px] " + statusColor(p.status)}>{p.name}</button>
                ))}
                {dayPromos.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayPromos.length - 3} more</div>}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ApprovalQueue({ promos, onClose, onOpen }: any) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Approval Queue ({promos.length})</DialogTitle></DialogHeader>
        {promos.length === 0 ? <div className="text-sm text-muted-foreground py-8 text-center">No promotions pending approval.</div> : (
          <div className="space-y-2">
            {promos.map((p: MPromo) => (
              <Card key={p.id} className="p-3 flex items-center justify-between">
                <div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.number} · {p.type} · {p.startDate} → {p.endDate}</div></div>
                <Button size="sm" onClick={() => onOpen(p)}>Review</Button>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MediaLibrary({ promos, onClose }: any) {
  const allImages = promos.flatMap((p: MPromo) => p.images.map((img) => ({ ...img, promoName: p.name, promoId: p.id })));
  const allVideos = promos.flatMap((p: MPromo) => p.videos.map((v) => ({ ...v, promoName: p.name, promoId: p.id })));
  const [tab, setTab] = React.useState<"images" | "videos">("images");
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Media Library</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList><TabsTrigger value="images">Images ({allImages.length})</TabsTrigger><TabsTrigger value="videos">Videos ({allVideos.length})</TabsTrigger></TabsList>
          <TabsContent value="images">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allImages.map((img: any) => (
                <div key={img.id + img.promoId} className="border rounded overflow-hidden">
                  <div className="aspect-video bg-muted"><img src={img.url} alt={img.alt} className="w-full h-full object-cover" /></div>
                  <div className="p-2 text-xs"><div className="font-medium truncate">{img.name}</div><div className="text-muted-foreground truncate">Used in: {img.promoName}</div></div>
                </div>
              ))}
              {allImages.length === 0 && <div className="col-span-full text-center text-muted-foreground py-8">No images uploaded yet.</div>}
            </div>
          </TabsContent>
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allVideos.map((v: any) => (
                <div key={v.id + v.promoId} className="border rounded p-2">
                  <div className="aspect-video bg-black rounded overflow-hidden mb-2">{v.source === "upload" ? <video src={v.url} controls className="w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-white text-xs">External {v.source}</div>}</div>
                  <div className="text-xs"><div className="font-medium">{v.title}</div><div className="text-muted-foreground">Used in: {v.promoName}</div></div>
                </div>
              ))}
              {allVideos.length === 0 && <div className="col-span-full text-center text-muted-foreground py-8">No videos uploaded yet.</div>}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function FestivalTemplates({ onClose, onPick }: any) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>Festival & Campaign Templates</DialogTitle><DialogDescription>Pick a starting template. All fields are editable.</DialogDescription></DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FESTIVAL_TEMPLATES.map((t) => (
            <button key={t.key} onClick={() => onPick(t)} className="border rounded p-3 text-left hover:border-primary hover:bg-primary/5 transition">
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.tag}</div>
              <div className="text-xs mt-2 font-mono">{t.discount}% off</div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- generic ---------- */
function Field({ label, children, className = "" }: any) {
  return <div className={"space-y-1 " + className}><Label className="text-xs">{label}</Label>{children}</div>;
}
function StatBadge({ label, value, tone = "ok" }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return <div className={"rounded border p-2 " + (tone === "warn" ? "border-amber-500/50 bg-amber-500/10" : "")}>
    <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>;
}
function MultiChips({ label, values, onChange, options, labelMap = {} }: { label: string; values: string[]; onChange: (v: string[]) => void; options: string[]; labelMap?: Record<string, string> }) {
  const toggle = (o: string) => onChange(values.includes(o) ? values.filter((x) => x !== o) : [...values, o]);
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => toggle(o)} className={"px-2 py-1 rounded text-xs border transition " + (values.includes(o) ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted")}>{labelMap[o] ?? o}</button>
        ))}
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[10px] uppercase text-muted-foreground">{label}</div><div className="text-sm font-medium truncate">{value}</div></div>;
}

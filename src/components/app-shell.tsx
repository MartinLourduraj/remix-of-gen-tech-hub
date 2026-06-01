import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Package, Truck, UserCog, FileText, ShoppingCart,
  Receipt, Boxes, ShieldCheck, Wrench, BarChart3, Search, Bell, Sun, Moon,
  LogOut, Menu, ChevronDown, KeyRound, Building2, MapPin, Repeat,
  FileSpreadsheet, FilePlus, FileMinus, History, Building, BookOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBranch } from "@/lib/branch-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type NavItem = { to: string; label: string; icon: React.ElementType };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { title: "Main", items: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { title: "Masters", items: [
    { to: "/companies", label: "Companies", icon: Building },
    { to: "/branches", label: "Branches", icon: Building2 },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/products", label: "Products", icon: Package },
    { to: "/vendors", label: "Vendors", icon: Truck },
    { to: "/employees", label: "Employees", icon: UserCog },
  ]},
  { title: "Sales", items: [
    { to: "/sales/estimates/new", label: "New Estimate", icon: FilePlus },
    { to: "/sales/estimates", label: "Estimate List", icon: FileSpreadsheet },
    { to: "/sales/invoices/new", label: "New Invoice", icon: FilePlus },
    { to: "/sales/invoices", label: "Invoice List", icon: Receipt },
    { to: "/sales/credit-notes", label: "Credit Note", icon: FileMinus },
    { to: "/sales/debit-notes", label: "Debit Note", icon: FilePlus },
    { to: "/quotations", label: "Quotations", icon: FileText },
    { to: "/sales-orders", label: "Sales Orders", icon: ShoppingCart },
  ]},
  { title: "Operations", items: [
    { to: "/inventory", label: "Inventory", icon: Boxes },
    { to: "/warranty-admin", label: "Warranty", icon: ShieldCheck },
    { to: "/service", label: "Service Tickets", icon: Wrench },
  ]},
  { title: "Admin", items: [
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/audit-log", label: "Audit Log", icon: History },
    { to: "/roles", label: "Roles & Access", icon: KeyRound },
  ]},
];

export function AppShell() {
  const { user, logout } = useAuth();
  const { branch, company, setSelectedBranchId } = useBranch();
  const nav = useNavigate();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    if (!user) nav({ to: "/login" });
    else if (!branch) nav({ to: "/select-branch" });
  }, [user, branch, nav]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  React.useEffect(() => { setMobileOpen(false); }, [loc.pathname]);

  if (!user) return null;

  const switchBranch = () => { setSelectedBranchId(null); nav({ to: "/select-branch" }); };

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">Gen-Tech</div>
            <div className="text-[11px] text-muted-foreground leading-tight">Generators ERP</div>
          </div>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
          {navGroups.map((g) => (
            <div key={g.title} className="mb-4">
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {g.title}
              </div>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active = loc.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Branch indicator */}
          {branch && (
            <button onClick={switchBranch}
              className="hidden md:flex items-center gap-2 rounded-md border bg-muted/40 hover:bg-muted px-2.5 py-1.5 text-xs transition-colors">
              <MapPin className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
              <div className="text-left leading-tight">
                <div className="font-semibold">{branch.name}</div>
                <div className="text-[10px] text-muted-foreground">{company?.name} · {branch.gstin}</div>
              </div>
              <Repeat className="h-3 w-3 text-muted-foreground ml-1" />
            </button>
          )}

          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoice, customer, GSTIN, serial, ticket..."
              className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="hidden text-left text-xs sm:block">
                  <div className="font-medium leading-tight">{user.name}</div>
                  <div className="text-muted-foreground leading-tight">{user.role}</div>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {branch && (
                <DropdownMenuItem onClick={switchBranch}>
                  <Repeat className="mr-2 h-4 w-4" /> Switch Branch
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

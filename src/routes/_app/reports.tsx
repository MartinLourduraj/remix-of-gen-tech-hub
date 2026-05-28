import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  BarChart3, FileText, Users, Boxes, Wrench, ShieldCheck, Receipt, IndianRupee,
  ArrowRight, Package, ShoppingCart, Truck,
} from "lucide-react";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

type R = { to: any; label: string; desc: string };
const groups: { group: string; icon: any; items: R[] }[] = [
  { group: "Sales", icon: BarChart3, items: [
    { to: "/reports/sales",      label: "Sales Register",   desc: "Invoice-wise sales with GST split" },
    { to: "/reports/quotations", label: "Quotation Report", desc: "Conversion funnel & approvals" },
    { to: "/reports/orders",     label: "Sales Orders",     desc: "Open / dispatched / delivered" },
  ]},
  { group: "Receivables", icon: IndianRupee, items: [
    { to: "/reports/invoices",     label: "Invoice Report",     desc: "All B2B/B2C invoices" },
    { to: "/reports/outstanding",  label: "Outstanding / Aging", desc: "Customer-wise dues" },
    { to: "/reports/collections",  label: "Collections",        desc: "Receipts & cash inflow" },
  ]},
  { group: "Inventory", icon: Boxes, items: [
    { to: "/reports/inventory", label: "Stock Summary", desc: "Item-wise stock & reorder" },
    { to: "/reports/purchases", label: "Purchase Report", desc: "Vendor-wise procurement" },
  ]},
  { group: "Service & Warranty", icon: Wrench, items: [
    { to: "/reports/service",  label: "Service Tickets", desc: "Open, in-progress, SLA" },
    { to: "/reports/warranty", label: "Warranty Register", desc: "Active / expired / claimed" },
    { to: "/reports/amc",      label: "AMC Contracts",   desc: "Renewals & due visits" },
  ]},
  { group: "Masters", icon: Users, items: [
    { to: "/reports/customers", label: "Customer List", desc: "Credit, outstanding, region" },
    { to: "/reports/employees", label: "Employee List", desc: "By branch & department" },
    { to: "/reports/products",  label: "Product Catalogue", desc: "SKU, price, warranty" },
  ]},
  { group: "Compliance", icon: Receipt, items: [
    { to: "/reports/gst", label: "GST Summary (GSTR-1/3B)", desc: "Output tax, IGST, CGST, SGST" },
  ]},
];

function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports Hub" description="Every operational, financial and compliance report — fully filterable, exportable to Excel & PDF." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <Card key={g.group}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                  <h3 className="font-semibold text-base">{g.group}</h3>
                </div>
                <ul className="space-y-2">
                  {g.items.map((i) => (
                    <li key={i.label}>
                      <Link to={i.to} className="flex items-start gap-2 -mx-2 px-2 py-1.5 rounded-md hover:bg-muted group">
                        <ArrowRight className="h-3.5 w-3.5 mt-1 text-muted-foreground group-hover:text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{i.label}</div>
                          <div className="text-xs text-muted-foreground">{i.desc}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  BarChart3, FileText, Users, Boxes, Wrench, ShieldCheck, Receipt, IndianRupee,
} from "lucide-react";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

const reports = [
  { group: "Sales", icon: BarChart3, items: ["Daily Sales","Weekly Sales","Monthly Sales","Annual Sales","Product-wise Sales","Branch-wise Sales","Sales Executive Performance"] },
  { group: "Customers", icon: Users, items: ["Customer Ledger","Outstanding Report","Credit Report","Purchase History"] },
  { group: "Inventory", icon: Boxes, items: ["Stock Summary","Reorder Report","Dead Stock","Fast/Slow Moving"] },
  { group: "Service", icon: Wrench, items: ["Open Tickets","Closed Tickets","Technician Performance","AMC Report"] },
  { group: "Warranty", icon: ShieldCheck, items: ["Active Warranty","Expiring Soon","Claims"] },
  { group: "Accounts", icon: IndianRupee, items: ["Ledger","Trial Balance","P&L","Balance Sheet","Cash Flow"] },
  { group: "GST", icon: Receipt, items: ["GSTR-1","GSTR-2","GSTR-3B","CGST/SGST/IGST Summary"] },
  { group: "Documents", icon: FileText, items: ["Audit Logs","Activity Timeline","Export Center"] },
];

function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports Hub" description="Every report grouped by domain — export to PDF, Excel or JSON." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.group}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                  <h3 className="font-semibold">{r.group}</h3>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {r.items.map((i) => (
                    <li key={i}>
                      <a className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" >• {i}</a>
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
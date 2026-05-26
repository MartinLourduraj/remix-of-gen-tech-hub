import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/roles")({ component: RolesPage });

const roles = [
  "Super Admin","Admin","Accounts Manager","Accounts Executive","Sales Manager",
  "Sales Executive","Service Manager","Service Engineer","Technician","Inventory Manager",
  "Store Keeper","Branch Manager","Dealer","Distributor","Customer",
];
const modules = ["Dashboard","Customers","Products","Vendors","Quotations","Sales Orders","Invoices","Inventory","Warranty","Service","Reports","GST","Accounts"];
const perms = ["View","Create","Edit","Delete","Approve","Print","Export"];

// Demo permission matrix
const matrix: Record<string, Record<string, boolean>> = {};
for (const r of roles) {
  matrix[r] = {};
  for (const m of modules) for (const p of perms) {
    const all = r === "Super Admin" || r === "Admin";
    matrix[r][`${m}.${p}`] = all || (r.includes("Sales") && ["Customers","Quotations","Sales Orders","Invoices"].includes(m)) || (r.includes("Service") && ["Service","Warranty","Customers"].includes(m)) || (m === "Dashboard" && p === "View");
  }
}

function RolesPage() {
  return (
    <div>
      <PageHeader title="Roles & Access Control" description="Granular per-module permissions across 15 default roles. Create unlimited custom roles." action={{ label: "New Role" }} />
      <Card className="mb-4 p-4 flex flex-wrap gap-2">
        {roles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background">Module</TableHead>
                {perms.map((p) => <TableHead key={p} className="text-center">{p}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((m) => (
                <TableRow key={m}>
                  <TableCell className="sticky left-0 bg-background font-medium">{m}</TableCell>
                  {perms.map((p) => (
                    <TableCell key={p} className="text-center">
                      <Checkbox defaultChecked={matrix["Sales Manager"][`${m}.${p}`]} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-3 text-xs text-muted-foreground border-t">
          Showing permissions for <strong>Sales Manager</strong>. Switch role from the badge bar above (UI demo).
        </div>
      </Card>
    </div>
  );
}
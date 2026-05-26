import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/service")({ component: ServicePage });

const statusTone: Record<string, any> = {
  Open: "secondary", Assigned: "default", "In Progress": "default", "Pending Parts": "secondary", Closed: "default",
};
const prioTone: Record<string, any> = { Low: "secondary", Medium: "default", High: "destructive", Critical: "destructive" };

function ServicePage() {
  const { tickets, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));

  const counts = tickets.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1; return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Service & Complaint Tickets" description="Complaint intake, technician assignment, AMC and visit scheduling." action={{ label: "New Ticket" }} />
      <div className="grid gap-3 sm:grid-cols-5 mb-4">
        {["Open","Assigned","In Progress","Pending Parts","Closed"].map((s) => (
          <Card key={s}><CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{s}</div>
            <div className="text-2xl font-semibold mt-1">{counts[s] ?? 0}</div>
          </CardContent></Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead><TableHead>Created</TableHead><TableHead>Customer</TableHead>
              <TableHead>Product</TableHead><TableHead>Problem</TableHead><TableHead>Priority</TableHead>
              <TableHead>Technician</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.number}</TableCell>
                <TableCell>{t.createdAt}</TableCell>
                <TableCell className="font-medium">{cMap[t.customerId]}</TableCell>
                <TableCell>{pMap[t.productId]}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{t.problem}</TableCell>
                <TableCell><Badge variant={prioTone[t.priority]}>{t.priority}</Badge></TableCell>
                <TableCell>{t.technician ?? <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell><Badge variant={statusTone[t.status]}>{t.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/service")({ component: ServiceReport });

function ServiceReport() {
  const { tickets, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  const rows = tickets.map((t) => ({
    number: t.number, createdAt: t.createdAt,
    customer: cMap[t.customerId] ?? "", product: pMap[t.productId] ?? "",
    problem: t.problem, priority: t.priority, status: t.status,
    technician: t.technician ?? "Unassigned",
  }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number",    header: "Ticket #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "createdAt", header: "Created" },
    { accessorKey: "customer",  header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "product",   header: "Product" },
    { accessorKey: "problem",   header: "Problem" },
    { accessorKey: "priority",  header: "Priority",
      format: (v) => <Badge variant={v === "High" || v === "Critical" ? "destructive" : v === "Medium" ? "default" : "secondary"}>{v}</Badge> },
    { accessorKey: "technician",header: "Technician" },
    { accessorKey: "status",    header: "Status",
      format: (v) => <Badge variant={v === "Closed" ? "default" : "secondary"}>{v}</Badge> },
  ];
  return <DataGrid id="service" title="Service Ticket Report" description="Complaint tracking by status, priority & technician."
    data={rows} columns={cols} dateField="createdAt" />;
}
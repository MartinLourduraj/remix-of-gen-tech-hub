import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/invoices")({ component: InvoiceReport });

function InvoiceReport() {
  const { invoices, customers } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c]));
  const rows = invoices.map((i) => ({
    ...i,
    customer: cMap[i.customerId]?.name ?? "",
    balance: i.total - i.paid,
  }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number",  header: "Invoice #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date",    header: "Date" },
    { accessorKey: "customer",header: "Customer" },
    { accessorKey: "total",   header: "Total", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "paid",    header: "Paid",  summary: "sum", format: (v) => inr(v) },
    { accessorKey: "balance", header: "Balance", summary: "sum", format: (v) => <span className={v > 0 ? "text-rose-600 font-semibold" : ""}>{inr(v)}</span> },
    { accessorKey: "status",  header: "Status", format: (v) => <Badge variant={v === "Paid" ? "default" : v === "Overdue" ? "destructive" : "secondary"}>{v}</Badge> },
    { accessorKey: "irn",     header: "IRN", format: (v) => <span className="font-mono text-[10px]">{v ?? "—"}</span> },
  ];
  return <DataGrid id="invoices" title="Invoice Report" description="All B2B/B2C invoices with payment status and IRN."
    data={rows} columns={cols} dateField="date" />;
}
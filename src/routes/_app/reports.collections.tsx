import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/reports/collections")({ component: CollectionsReport });

function CollectionsReport() {
  const { invoices, customers } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const rows = invoices.filter((i) => i.paid > 0).map((i) => ({
    date: i.date, invoice: i.number, customer: cMap[i.customerId] ?? "",
    invoiceTotal: i.total, received: i.paid, mode: i.paid === i.total ? "Full" : "Partial",
  }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "date",         header: "Date" },
    { accessorKey: "invoice",      header: "Invoice", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "customer",     header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "invoiceTotal", header: "Invoice Total", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "received",     header: "Received", summary: "sum", format: (v) => <span className="font-semibold text-emerald-700">{inr(v)}</span> },
    { accessorKey: "mode",         header: "Type" },
  ];
  return <DataGrid id="collections" title="Collections Report" data={rows} columns={cols} dateField="date" />;
}
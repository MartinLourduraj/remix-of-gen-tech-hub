import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/sales")({ component: SalesReport });

function SalesReport() {
  const { invoices, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const rows = invoices.map((i) => ({
    number: i.number,
    date: i.date,
    customer: cMap[i.customerId]?.name ?? "",
    mobile: cMap[i.customerId]?.mobile ?? "",
    gstin: cMap[i.customerId]?.gstin ?? "",
    product: pMap[i.productId]?.model ?? "",
    qty: i.qty,
    subtotal: i.subtotal,
    gstAmount: i.gstAmount,
    total: i.total,
    status: i.status,
    state: cMap[i.customerId]?.state ?? "",
  }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number",   header: "Invoice #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date",     header: "Date" },
    { accessorKey: "customer", header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "mobile",   header: "Mobile" },
    { accessorKey: "gstin",    header: "GSTIN" },
    { accessorKey: "product",  header: "Product" },
    { accessorKey: "qty",      header: "Qty", isNumeric: true, summary: "sum" },
    { accessorKey: "subtotal", header: "Subtotal", isNumeric: true, summary: "sum", format: (v) => inr(v) },
    { accessorKey: "gstAmount",header: "GST", isNumeric: true, summary: "sum", format: (v) => inr(v) },
    { accessorKey: "total",    header: "Total", isNumeric: true, summary: "sum", format: (v) => <span className="font-semibold">{inr(v)}</span> },
    { accessorKey: "state",    header: "State" },
    { accessorKey: "status",   header: "Status", format: (v) => <Badge variant={v === "Paid" ? "default" : v === "Overdue" ? "destructive" : "secondary"}>{v}</Badge> },
  ];
  return <DataGrid id="sales" title="Sales Register" description="Invoice-wise sales with GST split, customer, region and status."
    data={rows} columns={cols} dateField="date" />;
}
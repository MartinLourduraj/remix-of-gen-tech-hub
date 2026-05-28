import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/quotations")({ component: QuotationReport });

function QuotationReport() {
  const { quotations, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  const rows = quotations.map((q) => ({
    ...q, customer: cMap[q.customerId] ?? "", product: pMap[q.productId] ?? "",
  }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number",   header: "Quote #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date",     header: "Date" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "product",  header: "Product" },
    { accessorKey: "qty",      header: "Qty", summary: "sum" },
    { accessorKey: "discount", header: "Discount", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "freight",  header: "Freight",  summary: "sum", format: (v) => inr(v) },
    { accessorKey: "total",    header: "Total", summary: "sum", format: (v) => <span className="font-semibold">{inr(v)}</span> },
    { accessorKey: "status",   header: "Status",
      format: (v) => <Badge variant={v === "Converted" || v === "Approved" ? "default" : v === "Rejected" ? "destructive" : "secondary"}>{v}</Badge> },
  ];
  return <DataGrid id="quotations" title="Quotation Report" data={rows} columns={cols} dateField="date" />;
}
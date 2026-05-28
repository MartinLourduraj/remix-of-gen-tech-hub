import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/orders")({ component: OrderReport });

function OrderReport() {
  const { salesOrders, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  const rows = salesOrders.map((o) => ({ ...o, customer: cMap[o.customerId] ?? "", product: pMap[o.productId] ?? "" }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number",   header: "Order #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date",     header: "Date" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "product",  header: "Product" },
    { accessorKey: "qty",      header: "Qty", summary: "sum" },
    { accessorKey: "total",    header: "Total", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "status",   header: "Status",
      format: (v) => <Badge variant={v === "Delivered" || v === "Invoiced" ? "default" : "secondary"}>{v}</Badge> },
  ];
  return <DataGrid id="orders" title="Sales Order Report" data={rows} columns={cols} dateField="date" />;
}
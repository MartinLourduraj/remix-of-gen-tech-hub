import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/amc")({ component: AMCReport });

function AMCReport() {
  const { warranties, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  const today = new Date().toISOString().slice(0, 10);
  const rows = warranties.map((w) => {
    const daysLeft = Math.round((+new Date(w.endDate) - +new Date(today)) / 86400000);
    return {
      serial: w.serial, customer: cMap[w.customerId] ?? "", product: pMap[w.productId] ?? "",
      startDate: w.startDate, endDate: w.endDate,
      daysLeft, status: daysLeft < 0 ? "Expired" : daysLeft < 60 ? "Renewal Due" : "Active",
    };
  });
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "serial",    header: "Serial", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "customer",  header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "product",   header: "Product" },
    { accessorKey: "startDate", header: "Start" },
    { accessorKey: "endDate",   header: "End" },
    { accessorKey: "daysLeft",  header: "Days Left", format: (v) => <span className={v < 0 ? "text-rose-600" : v < 60 ? "text-amber-600 font-semibold" : ""}>{v}</span> },
    { accessorKey: "status",    header: "Status",
      format: (v) => <Badge variant={v === "Active" ? "default" : v === "Renewal Due" ? "secondary" : "destructive"}>{v}</Badge> },
  ];
  return <DataGrid id="amc" title="AMC Contracts" description="Renewal pipeline by days remaining."
    data={rows} columns={cols} dateField="endDate" />;
}
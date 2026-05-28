import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/warranty")({ component: WarrantyReport });

function WarrantyReport() {
  const { warranties, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  const rows = warranties.map((w) => ({
    serial: w.serial, engineNo: w.engineNo,
    customer: cMap[w.customerId] ?? "", product: pMap[w.productId] ?? "",
    invoiceNumber: w.invoiceNumber, installationDate: w.installationDate,
    startDate: w.startDate, endDate: w.endDate, status: w.status,
  }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "serial",   header: "Serial #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "engineNo", header: "Engine #" },
    { accessorKey: "customer", header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "product",  header: "Product" },
    { accessorKey: "invoiceNumber", header: "Invoice #" },
    { accessorKey: "installationDate", header: "Installed" },
    { accessorKey: "startDate",header: "Start" },
    { accessorKey: "endDate",  header: "End" },
    { accessorKey: "status",   header: "Status",
      format: (v) => <Badge variant={v === "Active" ? "default" : v === "Expired" ? "destructive" : "secondary"}>{v}</Badge> },
  ];
  return <DataGrid id="warranty" title="Warranty Register" description="Active, expired and claimed warranties."
    data={rows} columns={cols} dateField="startDate" />;
}
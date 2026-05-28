import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/reports/purchases")({ component: PurchaseReport });

function PurchaseReport() {
  const { stock, products } = useData();
  const pMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const rows = stock.filter((m) => m.type === "Inward").map((m) => {
    const p = pMap[m.productId];
    return {
      date: m.date, sku: p?.sku ?? "", model: p?.model ?? "",
      qty: m.qty, warehouse: m.warehouse,
      unitCost: p?.purchasePrice ?? 0, total: (p?.purchasePrice ?? 0) * m.qty,
      note: m.note ?? "",
    };
  });
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "date",      header: "Date" },
    { accessorKey: "sku",       header: "SKU", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "model",     header: "Product", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "qty",       header: "Qty", summary: "sum" },
    { accessorKey: "warehouse", header: "Warehouse" },
    { accessorKey: "unitCost",  header: "Unit Cost", format: (v) => inr(v) },
    { accessorKey: "total",     header: "Total Cost", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "note",      header: "Ref" },
  ];
  return <DataGrid id="purchases" title="Purchase Report" data={rows} columns={cols} dateField="date" />;
}
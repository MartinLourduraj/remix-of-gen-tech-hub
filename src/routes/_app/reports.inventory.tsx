import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/reports/inventory")({ component: InventoryReport });

function InventoryReport() {
  const { products } = useData();
  const rows = products.map((p) => ({
    sku: p.sku, model: p.model, kva: p.capacityKVA, fuel: p.fuel,
    hsn: p.hsn, gst: p.gst, stock: p.stock,
    purchase: p.purchasePrice, selling: p.sellingPrice,
    value: p.stock * p.purchasePrice,
    warranty: p.warrantyMonths,
    status: p.stock === 0 ? "Out" : p.stock < 5 ? "Low" : "OK",
  }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "sku",     header: "SKU", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "model",   header: "Model", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "kva",     header: "kVA", summary: "sum" },
    { accessorKey: "fuel",    header: "Fuel" },
    { accessorKey: "hsn",     header: "HSN" },
    { accessorKey: "gst",     header: "GST %" },
    { accessorKey: "stock",   header: "Stock", summary: "sum",
      format: (v) => <span className={v < 5 ? "text-rose-600 font-semibold" : ""}>{v}</span> },
    { accessorKey: "purchase",header: "Purchase", format: (v) => inr(v) },
    { accessorKey: "selling", header: "Selling",  format: (v) => inr(v) },
    { accessorKey: "value",   header: "Stock Value", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "warranty",header: "Warranty (m)" },
    { accessorKey: "status",  header: "Status",
      format: (v) => <Badge variant={v === "OK" ? "default" : v === "Low" ? "secondary" : "destructive"}>{v}</Badge> },
  ];
  return <DataGrid id="inventory" title="Stock Summary" description="Item-wise stock, reorder status and inventory value."
    data={rows} columns={cols} />;
}
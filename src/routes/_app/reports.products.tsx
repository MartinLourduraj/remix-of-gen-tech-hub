import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/reports/products")({ component: ProductReport });

function ProductReport() {
  const { products } = useData();
  const cols: GridColumn<(typeof products)[number]>[] = [
    { accessorKey: "sku",            header: "SKU", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "model",          header: "Model", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "capacityKVA",    header: "kVA", summary: "sum" },
    { accessorKey: "fuel",           header: "Fuel" },
    { accessorKey: "hsn",            header: "HSN" },
    { accessorKey: "gst",            header: "GST %" },
    { accessorKey: "purchasePrice",  header: "Purchase",   summary: "sum", format: (v) => inr(v) },
    { accessorKey: "sellingPrice",   header: "Selling",    summary: "sum", format: (v) => inr(v) },
    { accessorKey: "dealerPrice",    header: "Dealer",     summary: "sum", format: (v) => inr(v) },
    { accessorKey: "warrantyMonths", header: "Warranty (m)" },
    { accessorKey: "stock",          header: "Stock",      summary: "sum" },
  ];
  return <DataGrid id="products" title="Product Catalogue" data={products as any} columns={cols} />;
}
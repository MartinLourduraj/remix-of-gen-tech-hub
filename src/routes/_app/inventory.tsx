import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Boxes, AlertTriangle, ArrowDownUp } from "lucide-react";

export const Route = createFileRoute("/_app/inventory")({ component: InventoryPage });

function InventoryPage() {
  const { products, stock } = useData();
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const value = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0);
  const lowStock = products.filter((p) => p.stock < 5);
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));

  return (
    <div>
      <PageHeader title="Inventory" description="Warehouse, branch and dealer stock with transfers and reorder alerts." action={{ label: "Stock Movement" }} />

      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><Boxes className="h-5 w-5" /></div>
          <div><div className="text-xs text-muted-foreground">Total units</div><div className="text-lg font-semibold">{totalUnits}</div></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-100 text-emerald-700"><ArrowDownUp className="h-5 w-5" /></div>
          <div><div className="text-xs text-muted-foreground">Stock value</div><div className="text-lg font-semibold">{inr(value)}</div></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-rose-100 text-rose-700"><AlertTriangle className="h-5 w-5" /></div>
          <div><div className="text-xs text-muted-foreground">Low stock SKUs</div><div className="text-lg font-semibold">{lowStock.length}</div></div>
        </CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Stock by SKU</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Model</TableHead><TableHead className="text-right">In stock</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell className="font-medium">{p.model}</TableCell>
                    <TableCell className="text-right">{p.stock}</TableCell>
                    <TableCell><Badge variant={p.stock < 5 ? "destructive" : "secondary"}>{p.stock < 5 ? "Reorder" : "Healthy"}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Recent Stock Movements</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Qty</TableHead><TableHead>Warehouse</TableHead></TableRow></TableHeader>
              <TableBody>
                {stock.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.date}</TableCell>
                    <TableCell>{pMap[m.productId]}</TableCell>
                    <TableCell><Badge variant={m.type === "Outward" ? "destructive" : m.type === "Inward" ? "default" : "secondary"}>{m.type}</Badge></TableCell>
                    <TableCell className="text-right">{m.qty}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.warehouse}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
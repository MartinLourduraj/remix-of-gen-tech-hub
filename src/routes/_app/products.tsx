import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/products")({ component: ProductsPage });

function ProductsPage() {
  const { products } = useData();
  const [q, setQ] = React.useState("");
  const filtered = products.filter((p) =>
    [p.sku, p.model, String(p.capacityKVA), p.fuel].join(" ").toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div>
      <PageHeader title="Products" description="Generator catalog with GST, pricing tiers and warranty." action={{ label: "New Product" }}>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU, model..." className="h-9 w-64" />
      </PageHeader>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>kVA</TableHead>
                <TableHead>Fuel</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead>GST</TableHead>
                <TableHead className="text-right">Purchase</TableHead>
                <TableHead className="text-right">Selling</TableHead>
                <TableHead className="text-right">Dealer</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                  <TableCell className="font-medium">{p.model}</TableCell>
                  <TableCell>{p.capacityKVA}</TableCell>
                  <TableCell><Badge variant="secondary">{p.fuel}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{p.hsn}</TableCell>
                  <TableCell>{p.gst}%</TableCell>
                  <TableCell className="text-right">{inr(p.purchasePrice)}</TableCell>
                  <TableCell className="text-right">{inr(p.sellingPrice)}</TableCell>
                  <TableCell className="text-right">{inr(p.dealerPrice)}</TableCell>
                  <TableCell>{p.warrantyMonths} mo</TableCell>
                  <TableCell className="text-right">
                    <span className={p.stock < 5 ? "text-rose-600 font-medium" : ""}>{p.stock}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
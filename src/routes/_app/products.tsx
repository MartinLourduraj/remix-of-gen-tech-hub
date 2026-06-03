import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/products")({ component: ProductsPage });

function ProductsPage() {
  const { products, remove, logAudit } = useData();
  const [q, setQ] = React.useState("");
  const nav = useNavigate();
  const filtered = products.filter((p) =>
    [p.sku, p.model, String(p.capacityKVA), p.fuel].join(" ").toLowerCase().includes(q.toLowerCase())
  );
  const del = (id: string, sku: string) => {
    if (!confirm(`Delete product ${sku}?`)) return;
    remove("products", id); logAudit({ user: "current", entity: "Product", entityId: sku, action: "Deleted" });
    toast.success(`Deleted ${sku}`);
  };
  return (
    <div>
      <PageHeader title="Products" description="Generator catalog with GST, pricing tiers and warranty.">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU, model..." className="h-9 w-64" />
        <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        <Button size="sm" asChild><Link to="/products/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add New</Link></Button>
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
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => nav({ to: "/products/$id/edit", params: { id: p.id } })}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(p.id, p.sku)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
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
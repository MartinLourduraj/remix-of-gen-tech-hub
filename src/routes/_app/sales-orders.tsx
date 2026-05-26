import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/sales-orders")({ component: SalesOrdersPage });

const tone: Record<string, any> = {
  Open: "secondary", Dispatched: "default", Delivered: "default", Invoiced: "default",
};

function SalesOrdersPage() {
  const { salesOrders, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  return (
    <div>
      <PageHeader title="Sales Orders" description="Order lifecycle: Quote → Order → Dispatch → Delivery → Invoice." action={{ label: "New Order" }} />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
              <TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesOrders.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.number}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell className="font-medium">{cMap[s.customerId]}</TableCell>
                <TableCell>{pMap[s.productId]}</TableCell>
                <TableCell className="text-right">{s.qty}</TableCell>
                <TableCell className="text-right font-medium">{inr(s.total)}</TableCell>
                <TableCell><Badge variant={tone[s.status]}>{s.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
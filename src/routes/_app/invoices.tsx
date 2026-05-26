import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/invoices")({ component: InvoicesPage });

const tone: Record<string, any> = {
  Paid: "default", Partial: "secondary", Pending: "secondary", Overdue: "destructive",
};

function InvoicesPage() {
  const { invoices, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  return (
    <div>
      <PageHeader title="GST Invoices & E-Invoicing" description="B2B/B2C invoices with IRN, E-Way Bill and payment tracking." action={{ label: "New Invoice" }} />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
                <TableHead>Product</TableHead><TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">GST</TableHead><TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead><TableHead>Status</TableHead>
                <TableHead className="font-mono text-xs">IRN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.number}</TableCell>
                  <TableCell>{i.date}</TableCell>
                  <TableCell className="font-medium">{cMap[i.customerId]}</TableCell>
                  <TableCell>{pMap[i.productId]}</TableCell>
                  <TableCell className="text-right">{inr(i.subtotal)}</TableCell>
                  <TableCell className="text-right">{inr(i.gstAmount)}</TableCell>
                  <TableCell className="text-right font-medium">{inr(i.total)}</TableCell>
                  <TableCell className="text-right">{inr(i.paid)}</TableCell>
                  <TableCell><Badge variant={tone[i.status]}>{i.status}</Badge></TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{i.irn ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
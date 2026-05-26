import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Mail, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/quotations")({ component: QuotationsPage });

const tone: Record<string, any> = {
  Draft: "secondary", Sent: "default", Approved: "default",
  Rejected: "destructive", Converted: "default",
};

function QuotationsPage() {
  const { quotations, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));

  return (
    <div>
      <PageHeader title="Quotations" description="Generate, approve and convert quotes into sales orders." action={{ label: "New Quotation" }} />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead>
              <TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-mono text-xs">{q.number}</TableCell>
                <TableCell>{q.date}</TableCell>
                <TableCell className="font-medium">{cMap[q.customerId]}</TableCell>
                <TableCell>{pMap[q.productId]}</TableCell>
                <TableCell className="text-right">{q.qty}</TableCell>
                <TableCell className="text-right font-medium">{inr(q.total)}</TableCell>
                <TableCell><Badge variant={tone[q.status]}>{q.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Printer className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Mail className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Convert <ArrowRight className="ml-1 h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
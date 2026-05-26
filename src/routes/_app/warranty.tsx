import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";

export const Route = createFileRoute("/_app/warranty")({ component: WarrantyPage });

const tone: Record<string, any> = { Active: "default", Expired: "destructive", Claimed: "secondary" };

function WarrantyPage() {
  const { warranties, customers, products } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));
  return (
    <div>
      <PageHeader title="Warranty Management" description="Registrations, certificates with QR, and claim tracking." action={{ label: "Register Warranty" }} />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial #</TableHead><TableHead>Engine #</TableHead><TableHead>Customer</TableHead>
                <TableHead>Product</TableHead><TableHead>Invoice</TableHead><TableHead>Installed</TableHead>
                <TableHead>Expires</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warranties.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-mono text-xs">{w.serial}</TableCell>
                  <TableCell className="font-mono text-xs">{w.engineNo}</TableCell>
                  <TableCell className="font-medium">{cMap[w.customerId]}</TableCell>
                  <TableCell>{pMap[w.productId]}</TableCell>
                  <TableCell className="font-mono text-xs">{w.invoiceNumber}</TableCell>
                  <TableCell>{w.installationDate}</TableCell>
                  <TableCell>{w.endDate}</TableCell>
                  <TableCell><Badge variant={tone[w.status]}>{w.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7"><QrCode className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
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
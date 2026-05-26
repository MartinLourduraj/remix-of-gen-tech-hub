import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/vendors")({ component: VendorsPage });

function VendorsPage() {
  const { vendors } = useData();
  return (
    <div>
      <PageHeader title="Vendors" description="Spare-part and equipment suppliers." action={{ label: "New Vendor" }} />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead><TableHead>Vendor</TableHead><TableHead>GSTIN</TableHead>
              <TableHead>Contact</TableHead><TableHead>Mobile</TableHead><TableHead>Terms</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-mono text-xs">{v.code}</TableCell>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell className="font-mono text-xs">{v.gstin}</TableCell>
                <TableCell>{v.contact}</TableCell>
                <TableCell>{v.mobile}</TableCell>
                <TableCell>{v.terms}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
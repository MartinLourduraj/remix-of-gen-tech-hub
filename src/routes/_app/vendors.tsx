import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, Download, Printer } from "lucide-react";

export const Route = createFileRoute("/_app/vendors")({ component: VendorsPage });

function VendorsPage() {
  const { vendors, remove, logAudit } = useData();
  const [q, setQ] = React.useState("");
  const nav = useNavigate();
  const filtered = vendors.filter((v) => [v.name, v.code, v.gstin, v.contact, v.mobile].join(" ").toLowerCase().includes(q.toLowerCase()));
  const del = (id: string, code: string) => {
    if (!confirm(`Delete vendor ${code}?`)) return;
    remove("vendors", id);
    logAudit({ user: "current", entity: "Vendor", entityId: code, action: "Deleted" });
    toast.success(`Deleted ${code}`);
  };
  return (
    <div>
      <PageHeader title="Vendors" description="Spare-part and equipment suppliers.">
        <Input placeholder="Search vendor..." value={q} onChange={(e) => setQ(e.target.value)} className="h-9 w-64" />
        <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        <Button size="sm" asChild><Link to="/vendors/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add New</Link></Button>
      </PageHeader>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead><TableHead>Vendor</TableHead><TableHead>GSTIN</TableHead>
              <TableHead>Contact</TableHead><TableHead>Mobile</TableHead><TableHead>Terms</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-mono text-xs">{v.code}</TableCell>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell className="font-mono text-xs">{v.gstin}</TableCell>
                <TableCell>{v.contact}</TableCell>
                <TableCell>{v.mobile}</TableCell>
                <TableCell>{v.terms}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => nav({ to: "/vendors/$id/edit", params: { id: v.id } })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(v.id, v.code)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Eye, Trash2, Printer, Download } from "lucide-react";

export const Route = createFileRoute("/_app/customers")({ component: CustomersPage });

function CustomersPage() {
  const { customers, remove, logAudit } = useData();
  const [q, setQ] = React.useState("");
  const nav = useNavigate();

  const filtered = customers.filter((c) =>
    [c.name, c.code, c.gstin, c.mobile, c.city].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const del = (id: string, code: string) => {
    if (!confirm(`Delete customer ${code}?`)) return;
    remove("customers", id);
    logAudit({ user: "current", entity: "Customer", entityId: code, action: "Deleted" });
    toast.success(`Deleted ${code}`);
  };
  const exportCsv = () => {
    const head = ["Code","Name","Type","GSTIN","Mobile","City","State","Credit Limit","Outstanding"];
    const rows = filtered.map((c) => [c.code, c.name, c.type, c.gstin ?? "", c.mobile, c.city, c.state, c.creditLimit, c.outstanding]);
    const csv = [head, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "customers.csv"; a.click();
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Retail, corporate, government, dealer and distributor accounts."
      >
        <Input
          placeholder="Search name, GSTIN, mobile..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-9 w-64"
        />
        <Button size="sm" variant="outline" onClick={exportCsv}><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
        <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        <Button size="sm" asChild><Link to="/customers/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add New</Link></Button>
      </PageHeader>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Credit Limit</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.code}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="secondary">{c.type}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{c.gstin ?? "—"}</TableCell>
                  <TableCell>{c.mobile}</TableCell>
                  <TableCell>{c.city}, {c.state}</TableCell>
                  <TableCell className="text-right">{inr(c.creditLimit)}</TableCell>
                  <TableCell className={`text-right font-medium ${c.outstanding > 0 ? "text-rose-600" : ""}`}>{inr(c.outstanding)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => nav({ to: "/customers/$id/edit", params: { id: c.id } })} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => nav({ to: "/customers/$id/edit", params: { id: c.id } })} title="View"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => del(c.id, c.code)} title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">No customers match.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
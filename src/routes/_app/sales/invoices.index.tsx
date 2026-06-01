import { createFileRoute, Link } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { useBranchScope } from "@/lib/branch-context";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Copy, X, Repeat, Printer } from "lucide-react";

export const Route = createFileRoute("/_app/sales/invoices/")({ component: InvoiceListPage });

function InvoiceListPage() {
  const { invoices, customers, products, add, update, logAudit } = useData();
  const scoped = useBranchScope(invoices);
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c]));
  const pMap = Object.fromEntries(products.map((p) => [p.id, p.model]));

  const duplicate = (id: string) => {
    const inv = invoices.find((x) => x.id === id); if (!inv) return;
    const copy = { ...inv, id: `i_${Date.now()}`, number: `${inv.number}-COPY`, paid: 0, status: "Pending" as const };
    add("invoices", copy);
    logAudit({ user: "Current User", entity: "Invoice", entityId: inv.number, action: "Duplicated", newValue: copy.number });
  };
  const cancel = (id: string) => {
    const inv = invoices.find((x) => x.id === id); if (!inv) return;
    update("invoices", id, { status: "Cancelled" });
    logAudit({ user: "Current User", entity: "Invoice", entityId: inv.number, action: "Cancelled", oldValue: inv.status, newValue: "Cancelled" });
  };
  const convertType = (id: string) => {
    const inv = invoices.find((x) => x.id === id); if (!inv) return;
    const next = inv.billType === "B2B" ? "B2C" : "B2B";
    update("invoices", id, { billType: next });
    logAudit({ user: "Current User", entity: "Invoice", entityId: inv.number, action: "Converted Type", oldValue: inv.billType, newValue: next });
  };

  const rows = scoped.map((i) => ({
    ...i,
    customer: cMap[i.customerId]?.name ?? "",
    mobile: cMap[i.customerId]?.mobile ?? "",
    gstin: cMap[i.customerId]?.gstin ?? "",
    product: pMap[i.productId] ?? "",
  }));

  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number", header: "Invoice #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "customer", header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "billType", header: "Type", format: (v) => <Badge variant="outline">{v ?? "B2B"}</Badge> },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "qty", header: "Qty", summary: "sum" },
    { accessorKey: "subtotal", header: "Subtotal", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "gstAmount", header: "GST", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "total", header: "Total", summary: "sum", format: (v) => <span className="font-semibold">{inr(v)}</span> },
    { accessorKey: "paid", header: "Paid", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "status", header: "Status", format: (v) => <Badge variant={v === "Paid" ? "default" : v === "Cancelled" || v === "Overdue" ? "destructive" : "secondary"}>{v}</Badge> },
    { accessorKey: "irn", header: "IRN", format: (v) => <span className="font-mono text-[10px] text-muted-foreground">{v ?? "—"}</span> },
    { accessorKey: "id", header: "Actions", exportable: false, format: (_v, row) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit"><Pencil className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Print"><Printer className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Duplicate" onClick={() => duplicate(row.id)}><Copy className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Convert B2B↔B2C" onClick={() => convertType(row.id)}><Repeat className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" title="Cancel" onClick={() => cancel(row.id)}><X className="h-3 w-3" /></Button>
      </div>
    )},
  ];

  return (
    <DataGrid id="sales-invoices" title="Invoice List"
      description="GST invoices for this branch. Edit, duplicate, cancel or flip between B2B/B2C with full audit trail."
      data={rows} columns={cols} dateField="date"
      toolbarExtra={
        <Button asChild size="sm"><Link to="/sales/invoices/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> New Invoice</Link></Button>
      }
    />
  );
}

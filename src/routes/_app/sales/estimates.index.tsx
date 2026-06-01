import { createFileRoute, Link } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { useBranchScope } from "@/lib/branch-context";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Printer, ArrowRight, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/sales/estimates/")({ component: EstimateListPage });

function EstimateListPage() {
  const { estimates, remove, add, logAudit } = useData();
  const scoped = useBranchScope(estimates);

  const convert = (id: string) => {
    const e = estimates.find((x) => x.id === id);
    if (!e) return;
    const inv = {
      id: `i_${Date.now()}`,
      number: e.number.replace("EST", "INV"),
      customerId: e.customerId,
      date: new Date().toISOString().slice(0, 10),
      productId: e.items[0]?.productId ?? "",
      qty: e.items[0]?.qty ?? 1,
      subtotal: e.subtotal,
      gstAmount: e.taxAmount,
      total: e.total,
      paid: 0,
      status: "Pending" as const,
      branchId: e.branchId,
      billType: e.billType,
    };
    add("invoices", inv);
    logAudit({ user: "Current User", entity: "Estimate", entityId: e.number, action: "Converted to Invoice", newValue: inv.number });
  };

  const cols: GridColumn<(typeof scoped)[number]>[] = [
    { accessorKey: "number", header: "Estimate #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "customerName", header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "billType", header: "Type", format: (v) => <Badge variant="outline">{v}</Badge> },
    { accessorKey: "subtotal", header: "Subtotal", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "taxAmount", header: "GST", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "total", header: "Total", summary: "sum", format: (v) => <span className="font-semibold">{inr(v)}</span> },
    { accessorKey: "status", header: "Status", format: (v) => <Badge variant={v === "Converted" ? "default" : "secondary"}>{v}</Badge> },
    { accessorKey: "id", header: "Actions", exportable: false, format: (_v, row) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit"><Pencil className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" title="Print"><Printer className="h-3 w-3" /></Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => convert(row.id)} disabled={row.status === "Converted"}>
          Convert <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" title="Delete" onClick={() => remove("estimates", row.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    )},
  ];

  return (
    <DataGrid id="estimates" title="Estimate List"
      description="Quote prospects with auto-numbered estimates. Convert to invoice in one click."
      data={scoped} columns={cols} dateField="date"
      toolbarExtra={
        <Button asChild size="sm">
          <Link to="/sales/estimates/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> New Estimate</Link>
        </Button>
      }
    />
  );
}

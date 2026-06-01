import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { useBranchScope } from "@/lib/branch-context";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/sales/credit-notes")({ component: CreditNotesPage });

function CreditNotesPage() {
  const { creditNotes, customers } = useData();
  const scoped = useBranchScope(creditNotes);
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const rows = scoped.map((n) => ({ ...n, customer: cMap[n.customerId] ?? "" }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number", header: "CN #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "invoiceNumber", header: "Against Invoice", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "customer", header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "reason", header: "Reason" },
    { accessorKey: "amount", header: "Amount", summary: "sum", format: (v) => <span className="font-semibold">{inr(v)}</span> },
  ];
  return <DataGrid id="credit-notes" title="Credit Notes"
    description="Returns, refunds and adjustments issued against sales invoices."
    data={rows} columns={cols} dateField="date" />;
}

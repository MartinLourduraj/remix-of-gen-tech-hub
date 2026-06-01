import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { useBranchScope } from "@/lib/branch-context";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/sales/debit-notes")({ component: DebitNotesPage });

function DebitNotesPage() {
  const { debitNotes, customers } = useData();
  const scoped = useBranchScope(debitNotes);
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const rows = scoped.map((n) => ({ ...n, customer: cMap[n.customerId] ?? "" }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number", header: "DN #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "invoiceNumber", header: "Against Invoice", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "customer", header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "reason", header: "Reason" },
    { accessorKey: "amount", header: "Amount", summary: "sum", format: (v) => <span className="font-semibold">{inr(v)}</span> },
  ];
  return <DataGrid id="debit-notes" title="Debit Notes"
    description="Additional charges (freight, handling, rate revisions) issued against invoices."
    data={rows} columns={cols} dateField="date" />;
}

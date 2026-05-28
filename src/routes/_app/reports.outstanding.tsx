import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/reports/outstanding")({ component: OutstandingReport });

function OutstandingReport() {
  const { customers, invoices } = useData();
  const rows = customers.map((c) => {
    const open = invoices.filter((i) => i.customerId === c.id && i.status !== "Paid");
    const due = open.reduce((s, i) => s + (i.total - i.paid), 0);
    return {
      code: c.code, name: c.name, type: c.type, city: c.city, state: c.state,
      creditLimit: c.creditLimit, outstanding: c.outstanding || due,
      invoiceCount: open.length, mobile: c.mobile, email: c.email,
    };
  }).filter((r) => r.outstanding > 0);
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "code",        header: "Code", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "name",        header: "Customer", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "type",        header: "Type" },
    { accessorKey: "city",        header: "City" },
    { accessorKey: "state",       header: "State" },
    { accessorKey: "mobile",      header: "Mobile" },
    { accessorKey: "invoiceCount",header: "Open Inv", summary: "sum" },
    { accessorKey: "creditLimit", header: "Credit Limit", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "outstanding", header: "Outstanding", summary: "sum",
      format: (v) => <span className="font-semibold text-rose-600">{inr(v)}</span> },
  ];
  return <DataGrid id="outstanding" title="Outstanding / Aging Report" description="Customer-wise unpaid balances."
    data={rows} columns={cols} />;
}
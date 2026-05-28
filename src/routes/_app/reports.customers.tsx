import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/reports/customers")({ component: CustomerReport });

function CustomerReport() {
  const { customers } = useData();
  const cols: GridColumn<(typeof customers)[number]>[] = [
    { accessorKey: "code",  header: "Code", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "name",  header: "Name", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "type",  header: "Type" },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "mobile",header: "Mobile" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "city",  header: "City" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "pincode", header: "Pincode" },
    { accessorKey: "creditLimit", header: "Credit Limit", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "outstanding", header: "Outstanding", summary: "sum", format: (v) => inr(v) },
  ];
  return <DataGrid id="customers" title="Customer List" data={customers as any} columns={cols} />;
}
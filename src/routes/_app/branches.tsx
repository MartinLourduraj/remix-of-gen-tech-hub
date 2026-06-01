import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/branches")({ component: BranchesPage });

function BranchesPage() {
  const { branches, companies, employees } = useData();
  const coMap = Object.fromEntries(companies.map((c) => [c.id, c.name]));
  const emMap = Object.fromEntries(employees.map((e) => [e.id, e.name]));
  const rows = branches.map((b) => ({ ...b, companyName: coMap[b.companyId] ?? "", managerName: emMap[b.managerEmpId ?? ""] ?? "—" }));
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "code", header: "Code", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "name", header: "Branch", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "companyName", header: "Company" },
    { accessorKey: "type", header: "Type", format: (v) => <Badge variant="outline">{v}</Badge> },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "pincode", header: "Pincode" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "managerName", header: "Manager" },
    { accessorKey: "active", header: "Status", format: (v) => <Badge variant={v ? "default" : "secondary"}>{v ? "Active" : "Inactive"}</Badge> },
  ];
  return <DataGrid id="branches" title="Branches"
    description="Head office, branch offices, warehouses, service centers and dealer offices grouped by company."
    data={rows} columns={cols} />;
}

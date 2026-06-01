import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/companies")({ component: CompaniesPage });

function CompaniesPage() {
  const { companies } = useData();
  const cols: GridColumn<(typeof companies)[number]>[] = [
    { accessorKey: "code", header: "Code", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "name", header: "Name", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "legalName", header: "Legal Name" },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "pan", header: "PAN" },
    { accessorKey: "cin", header: "CIN" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "pincode", header: "Pincode" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "active", header: "Status", format: (v) => <Badge variant={v ? "default" : "secondary"}>{v ? "Active" : "Inactive"}</Badge> },
  ];
  return <DataGrid id="companies" title="Companies"
    description="Master list of legal entities — GSTIN, PAN, registered address, contacts, branding."
    data={companies} columns={cols} />;
}

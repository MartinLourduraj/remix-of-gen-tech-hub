import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/reports/employees")({ component: EmployeeReport });

function EmployeeReport() {
  const { employees } = useData();
  const cols: GridColumn<(typeof employees)[number]>[] = [
    { accessorKey: "empId",        header: "Emp ID", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "name",         header: "Name", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "designation",  header: "Designation" },
    { accessorKey: "department",   header: "Department" },
    { accessorKey: "branch",       header: "Branch" },
    { accessorKey: "mobile",       header: "Mobile" },
    { accessorKey: "email",        header: "Email" },
    { accessorKey: "joiningDate",  header: "Joined" },
  ];
  return <DataGrid id="employees" title="Employee List" data={employees as any} columns={cols} dateField="joiningDate" />;
}
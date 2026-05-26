import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/employees")({ component: EmployeesPage });

function EmployeesPage() {
  const { employees } = useData();
  return (
    <div>
      <PageHeader title="Employees" description="Workforce across sales, service, accounts and warehouse." action={{ label: "New Employee" }} />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emp ID</TableHead><TableHead>Name</TableHead><TableHead>Designation</TableHead>
              <TableHead>Department</TableHead><TableHead>Branch</TableHead><TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead><TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-mono text-xs">{e.empId}</TableCell>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell>{e.designation}</TableCell>
                <TableCell><Badge variant="secondary">{e.department}</Badge></TableCell>
                <TableCell>{e.branch}</TableCell>
                <TableCell>{e.mobile}</TableCell>
                <TableCell className="text-muted-foreground">{e.email}</TableCell>
                <TableCell>{e.joiningDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
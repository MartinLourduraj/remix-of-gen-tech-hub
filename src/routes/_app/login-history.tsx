import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/login-history")({ component: LoginHistoryPage });

function LoginHistoryPage() {
  const { branches, loginHistory: seeded } = useData();
  const { loginHistory: live } = useAuth();
  const all = [...live, ...seeded].sort((a, b) => b.loginAt.localeCompare(a.loginAt));
  const brMap = Object.fromEntries(branches.map((b) => [b.id, b.name]));
  return (
    <div>
      <PageHeader title="Login History" description="User · Branch · Date · Time · IP — full audit trail of sign-ins and sign-outs." />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Branch</TableHead>
            <TableHead>Login</TableHead><TableHead>Logout</TableHead>
            <TableHead>IP Address</TableHead><TableHead>Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {all.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{h.user}</TableCell>
                <TableCell>{h.role}</TableCell>
                <TableCell>{brMap[h.branchId ?? ""] ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs">{h.loginAt}</TableCell>
                <TableCell className="font-mono text-xs">{h.logoutAt ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs">{h.ip}</TableCell>
                <TableCell><Badge variant={h.logoutAt ? "secondary" : "default"}>{h.logoutAt ? "Closed" : "Active"}</Badge></TableCell>
              </TableRow>
            ))}
            {all.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No login activity recorded yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
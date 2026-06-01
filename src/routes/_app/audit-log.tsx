import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/audit-log")({ component: AuditLogPage });

function AuditLogPage() {
  const { auditLogs } = useData();
  const cols: GridColumn<(typeof auditLogs)[number]>[] = [
    { accessorKey: "datetime", header: "Timestamp", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "user", header: "User", format: (v) => <span className="font-medium">{v}</span> },
    { accessorKey: "entity", header: "Entity" },
    { accessorKey: "entityId", header: "Reference", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "action", header: "Action", format: (v) => <Badge variant="outline">{v}</Badge> },
    { accessorKey: "oldValue", header: "Old Value", format: (v) => <span className="text-xs text-muted-foreground">{v ?? "—"}</span> },
    { accessorKey: "newValue", header: "New Value", format: (v) => <span className="text-xs">{v ?? "—"}</span> },
  ];
  return <DataGrid id="audit-log" title="Audit Log"
    description="Tracks invoice/estimate edits, B2B↔B2C conversions, branch switches and GST modifications."
    data={auditLogs} columns={cols} dateField="datetime" />;
}

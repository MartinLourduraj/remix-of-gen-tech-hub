import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useData } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import type { Department } from "@/lib/types";

export const Route = createFileRoute("/_app/departments")({ component: DepartmentsPage });

function DepartmentsPage() {
  const { departments, add, update, remove } = useData();
  const [q, setQ] = React.useState("");
  const [editing, setEditing] = React.useState<Partial<Department> | null>(null);
  const filtered = departments.filter((d) => [d.code, d.name, d.description].join(" ").toLowerCase().includes(q.toLowerCase()));
  const save = () => {
    if (!editing?.name || !editing?.code) { toast.error("Code and Name required"); return; }
    if (editing.id) update("departments", editing.id, editing);
    else add("departments", { ...editing, id: `dp${Date.now()}` } as Department);
    setEditing(null); toast.success("Saved");
  };
  return (
    <div>
      <PageHeader title="Department Master">
        <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="h-9 w-64" />
        <Button size="sm" onClick={() => setEditing({ code: "", name: "", description: "" })}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add New</Button>
      </PageHeader>
      {editing && (
        <Card className="p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Code" value={editing.code ?? ""} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
          <Input placeholder="Name" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <Input placeholder="Description" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <div className="flex gap-2">
            <Button size="sm" onClick={save}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="mr-1.5 h-3.5 w-3.5" /> Cancel</Button>
          </div>
        </Card>
      )}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">{d.code}</TableCell>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell className="text-muted-foreground">{d.description}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(d)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Delete?")) { remove("departments", d.id); toast.success("Deleted"); } }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
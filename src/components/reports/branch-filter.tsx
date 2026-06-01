import { useData } from "@/lib/store";
import { useBranch } from "@/lib/branch-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

export function BranchFilter({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  const { branches, companies } = useData();
  const { selectedBranchId } = useBranch();
  return (
    <div className="flex items-center gap-1.5">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-48 text-xs">
          <SelectValue placeholder="Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Branches</SelectItem>
          {selectedBranchId && (
            <SelectItem value={selectedBranchId}>
              Current Session ({branches.find((b) => b.id === selectedBranchId)?.name})
            </SelectItem>
          )}
          {companies.map((co) => (
            <div key={co.id}>
              <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">{co.name}</div>
              {branches.filter((b) => b.companyId === co.id).map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

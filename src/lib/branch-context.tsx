import * as React from "react";
import { useData } from "./store";
import type { Branch, Company } from "./types";

type Ctx = {
  selectedBranchId: string | null;
  setSelectedBranchId: (id: string | null) => void;
  branch: Branch | null;
  company: Company | null;
};

const BranchCtx = React.createContext<Ctx | null>(null);
const KEY = "gentech_branch";

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const { branches, companies } = useData();
  const [selectedBranchId, setBranchState] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(KEY);
    if (stored) setBranchState(stored);
  }, []);

  const setSelectedBranchId = (id: string | null) => {
    setBranchState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem(KEY, id);
      else localStorage.removeItem(KEY);
    }
  };

  const branch = React.useMemo(
    () => branches.find((b) => b.id === selectedBranchId) ?? null,
    [branches, selectedBranchId]
  );
  const company = React.useMemo(
    () => (branch ? companies.find((c) => c.id === branch.companyId) ?? null : null),
    [companies, branch]
  );

  return (
    <BranchCtx.Provider value={{ selectedBranchId, setSelectedBranchId, branch, company }}>
      {children}
    </BranchCtx.Provider>
  );
}

export function useBranch() {
  const ctx = React.useContext(BranchCtx);
  if (!ctx) throw new Error("useBranch outside provider");
  return ctx;
}

/** Filter a list of records by the currently selected branch. Pass "all" for no filter. */
export function useBranchScope<T extends { branchId?: string }>(rows: T[]): T[] {
  const { selectedBranchId } = useBranch();
  return React.useMemo(() => {
    if (!selectedBranchId || selectedBranchId === "all") return rows;
    return rows.filter((r) => !r.branchId || r.branchId === selectedBranchId);
  }, [rows, selectedBranchId]);
}

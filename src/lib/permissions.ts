// Permission-driven menu visibility helpers.
// Reads role->module permission matrix saved by /roles page in localStorage.

import type { Role } from "./types";

const KEY = "gentech_role_matrix";

// Map ERP roles -> matrix role name used in /roles page.
const ROLE_TO_MATRIX: Record<string, string> = {
  "Super Admin": "Super Admin",
  "Admin": "Admin",
  "Accounts Manager": "Accounts",
  "Sales Manager": "Sales",
  "Sales Executive": "Sales",
  "Service Manager": "Service",
  "Service Engineer": "Service",
  "Inventory Manager": "Store",
  "Branch Manager": "Admin",
  "Dealer": "Dealer",
  "Customer": "Dealer",
};

type Perm = "View" | "Create" | "Edit" | "Delete" | "Approve" | "Export" | "Print" | "Import";
type Matrix = Record<string, Record<string, Record<Perm, boolean>>>;

function loadMatrix(): Matrix | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as Matrix : null; }
  catch { return null; }
}

export function canView(role: Role | undefined, module: string): boolean {
  if (!role) return false;
  if (role === "Super Admin") return true;
  const matrix = loadMatrix();
  if (!matrix) {
    // Fallback defaults when admin hasn't saved a custom matrix yet.
    const r = ROLE_TO_MATRIX[role] ?? role;
    if (r === "Admin") return true;
    const allow: Record<string, string[]> = {
      Accounts: ["Dashboard","Invoices","Credit Notes","Debit Notes","Customers","Reports","GST","Audit Log"],
      Sales: ["Dashboard","Customers","Products","Price List","Estimates","Quotations","Sales Orders","Invoices","Reports"],
      Service: ["Dashboard","Service","Warranty","Customers","Products","Reports"],
      Store: ["Dashboard","Products","Inventory","Vendors","Reports"],
      Dealer: ["Dashboard","Products","Price List","Estimates","Quotations"],
    };
    return (allow[r] ?? []).includes(module);
  }
  const r = ROLE_TO_MATRIX[role] ?? role;
  return !!matrix[r]?.[module]?.View;
}

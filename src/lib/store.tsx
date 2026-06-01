import * as React from "react";
import {
  seedCustomers, seedProducts, seedVendors, seedEmployees,
  seedQuotations, seedSalesOrders, seedInvoices, seedWarranties,
  seedServiceTickets, seedStock,
  seedCompanies, seedBranches, seedEstimates, seedCreditNotes, seedDebitNotes, seedAuditLogs,
} from "./seed";
import type {
  Customer, Product, Vendor, Employee, Quotation, SalesOrder,
  Invoice, Warranty, ServiceTicket, StockMovement,
  Company, Branch, Estimate, CreditNote, DebitNote, AuditLog,
} from "./types";

type DataState = {
  companies: Company[];
  branches: Branch[];
  customers: Customer[];
  products: Product[];
  vendors: Vendor[];
  employees: Employee[];
  quotations: Quotation[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
  estimates: Estimate[];
  creditNotes: CreditNote[];
  debitNotes: DebitNote[];
  warranties: Warranty[];
  tickets: ServiceTicket[];
  stock: StockMovement[];
  auditLogs: AuditLog[];
};

type Ctx = DataState & {
  add: <K extends keyof DataState>(key: K, item: DataState[K][number]) => void;
  update: <K extends keyof DataState>(key: K, id: string, patch: Partial<DataState[K][number]>) => void;
  remove: <K extends keyof DataState>(key: K, id: string) => void;
  logAudit: (e: { user: string; entity: string; entityId: string; action: string; oldValue?: string; newValue?: string }) => void;
};

const DataContext = React.createContext<Ctx | null>(null);

const initial: DataState = {
  companies: seedCompanies,
  branches: seedBranches,
  customers: seedCustomers,
  products: seedProducts,
  vendors: seedVendors,
  employees: seedEmployees,
  quotations: seedQuotations,
  salesOrders: seedSalesOrders,
  invoices: seedInvoices,
  estimates: seedEstimates,
  creditNotes: seedCreditNotes,
  debitNotes: seedDebitNotes,
  warranties: seedWarranties,
  tickets: seedServiceTickets,
  stock: seedStock,
  auditLogs: seedAuditLogs,
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DataState>(initial);

  const add: Ctx["add"] = (key, item) =>
    setState((s) => ({ ...s, [key]: [item, ...(s[key] as any[])] } as DataState));
  const update: Ctx["update"] = (key, id, patch) =>
    setState((s) => ({
      ...s,
      [key]: (s[key] as any[]).map((x) => (x.id === id ? { ...x, ...patch } : x)),
    } as DataState));
  const remove: Ctx["remove"] = (key, id) =>
    setState((s) => ({ ...s, [key]: (s[key] as any[]).filter((x) => x.id !== id) } as DataState));

  const logAudit: Ctx["logAudit"] = (e) => {
    const entry: AuditLog = {
      id: `al_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      datetime: new Date().toISOString().slice(0, 16).replace("T", " "),
      ...e,
    };
    setState((s) => ({ ...s, auditLogs: [entry, ...s.auditLogs] }));
  };

  return (
    <DataContext.Provider value={{ ...state, add, update, remove, logAudit }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = React.useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const inrShort = (n: number) => {
  if (n >= 1e7) return `\u20B9${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `\u20B9${(n / 1e5).toFixed(2)} L`;
  if (n >= 1e3) return `\u20B9${(n / 1e3).toFixed(1)}K`;
  return `\u20B9${n}`;
};

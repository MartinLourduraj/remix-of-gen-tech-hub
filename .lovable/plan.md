# Phase 4 — Multi-Branch, Billing, Estimates & Audit

This is a large scope. I'll implement it in **frontend-only mock data** (matching the current store-based architecture — no Supabase tables yet) so the entire ERP keeps working. We can wire Lovable Cloud persistence in a follow-up.

## 1. Data layer (`src/lib/`)

- **`types.ts`** — add `Company`, `Branch`, `Estimate`, `CreditNote`, `DebitNote`, `AuditLog`. Add `branchId` + `companyId` to `Customer`, `Vendor`, `Product`, `Quotation`, `SalesOrder`, `Invoice`, `Warranty`, `ServiceTicket`, `StockMovement`.
- **`seed.ts`** — seed 2 companies, 4 branches (HO + Puducherry + TN + Warehouse), backfill `branchId` on existing rows round-robin.
- **`store.tsx`** — add `companies`, `branches`, `estimates`, `creditNotes`, `debitNotes`, `auditLogs` collections + `logAudit(entity, action, oldVal, newVal)` helper.
- **`branch-context.tsx`** — new `BranchProvider` w/ `selectedBranchId`, `selectedCompanyId`, persisted in `localStorage`. Hook `useBranch()` exposes current branch object + setter. Hook `useBranchScope<T>(rows)` filters by `branchId` (returns all if "All Branches" selected for admins).

## 2. Auth & Branch Selection flow

- **`login.tsx`** — on submit, instead of going straight to `/dashboard`, navigate to `/select-branch`.
- **`src/routes/select-branch.tsx`** (new, public) — radio list of branches for the logged-in user's company, "Continue" button writes to `BranchContext` and routes to `/dashboard`.
- **`app-shell.tsx`** — header shows current Company • Branch with a "Switch Branch" dropdown that returns to `/select-branch`.

## 3. Masters

- **`src/routes/_app/companies.tsx`** — full CRUD list (code, name, GSTIN, PAN, CIN, address, contacts, logo/sign/seal upload stubs, active toggle). Uses `DataGrid` from existing reports framework.
- **`src/routes/_app/branches.tsx`** — CRUD list scoped by company. Branch type select, manager dropdown from employees.
- Add nav entries under **Masters** group in `app-shell.tsx`.

## 4. Sales menu restructure

Reorganize sidebar to:
```
Sales
 ├ New Estimate     /sales/estimates/new
 ├ Estimate List    /sales/estimates
 ├ New Invoice      /sales/invoices/new
 ├ Invoice List     /sales/invoices
 ├ Credit Note      /sales/credit-notes
 └ Debit Note       /sales/debit-notes
```

- **`reports/document-form.tsx`** — shared estimate/invoice form (customer picker w/ inline create, line items, qty/rate/disc/tax, totals, B2B/B2C toggle).
- **`estimates/index.tsx` + `estimates.new.tsx` + `estimates.$id.tsx`** — list, create, view/edit; actions Save/Edit/View/Print/Convert→Invoice/Delete. Auto number `EST/2026/0001`.
- **`invoices/index.tsx` + `invoices.new.tsx` + `invoices.$id.tsx`** — Create/Save/Edit/Print/Duplicate/Cancel/**Convert Type** (B2C↔B2B updates GST treatment + recomputes tax + writes audit log).
- **`credit-notes.tsx`, `debit-notes.tsx`** — list + simple create modal.
- Old `/invoices` route → redirect to `/sales/invoices`. Old `/quotations` stays.

## 5. Print Framework

- **`src/components/print/print-document.tsx`** — generic A4 template: company logo, branch block (name/addr/GSTIN/mobile/email), title, party block, line items table, totals, QR placeholder, signature placeholder.
- Per-doc wrappers: `EstimatePrint`, `InvoicePrint`, `QuotationPrint`, `WarrantyPrint`.
- Uses `window.print()` w/ print-only CSS. Configurable via props.

## 6. Reports upgrades

- **`reports/date-filter.tsx`** — extend quick presets: Today, Yesterday, This Week, This Month, Last Month, This Quarter, This Year, Financial Year, On Date, From/To.
- **`reports/branch-filter.tsx`** (new) — Company + Branch dropdowns with "All".
- **`reports/data-grid.tsx`** — column visibility menu already exists; add Select All / Deselect All / Save Layout (already via `saved-views`) / Reset Layout buttons. Confirm Excel/PDF/Print exports use only visible columns and inject Company + Branch + Date Range + Applied Filters in the header.
- Wire branch filter into all existing report routes (sales, invoices, customers, collections, inventory, service, warranty, GST, accounts, etc.).

## 7. Audit Log

- **`src/routes/_app/audit-log.tsx`** — `DataGrid` of `auditLogs` (user, datetime, entity, action, old→new diff).
- `logAudit()` called from invoice edit, estimate edit, B2B↔B2C convert, branch switch, GST modify.

## 8. Permissions (lightweight)

Reuse existing role system in `auth.tsx`. Add `can(role, "invoice.edit")` style helper; gate edit/convert buttons. Full RBAC matrix can come later.

## Out of scope for this turn
- Real file upload backend for logo/sign/seal (uses object URLs).
- Lovable Cloud schema (`companies`, `branches`, etc.) — can be a follow-up migration once UI is signed off.
- Real RBAC matrix editor.
- Final print format (template is configurable as requested).

## Suggested execution order
1. Data layer + BranchProvider + select-branch route
2. Company + Branch masters
3. Sales restructure (estimates, invoices, credit/debit, convert type, edit, duplicate, cancel)
4. Print framework
5. Reports: branch filter + date presets + audit log
6. Final nav audit

Estimated ~30 file changes. Shall I proceed in this order, or would you like to drop / reorder anything (e.g., defer Print Framework, defer Credit/Debit Notes)?
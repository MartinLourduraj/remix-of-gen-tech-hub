# Continuation Plan — Theme Contrast + Cash Abstract + Billing/Estimation Upgrade

This request is very large (7 parts, ~150 sub-requirements). To ship it safely without breaking the existing 30-theme engine, existing billing/quotations, and existing routes, I'll do it in **4 sequential phases**. Each phase is independently shippable and verifiable. I'd like your confirmation on scope before I start, since some choices affect data model + workflows.

---

## Phase 1 — Theme text-contrast fix (Part 1)

Goal: no more white-on-white / dark-on-dark anywhere, across all 30 themes, without regressing the current look of any theme.

**What I'll change**
- Extend `src/lib/themes.ts` `ThemeVars` with the missing semantic tokens actually used by shadcn + app-shell: `popover/popover-foreground`, `sidebar-*` (bg, fg, hover, active, border, ring), `navbar/navbar-foreground/navbar-border`, `menu/menu-foreground/menu-hover*`, `input-foreground`, `placeholder`, `link/link-hover`, `success/warning/danger/info` (+ foregrounds), `table-header*`, `table-row-alt*`. Each of the 30 themes gets explicit values derived from its palette (dark-fg on light surfaces, light-fg on dark surfaces, contrast-checked against WCAG AA).
- `src/styles.css`: map new tokens under `@theme inline` and audit the special-theme scoped blocks (`[data-theme="lamborghini-orange"]`, hero themes, magnetic-dark, aurora) — replace any hardcoded `#fff` / `rgba(255,255,255,…)` text with `var(--foreground)` / `var(--sidebar-foreground)` / `var(--navbar-foreground)`.
- Audit hardcoded text/bg utility classes across `src/components/**` and `src/routes/**`. Replace **only** theme-sensitive ones: `text-white` → `text-primary-foreground` on primary-bg elements or `text-foreground` elsewhere; `bg-white` → `bg-card`/`bg-background`; `text-gray-500` → `text-muted-foreground`, etc. Keep hardcoded colors that are intentionally brand-locked (e.g. print stylesheets, PDF exports, third-party logos).
- Fix the reported public mega-menu / navbar contrast: rework `src/components/public-shell.tsx` and any nav dropdowns to use the new `navbar-*` and `menu-*` tokens with defined hover/active states.

**Verification**: build + typecheck; Playwright screenshot the ERP dashboard, public home, mega menu, login, and one form page under 4 themes (Industrial Blue, Dark Professional, Lamborghini Orange, one Special) to confirm readable text.

---

## Phase 2 — Cash Abstract module (Part 2)

New page under ERP at `/_app/cash-abstract` (added to sidebar under Reports/Finance).

**What I'll build (frontend + in-memory store, matching existing app pattern)**
- Route `src/routes/_app/cash-abstract.tsx` with 3 tabs: **Summary**, **Detailed**, **Reconciliation**.
- Filters bar: date / from-to / quick ranges (Today, Yesterday, This Week, This Month, Custom), Branch, Employee, Cashier, Customer, Transaction Type, Payment Mode, Status.
- KPI cards (all listed: Opening Cash, Cash Sales, Credit Sales, Total Sales, Purchases, Returns, Receipts, Payments, Card/UPI/Cheque/Bank, Expected Closing, Actual Closing, Difference) — theme-aware, with counts + skeletons.
- Detailed sections as `DataGrid` tables (reuse `src/components/reports/data-grid.tsx`): Daily Sales, Daily Purchases, Sales Returns, Purchase Returns, Credit/Debit Ledger — with search/sort/filter/pagination/column visibility/Excel/PDF/Print (already provided by `DataGrid` + `exporters.ts`).
- Payment Mode Reconciliation table (Opening / Inflow / Outflow / Refund / Adjustment / Expected / Actual / Difference per mode).
- Cash Tally block with the exact formula requested, status badge (TALLIED / SHORT / EXCESS / PENDING), plus transaction-movement reconciliation block.
- Printable Summary view using existing `print-document.tsx`.

**Data**: derive from existing `useData()` store (invoices, purchases, receipts, payments, returns) — no schema changes. Where the store lacks a field (e.g. per-invoice payment allocations, opening cash), I'll add a small in-memory extension in `src/lib/store.tsx` + seed sample data in `src/lib/seed.ts`, following existing patterns. No Supabase migration in this phase.

---

## Phase 3 — Advanced Billing upgrade (Part 3)

Upgrade **existing** invoice-new route (`src/routes/_app/sales/invoices.new.tsx`) — will not create a duplicate page.

- 3-section layout: Header / Items / Transaction+Payment.
- Header: Branch, Invoice Type, Invoice #, Date, Time, Employee, Sales Person, Counter, Ref #, Customer (searchable combobox with add/edit/outstanding/history/credit-limit quick actions; auto-fill name/mobile/GSTIN/PAN/address/credit/outstanding).
- Multi-item grid with all listed columns incl. serialized generator fields (Serial/Engine/Alternator/Model #). Add / duplicate / remove / barcode-scan (input field triggered by scanner), rate override behind permission check.
- Item calc engine (Gross → Discount → Taxable → Tax → Net) with intra vs inter-state split (CGST/SGST vs IGST) based on branch state vs customer place-of-supply.
- Sticky Bill Total panel with all totals + prominent Grand Total.
- Transaction Details block (GSTINs, PAN, POS, state code, reverse charge, e-Invoice IRN, e-way bill, transport, vehicle, delivery/internal notes).
- Payment section supporting Cash/Card/Cheque/UPI/Bank/Credit/Advance + **Mixed** with per-mode fields and allocation validation (sum = settled amount, remaining indicator).
- Actions: Save Draft, Hold, Resume, Calculate, Preview, Save, Save & Print, Save & New, Email, WhatsApp (placeholder), Cancel (with confirm).

Store: extend invoice type with payment allocations, hold/draft state, serialized-item fields — additive, non-breaking. All existing consumers (invoices list, reports, print) keep working.

---

## Phase 4 — Estimation upgrade + conversion (Part 4)

Upgrade **existing** `src/routes/_app/sales/estimates.new.tsx` with the same 3-section pattern:

- Header incl. Valid Until, Enquiry Ref, Source (Walk-In/Phone/Website/Dealer/Referral/Campaign/Other).
- Item grid matching Billing grid (minus serial/payment fields; plus category tags: Generator / Spare / Accessory / Installation / Delivery / AMC / Service / Rental).
- Summary + Terms (Payment / Delivery / Warranty / Installation / Validity / Notes / Internal / T&C).
- Actions: Save Draft, Preview, Print, Export PDF, Email, Duplicate, Revise, **Convert to Quotation / Sales Order / Invoice** — conversion carries customer, items, qty, rate, discount, tax, charges, and relevant terms into the destination form via router state.

---

## Cross-cutting

- **Responsive** (Part 5): grid on desktop/laptop, sticky-column horizontal scroll on tablet, expandable item cards on mobile for Billing/Estimation.
- **Theme integration** (Part 6): every new component uses only semantic tokens — verified against 4 representative themes per phase.
- **No route removals, no data-model rewrites, no existing-page duplicates.**

---

## Technical notes

- All work is frontend-only (React/TS/Vite/Tailwind v4 + shadcn) plus in-memory store extensions in `src/lib/store.tsx` and seed data in `src/lib/seed.ts`. No Supabase migrations planned unless you want persistence — say the word and I'll add tables + RLS + GRANTs for invoices/payments/cash-abstract in a separate phase.
- Estimated turns: Phase 1 ≈ 3–4, Phase 2 ≈ 4–5, Phase 3 ≈ 5–6, Phase 4 ≈ 3–4.

---

## Questions before I start

1. **Order**: proceed Phase 1 → 2 → 3 → 4, or reprioritize (e.g. Billing first)?
2. **Persistence**: keep everything in the current in-memory store (fast, matches existing app), or add Lovable Cloud tables for invoices/payments/cash-abstract now?
3. **Scope trim**: OK to defer WhatsApp send, e-Invoice IRN generation, and barcode-scanner hardware integration to placeholders (UI + hooks only) in this pass?

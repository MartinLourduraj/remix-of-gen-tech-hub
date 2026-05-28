
# Phase 3 Plan — UX Polish, Login, Compare & Enterprise Reporting

Scope is split into 4 independent workstreams. All work is frontend/presentation on the existing mock store — no schema changes.

## 1. Product Module — Remove Prices (Public)

Files: `src/routes/_public/index.tsx`, `src/routes/_public/products.tsx`, `src/routes/_public/products.$id.tsx`, `src/routes/_public/used-generators.tsx`, `src/routes/_public/rental-generators.tsx`.

- Strip every `₹` / `inr(price)` rendering from public surfaces.
- Replace each price slot with action buttons: **Request Quote**, **Get Best Price**, **Contact Sales**, **Download Brochure**, **Compare**.
- Add a shared `<ProductActions productId>` component in `src/components/product-actions.tsx`.
- Admin pages (`/dashboard/products`, invoices, quotations) keep prices — pricing is internal.

## 2. Advanced Compare Page

File: `src/routes/_public/compare.tsx` (full rewrite).

- Sticky left "spec" column + up to 4 product columns with horizontal scroll.
- Searchable product picker per slot (combobox over mock products).
- Spec rows: Image, Model, kVA, kW, Fuel, Engine Model, Alternator, Frequency, Voltage, Tank, Consumption, Noise, Weight, Dimensions, Starting, Controller, Application, Warranty.
- Auto-highlight best value per numeric row (lowest noise / highest kVA / etc).
- Badges: Best Seller, Recommended, New, Most Efficient (derived from mock flags).
- Toolbar: **Print** (`window.print` + print CSS), **Export PDF** (jspdf + html2canvas), **Clear**, **Compare Similar** (auto-fill by fuel/kVA band).
- Extend product mock in `src/lib/seed.ts` with the missing spec fields.

## 3. Login Page Cleanup

File: `src/routes/login.tsx`.

- Remove Email and Mobile-OTP tabs; keep only **Username + Password**.
- Add **Remember Me** checkbox, **Forgot Password** link, **Sign In** primary button.
- Promote the existing "← Back to Website" button to top-left, high-contrast pill (visible on all viewports, not just lg).
- Left panel: replace static text block with rotating hero (3 slides: hero generator image, promo banner, featured product) using a lightweight interval — keep brand lockup and footer.
- Demo role selector stays (collapsed under "Advanced") so admin/dealer/employee testing still works without 4 separate routes.

## 4. Enterprise Reporting Engine

This is the largest piece. Build a reusable framework once, then mount per report.

### 4a. Shared primitives (`src/components/reports/`)

- `report-shell.tsx` — page wrapper with title, toolbar slot, filter bar, grid slot, footer totals.
- `report-toolbar.tsx` — buttons: Add, Edit, View, Delete, Refresh, Columns, Save View, Export ▾ (Excel/CSV/PDF/Print/Email), Print.
- `date-filter.tsx` — On / From-To + quick chips (Today, Yesterday, This Week, This Month, Last Month, This Quarter, This Year, FY).
- `advanced-filter.tsx` — popover with Customer / Dealer / Employee / Product / Branch / Department / Status selects (driven by store).
- `column-visibility.tsx` — checklist popover with Select/Deselect All, Save Layout, Reset.
- `data-grid.tsx` — built on TanStack Table v8 (already a transitive dep candidate; will `bun add @tanstack/react-table` if absent). Supports: global search, per-column search, multi-sort, resize, reorder, freeze first N, sticky header, pagination, row select, bulk-action slot, grand/sub totals, group-by.
- `saved-views.tsx` — localStorage-backed named layouts ("My View", "Accounts View", etc.) per report key.
- `exporters.ts` — `exportExcel` (sheetjs / `xlsx`), `exportCSV`, `exportPDF` (jspdf + autotable, landscape, company header/footer), `printReport` (dedicated print stylesheet with logo, user, page numbers).

### 4b. Rebuild `/dashboard/reports`

File: `src/routes/_app/reports.tsx` becomes an index of report cards linking to dedicated routes.

New report routes under `src/routes/_app/reports/`:
- `sales.tsx`, `quotations.tsx`, `orders.tsx`, `invoices.tsx`
- `customers.tsx`, `dealers.tsx`, `employees.tsx`
- `products.tsx`, `inventory.tsx`, `purchases.tsx`
- `collections.tsx`, `outstanding.tsx`
- `warranty.tsx`, `service.tsx`, `amc.tsx`
- `branches.tsx`, `accounts.tsx`, `gst.tsx`

Each route is ~30 lines: declare columns + data selector + filter config, hand to `<ReportShell>`. All heavy lifting lives in the shared primitives.

### 4c. Dependencies to add
`@tanstack/react-table`, `xlsx`, `jspdf`, `jspdf-autotable`, `html2canvas`.

## 5. Navigation Audit

Walk every nav link in `public-shell.tsx`, `app-shell.tsx`, homepage CTAs, and footer. Confirm each `<Link to=...>` resolves to an existing route file. Fix any stragglers (e.g. footer links to `/blog`, `/careers` will be stubbed if referenced).

## Out of scope (deferred)
- Real auth, real PDF brochure files, real email delivery for "Email Report".
- Backend wiring for saved views (localStorage only this phase).
- Multi-language, dark mode.

## Suggested execution order
1. Deps install + reports framework primitives (largest).
2. Rebuild reports index + 6 highest-value reports (Sales, Invoices, Outstanding, Inventory, GST, Service). Remaining reports use the same shell — add incrementally.
3. Compare page rewrite + product mock spec expansion.
4. Price removal sweep + ProductActions component.
5. Login redesign.
6. Navigation audit pass.

---

**Confirm and I'll switch to build mode and execute in this order.** Anything you want dropped, reordered, or expanded (e.g. only ship 6 reports vs all 19 this phase)?

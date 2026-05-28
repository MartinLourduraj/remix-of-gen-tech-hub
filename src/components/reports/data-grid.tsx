import * as React from "react";
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel,
  getPaginationRowModel, flexRender, type ColumnDef, type SortingState,
  type VisibilityState, type ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
  DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Search, ArrowUpDown, Columns3, Download, Printer, RefreshCw, Star,
  ChevronLeft, ChevronRight, FileSpreadsheet, FileText, FileType,
} from "lucide-react";
import { DateFilter, type DateRange } from "./date-filter";
import { exportCSV, exportExcel, exportPDF, printReport, type ExportColumn } from "./exporters";
import { listViews, saveView, removeView, type ReportView } from "./saved-views";

export type GridColumn<T> = ColumnDef<T, any> & {
  accessorKey: string;
  header: string;
  exportable?: boolean;
  isNumeric?: boolean;
  summary?: "sum" | "avg" | "count";
  format?: (v: any, row: T) => React.ReactNode;
};

type Props<T> = {
  id: string;                 // unique report key for saved views
  title: string;
  description?: string;
  data: T[];
  columns: GridColumn<T>[];
  dateField?: keyof T;
  toolbarExtra?: React.ReactNode;
  filtersExtra?: React.ReactNode;
  onRefresh?: () => void;
};

export function DataGrid<T extends Record<string, any>>({
  id, title, description, data, columns, dateField, toolbarExtra, filtersExtra, onRefresh,
}: Props<T>) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [visibility, setVisibility] = React.useState<VisibilityState>({});
  const [dateRange, setDateRange] = React.useState<DateRange>({ from: "", to: "" });
  const [pageSize, setPageSize] = React.useState(15);
  const [views, setViews] = React.useState<ReportView[]>([]);

  React.useEffect(() => setViews(listViews(id)), [id]);

  const rendered: GridColumn<T>[] = React.useMemo(() => columns.map((c) => ({
    ...c,
    cell: c.cell ?? (({ getValue, row }) =>
      c.format ? c.format(getValue(), row.original) : String(getValue() ?? "")),
  })), [columns]);

  const filtered = React.useMemo(() => {
    if (!dateField || (!dateRange.from && !dateRange.to)) return data;
    return data.filter((r) => {
      const v = String(r[dateField] ?? "");
      if (dateRange.from && v < dateRange.from) return false;
      if (dateRange.to && v > dateRange.to) return false;
      return true;
    });
  }, [data, dateField, dateRange]);

  const table = useReactTable({
    data: filtered,
    columns: rendered as ColumnDef<T, any>[],
    state: { globalFilter, sorting, columnFilters, columnVisibility: visibility },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  React.useEffect(() => { table.setPageSize(pageSize); }, [pageSize, table]);

  const visibleRows = table.getFilteredRowModel().rows.map((r) => r.original);
  const exportCols: ExportColumn[] = rendered
    .filter((c) => c.exportable !== false && visibility[c.accessorKey] !== false)
    .map((c) => ({ key: c.accessorKey, header: c.header }));

  const meta = {
    reportTitle: title,
    dateRange: dateRange.from || dateRange.to ? `${dateRange.from || "…"} → ${dateRange.to || "…"}` : "All",
    filters: globalFilter ? `Search: ${globalFilter}` : "None",
  };

  const totals = React.useMemo(() => {
    const t: Record<string, number> = {};
    rendered.forEach((c) => {
      if (c.summary === "sum" || c.summary === "avg") {
        const nums = visibleRows.map((r) => Number(r[c.accessorKey]) || 0);
        t[c.accessorKey] = c.summary === "avg"
          ? (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0)
          : nums.reduce((a, b) => a + b, 0);
      }
    });
    return t;
  }, [rendered, visibleRows]);

  const saveCurrentView = () => {
    const name = window.prompt("Save view as", "My View");
    if (!name) return;
    const cols = rendered.filter((c) => visibility[c.accessorKey] !== false).map((c) => c.accessorKey);
    saveView(id, { name, columns: cols, createdAt: new Date().toISOString() });
    setViews(listViews(id));
  };
  const applyView = (v: ReportView) => {
    const vis: VisibilityState = {};
    rendered.forEach((c) => { vis[c.accessorKey] = v.columns.includes(c.accessorKey); });
    setVisibility(vis);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-1.5 print:hidden">
          {toolbarExtra}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Refresh</Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Columns3 className="mr-1.5 h-3.5 w-3.5" /> Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-[60vh] overflow-y-auto">
              <DropdownMenuLabel>Show columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rendered.map((c) => (
                <DropdownMenuCheckboxItem key={c.accessorKey}
                  checked={visibility[c.accessorKey] !== false}
                  onCheckedChange={(v) => setVisibility((s) => ({ ...s, [c.accessorKey]: v }))}>
                  {c.header}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const v: VisibilityState = {}; rendered.forEach((c) => v[c.accessorKey] = true); setVisibility(v);
              }}>Select all</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const v: VisibilityState = {}; rendered.forEach((c) => v[c.accessorKey] = false); setVisibility(v);
              }}>Deselect all</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Star className="mr-1.5 h-3.5 w-3.5" /> Views</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={saveCurrentView}>+ Save current view…</DropdownMenuItem>
              <DropdownMenuSeparator />
              {views.length === 0 && <DropdownMenuLabel className="text-xs text-muted-foreground">No saved views</DropdownMenuLabel>}
              {views.map((v) => (
                <DropdownMenuItem key={v.name} onClick={() => applyView(v)}>
                  <span className="flex-1">{v.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeView(id, v.name); setViews(listViews(id)); }}
                    className="text-xs text-muted-foreground hover:text-destructive ml-2">×</button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportExcel(visibleRows, exportCols, id, meta)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCSV(visibleRows, exportCols, id)}>
                <FileType className="mr-2 h-4 w-4" /> CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportPDF(visibleRows, exportCols, id, meta)}>
                <FileText className="mr-2 h-4 w-4" /> PDF (Landscape)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={printReport}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border bg-muted/30 print:hidden">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8" placeholder="Global search…" value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)} />
        </div>
        {dateField && <DateFilter value={dateRange} onChange={setDateRange} />}
        {filtersExtra}
      </div>

      <div className="rounded-lg border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => {
                    const col = h.column;
                    const sorted = col.getIsSorted();
                    return (
                      <th key={h.id} className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground border-b">
                        <button onClick={col.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-foreground">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          <ArrowUpDown className={`h-3 w-3 ${sorted ? "text-foreground" : "opacity-40"}`} />
                        </button>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr><td colSpan={rendered.length} className="px-3 py-12 text-center text-muted-foreground">No records match the current filters.</td></tr>
              )}
              {table.getRowModel().rows.map((r, i) => (
                <tr key={r.id} className={`border-b last:border-0 hover:bg-muted/40 ${i % 2 ? "bg-muted/10" : ""}`}>
                  {r.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {Object.keys(totals).length > 0 && (
              <tfoot className="bg-[var(--brand-navy)] text-white">
                <tr>
                  {table.getVisibleLeafColumns().map((c, idx) => (
                    <td key={c.id} className="px-3 py-2.5 font-bold text-xs">
                      {idx === 0 ? "TOTAL" : totals[c.id] != null ? formatNum(totals[c.id]) : ""}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground print:hidden">
        <div>
          Showing {table.getRowModel().rows.length} of {filtered.length} records
          {data.length !== filtered.length && ` (filtered from ${data.length})`}
        </div>
        <div className="flex items-center gap-2">
          <span>Rows:</span>
          <select className="h-7 rounded border bg-background px-1.5"
            value={pageSize} onChange={(e) => setPageSize(+e.target.value)}>
            {[10, 15, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span>{table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}</span>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatNum(n: number) {
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
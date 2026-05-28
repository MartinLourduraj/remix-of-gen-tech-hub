import { createFileRoute } from "@tanstack/react-router";
import { useData, inr } from "@/lib/store";
import { DataGrid, type GridColumn } from "@/components/reports/data-grid";

export const Route = createFileRoute("/_app/reports/gst")({ component: GSTReport });

function GSTReport() {
  const { invoices, customers } = useData();
  const cMap = Object.fromEntries(customers.map((c) => [c.id, c]));
  const rows = invoices.map((i) => {
    const c = cMap[i.customerId];
    const isInter = c && c.state !== "Maharashtra"; // HO state
    const cgst = isInter ? 0 : i.gstAmount / 2;
    const sgst = isInter ? 0 : i.gstAmount / 2;
    const igst = isInter ? i.gstAmount : 0;
    return {
      number: i.number, date: i.date,
      gstin: c?.gstin ?? "URP", customer: c?.name ?? "",
      state: c?.state ?? "", supplyType: isInter ? "Inter-State" : "Intra-State",
      taxable: i.subtotal, cgst, sgst, igst, total: i.total,
    };
  });
  const cols: GridColumn<(typeof rows)[number]>[] = [
    { accessorKey: "number", header: "Invoice #", format: (v) => <span className="font-mono text-xs">{v}</span> },
    { accessorKey: "date",   header: "Date" },
    { accessorKey: "gstin",  header: "GSTIN" },
    { accessorKey: "customer", header: "Recipient" },
    { accessorKey: "state",  header: "State" },
    { accessorKey: "supplyType", header: "Supply" },
    { accessorKey: "taxable", header: "Taxable", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "cgst",   header: "CGST", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "sgst",   header: "SGST", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "igst",   header: "IGST", summary: "sum", format: (v) => inr(v) },
    { accessorKey: "total",  header: "Invoice Total", summary: "sum", format: (v) => <span className="font-semibold">{inr(v)}</span> },
  ];
  return <DataGrid id="gst" title="GST Summary (GSTR-1 / 3B)" description="Outward supplies with CGST/SGST/IGST split."
    data={rows} columns={cols} dateField="date" />;
}
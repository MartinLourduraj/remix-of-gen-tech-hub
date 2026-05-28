import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportColumn = { key: string; header: string };

type Meta = {
  reportTitle: string;
  company?: string;
  dateRange?: string;
  filters?: string;
  user?: string;
};

export function exportCSV(rows: any[], cols: ExportColumn[], filename: string) {
  const headers = cols.map((c) => `"${c.header}"`).join(",");
  const body = rows
    .map((r) => cols.map((c) => `"${String(r[c.key] ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportExcel(rows: any[], cols: ExportColumn[], filename: string, meta: Meta) {
  const ws = XLSX.utils.aoa_to_sheet([
    [meta.company ?? "Gen-Tech Generators Pvt Ltd"],
    [meta.reportTitle],
    [`Date Range: ${meta.dateRange ?? "All"}`],
    [`Filters: ${meta.filters ?? "None"}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [],
    cols.map((c) => c.header),
    ...rows.map((r) => cols.map((c) => r[c.key] ?? "")),
  ]);
  ws["!cols"] = cols.map(() => ({ wch: 18 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportPDF(rows: any[], cols: ExportColumn[], filename: string, meta: Meta) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.setTextColor("#0b1f3a");
  doc.text(meta.company ?? "Gen-Tech Generators Pvt Ltd", 40, 40);
  doc.setFontSize(12);
  doc.setTextColor("#444");
  doc.text(meta.reportTitle, 40, 60);
  doc.setFontSize(9);
  doc.setTextColor("#666");
  doc.text(`Date Range: ${meta.dateRange ?? "All"}    Filters: ${meta.filters ?? "None"}`, 40, 76);
  doc.text(`Generated: ${new Date().toLocaleString()}${meta.user ? "  by " + meta.user : ""}`, 40, 90);

  autoTable(doc, {
    startY: 105,
    head: [cols.map((c) => c.header)],
    body: rows.map((r) => cols.map((c) => String(r[c.key] ?? ""))),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [11, 31, 58], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    didDrawPage: (data) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor("#888");
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 80,
        doc.internal.pageSize.getHeight() - 20,
      );
    },
  });

  doc.save(`${filename}.pdf`);
}

export function printReport() {
  window.print();
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
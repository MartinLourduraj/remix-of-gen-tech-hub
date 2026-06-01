import * as React from "react";
import type { Company, Branch } from "@/lib/types";
import { inr } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";

export type PrintLine = {
  description: string;
  hsn?: string;
  qty: number;
  rate: number;
  discount?: number;
  taxPct?: number;
  amount: number;
};

export type PrintDoc = {
  title: string;
  number: string;
  date: string;
  company: Company | null;
  branch: Branch | null;
  party: { name: string; address?: string; mobile?: string; gstin?: string; email?: string };
  lines: PrintLine[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string;
  footer?: string;
  signatureLabel?: string;
};

export function PrintDocument({ doc, onClose }: { doc: PrintDoc; onClose?: () => void }) {
  React.useEffect(() => {
    const orig = document.title;
    document.title = `${doc.title} ${doc.number}`;
    return () => { document.title = orig; };
  }, [doc.number, doc.title]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto print:bg-white print:static print:overflow-visible">
      <div className="max-w-[210mm] mx-auto my-6 bg-white text-black shadow-xl print:my-0 print:shadow-none">
        {/* Toolbar (hidden when printing) */}
        <div className="flex items-center justify-between p-3 border-b print:hidden bg-muted/30">
          <div className="text-xs text-muted-foreground">Preview · A4</div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
            {onClose && (
              <Button size="sm" variant="outline" onClick={onClose}>
                <X className="mr-1.5 h-3.5 w-3.5" /> Close
              </Button>
            )}
          </div>
        </div>

        <div className="p-8 print:p-6">
          {/* Header: company + branch */}
          <div className="flex items-start justify-between gap-6 border-b-2 border-[#0b1f3a] pb-4">
            <div className="flex gap-3">
              {doc.company?.logoUrl ? (
                <img src={doc.company.logoUrl} alt="logo" className="h-14 w-14 object-contain" />
              ) : (
                <div className="h-14 w-14 grid place-items-center rounded bg-[#0b1f3a] text-white font-extrabold text-xl">
                  {doc.company?.code ?? "GT"}
                </div>
              )}
              <div>
                <div className="text-xl font-extrabold text-[#0b1f3a]">{doc.company?.legalName ?? "Company"}</div>
                <div className="text-[11px] text-gray-600">{doc.branch?.address}</div>
                <div className="text-[11px] text-gray-600">
                  {doc.branch?.district}, {doc.branch?.state} – {doc.branch?.pincode}
                </div>
                <div className="text-[11px] text-gray-700 mt-0.5">
                  Mobile: {doc.branch?.mobile} · Email: {doc.branch?.email}
                </div>
                <div className="text-[11px] font-mono text-gray-700">
                  GSTIN: {doc.branch?.gstin} {doc.company?.pan && `· PAN: ${doc.company.pan}`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold uppercase tracking-wide text-[#0b1f3a]">{doc.title}</div>
              <div className="text-[11px] text-gray-600 mt-1">Branch: {doc.branch?.name}</div>
            </div>
          </div>

          {/* Doc meta + Party */}
          <div className="grid grid-cols-2 gap-6 mt-4 text-xs">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Bill To</div>
              <div className="font-bold">{doc.party.name}</div>
              {doc.party.address && <div className="text-gray-700">{doc.party.address}</div>}
              {doc.party.mobile && <div className="text-gray-700">Mobile: {doc.party.mobile}</div>}
              {doc.party.email && <div className="text-gray-700">{doc.party.email}</div>}
              {doc.party.gstin && <div className="font-mono text-gray-700">GSTIN: {doc.party.gstin}</div>}
            </div>
            <div className="text-right space-y-0.5">
              <div><span className="text-gray-500">Document #: </span><span className="font-mono font-bold">{doc.number}</span></div>
              <div><span className="text-gray-500">Date: </span>{doc.date}</div>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-xs mt-5 border border-gray-300">
            <thead>
              <tr className="bg-[#0b1f3a] text-white">
                <th className="px-2 py-2 text-left font-semibold">#</th>
                <th className="px-2 py-2 text-left font-semibold">Description</th>
                <th className="px-2 py-2 text-right font-semibold">Qty</th>
                <th className="px-2 py-2 text-right font-semibold">Rate</th>
                <th className="px-2 py-2 text-right font-semibold">Disc</th>
                <th className="px-2 py-2 text-right font-semibold">Tax%</th>
                <th className="px-2 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {doc.lines.map((l, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-2 py-1.5">{i + 1}</td>
                  <td className="px-2 py-1.5">{l.description}{l.hsn && <span className="text-gray-500"> · HSN {l.hsn}</span>}</td>
                  <td className="px-2 py-1.5 text-right">{l.qty}</td>
                  <td className="px-2 py-1.5 text-right">{inr(l.rate)}</td>
                  <td className="px-2 py-1.5 text-right">{l.discount ? inr(l.discount) : "—"}</td>
                  <td className="px-2 py-1.5 text-right">{l.taxPct ?? 0}%</td>
                  <td className="px-2 py-1.5 text-right font-medium">{inr(l.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-4">
            <table className="text-xs w-72">
              <tbody>
                <tr><td className="py-1 text-gray-600">Subtotal</td><td className="py-1 text-right">{inr(doc.subtotal)}</td></tr>
                <tr><td className="py-1 text-gray-600">GST</td><td className="py-1 text-right">{inr(doc.taxAmount)}</td></tr>
                <tr className="border-t border-[#0b1f3a]"><td className="py-2 font-extrabold">Grand Total</td><td className="py-2 text-right font-extrabold text-[#0b1f3a]">{inr(doc.total)}</td></tr>
              </tbody>
            </table>
          </div>

          {doc.notes && (
            <div className="mt-6 p-3 bg-gray-50 border-l-4 border-[#0b1f3a] text-xs">
              <div className="font-semibold mb-1">Notes</div>
              <div className="text-gray-700 whitespace-pre-line">{doc.notes}</div>
            </div>
          )}

          {/* Footer: QR placeholder + signature */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-4 border-t text-xs">
            <div>
              <div className="text-[10px] uppercase text-gray-500 mb-2">e-Invoice / IRN QR</div>
              <div className="h-24 w-24 border-2 border-dashed border-gray-400 grid place-items-center text-gray-400 text-[10px]">QR</div>
            </div>
            <div className="text-[10px] text-gray-600 leading-relaxed">
              Terms & Conditions:<br/>
              1. Goods once sold will not be taken back.<br/>
              2. Interest @24% p.a. on overdue bills.<br/>
              3. Subject to {doc.branch?.district ?? "—"} jurisdiction.
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase text-gray-500 mb-12">{doc.signatureLabel ?? "For " + (doc.company?.name ?? "")}</div>
              {doc.company?.signatureUrl ? (
                <img src={doc.company.signatureUrl} alt="sig" className="ml-auto h-10" />
              ) : (
                <div className="text-gray-400 italic">[Authorized Signature]</div>
              )}
            </div>
          </div>

          {doc.footer && <div className="text-center text-[10px] text-gray-500 mt-6">{doc.footer}</div>}
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0, .fixed.inset-0 * { visibility: visible; }
          .fixed.inset-0 { position: absolute; inset: 0; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>
    </div>
  );
}

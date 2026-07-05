import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useData, inr } from "@/lib/store";
import { useBranch } from "@/lib/branch-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Save, Printer, Mail, MessageSquare, Plus, Copy, Trash2, Calculator,
  Eye, PauseCircle, FileText, X,
} from "lucide-react";
import type {
  BillType, InvoiceItem, PaymentAllocation, PaymentMode,
} from "@/lib/types";

export const Route = createFileRoute("/_app/sales/invoices/new")({ component: NewInvoicePage });

const PAY_MODES: PaymentMode[] = ["Cash", "Card", "Cheque", "UPI", "Bank", "Credit", "Advance"];

function uid() { return `it_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`; }

function emptyItem(): InvoiceItem {
  return {
    id: uid(), itemCode: "", name: "", hsn: "", qty: 1, unit: "Nos",
    rate: 0, discountPct: 0, taxPct: 18,
  };
}

function calcItem(it: InvoiceItem) {
  const gross = it.qty * it.rate;
  const discountAmt = gross * (it.discountPct / 100);
  const taxable = Math.max(0, gross - discountAmt);
  const taxAmt = taxable * (it.taxPct / 100);
  const cessAmt = taxable * ((it.cess ?? 0) / 100);
  return { gross, discountAmt, taxable, taxAmt, cessAmt, net: taxable + taxAmt + cessAmt };
}

function NewInvoicePage() {
  const {
    customers, products, employees, branches, invoices, add, logAudit,
  } = useData();
  const { branch, company } = useBranch();
  const nav = useNavigate();

  // ---------- HEADER ----------
  const [invoiceType, setInvoiceType] = React.useState("Tax Invoice");
  const [billType, setBillType] = React.useState<BillType>("B2B");
  const [invoiceDate, setInvoiceDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [invoiceTime, setInvoiceTime] = React.useState(new Date().toTimeString().slice(0, 5));
  const [employeeId, setEmployeeId] = React.useState(employees[0]?.id ?? "");
  const [salesPersonId, setSalesPersonId] = React.useState(employees[0]?.id ?? "");
  const [counter, setCounter] = React.useState("Counter-1");
  const [refNo, setRefNo] = React.useState("");
  const [customerId, setCustomerId] = React.useState(customers[0]?.id ?? "");
  const [customerSearch, setCustomerSearch] = React.useState("");
  const customer = customers.find((c) => c.id === customerId);

  // Autofill from selected customer
  const [customerMobile, setCustomerMobile] = React.useState(customer?.mobile ?? "");
  const [customerEmail, setCustomerEmail] = React.useState(customer?.email ?? "");
  const [customerGSTIN, setCustomerGSTIN] = React.useState(customer?.gstin ?? "");
  const [customerPAN, setCustomerPAN] = React.useState(customer?.pan ?? "");
  const [billingAddress, setBillingAddress] = React.useState(
    customer ? `${customer.city}, ${customer.state} - ${customer.pincode}` : ""
  );
  const [shippingAddress, setShippingAddress] = React.useState(billingAddress);
  const [sameAsBilling, setSameAsBilling] = React.useState(true);

  React.useEffect(() => {
    if (!customer) return;
    setCustomerMobile(customer.mobile);
    setCustomerEmail(customer.email);
    setCustomerGSTIN(customer.gstin ?? "");
    setCustomerPAN(customer.pan ?? "");
    const addr = `${customer.city}, ${customer.state} - ${customer.pincode}`;
    setBillingAddress(addr);
    if (sameAsBilling) setShippingAddress(addr);
  }, [customerId]); // eslint-disable-line

  const filteredCustomers = React.useMemo(() => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return customers.slice(0, 50);
    return customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.mobile.includes(q) || c.code.toLowerCase().includes(q))
      .slice(0, 50);
  }, [customerSearch, customers]);

  // ---------- ITEMS ----------
  const [items, setItems] = React.useState<InvoiceItem[]>([emptyItem()]);

  const setItem = (id: string, patch: Partial<InvoiceItem>) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const addRow = () => setItems((xs) => [...xs, emptyItem()]);
  const dupRow = (id: string) =>
    setItems((xs) => {
      const src = xs.find((x) => x.id === id);
      if (!src) return xs;
      return [...xs, { ...src, id: uid() }];
    });
  const removeRow = (id: string) =>
    setItems((xs) => (xs.length === 1 ? xs : xs.filter((x) => x.id !== id)));

  const pickProduct = (id: string, productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setItem(id, {
      productId: p.id,
      itemCode: p.sku,
      name: p.model,
      hsn: p.hsn,
      unit: "Nos",
      rate: p.sellingPrice,
      taxPct: p.gst,
    });
  };

  // ---------- CHARGES / TOTALS ----------
  const [freight, setFreight] = React.useState(0);
  const [installation, setInstallation] = React.useState(0);
  const [delivery, setDelivery] = React.useState(0);
  const [otherCharges, setOtherCharges] = React.useState(0);
  const [billDiscount, setBillDiscount] = React.useState(0);

  // GST split: same-state = CGST/SGST, else IGST
  const branchState = branch?.state ?? "";
  const custState = customer?.state ?? "";
  const isIntraState = !!branchState && !!custState && branchState === custState;

  const calc = React.useMemo(() => {
    const rows = items.map((it) => ({ it, ...calcItem(it) }));
    const gross = rows.reduce((s, r) => s + r.gross, 0);
    const itemDiscount = rows.reduce((s, r) => s + r.discountAmt, 0);
    const taxable = Math.max(0, rows.reduce((s, r) => s + r.taxable, 0) - billDiscount);
    const gst = rows.reduce((s, r) => s + r.taxAmt, 0);
    const cgst = isIntraState ? gst / 2 : 0;
    const sgst = isIntraState ? gst / 2 : 0;
    const igst = isIntraState ? 0 : gst;
    const cess = rows.reduce((s, r) => s + r.cessAmt, 0);
    const charges = freight + installation + delivery + otherCharges;
    const preRound = taxable + gst + cess + charges;
    const grand = Math.round(preRound);
    const roundOff = grand - preRound;
    return {
      rows, gross, itemDiscount, taxable, gst, cgst, sgst, igst,
      cess, charges, grand, roundOff,
      totalItems: items.length,
      totalQty: items.reduce((s, r) => s + r.qty, 0),
    };
  }, [items, freight, installation, delivery, otherCharges, billDiscount, isIntraState]);

  // ---------- TRANSACTION DETAILS ----------
  const [placeOfSupply, setPlaceOfSupply] = React.useState(custState);
  const [stateCode, setStateCode] = React.useState("");
  const [reverseCharge, setReverseCharge] = React.useState(false);
  const [transporter, setTransporter] = React.useState("");
  const [vehicleNo, setVehicleNo] = React.useState("");
  const [deliveryNotes, setDeliveryNotes] = React.useState("");
  const [internalNotes, setInternalNotes] = React.useState("");

  React.useEffect(() => { setPlaceOfSupply(custState); }, [custState]);

  // ---------- PAYMENTS (mixed) ----------
  const [payments, setPayments] = React.useState<PaymentAllocation[]>([
    { mode: "Cash", amount: 0 },
  ]);
  const setPay = (i: number, patch: Partial<PaymentAllocation>) =>
    setPayments((xs) => xs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addPay = () => setPayments((xs) => [...xs, { mode: "Cash", amount: 0 }]);
  const removePay = (i: number) =>
    setPayments((xs) => (xs.length === 1 ? xs : xs.filter((_, idx) => idx !== i)));

  const totalAllocated = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const remaining = calc.grand - totalAllocated;

  // ---------- SAVE ----------
  const buildInvoicePayload = (status: "Draft" | "Hold" | "Pending" | "Paid" | "Partial") => {
    const num = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`;
    const firstProductId = items.find((i) => i.productId)?.productId ?? products[0]?.id ?? "";
    return {
      id: `i_${Date.now()}`,
      number: num,
      customerId,
      date: invoiceDate,
      productId: firstProductId,
      qty: calc.totalQty,
      subtotal: calc.taxable,
      gstAmount: calc.gst,
      total: calc.grand,
      paid: Math.min(totalAllocated, calc.grand),
      status,
      branchId: branch?.id,
      billType,
      time: invoiceTime,
      invoiceType,
      employeeId, salesPersonId, counter, refNo,
      items,
      customerName: customer?.name,
      customerMobile, customerEmail, customerGSTIN, customerPAN,
      billingAddress, shippingAddress,
      placeOfSupply, stateCode, reverseCharge,
      transporter, vehicleNo, deliveryNotes, internalNotes,
      freight, installation, delivery, otherCharges,
      billDiscount, roundOff: calc.roundOff,
      cgst: calc.cgst, sgst: calc.sgst, igst: calc.igst,
      payments,
    };
  };

  const save = (mode: "save" | "print" | "new" | "draft" | "hold" = "save") => {
    if (!branch || !company) { alert("Select a branch first"); return; }
    if (!customerId) { alert("Select a customer"); return; }
    if (items.some((it) => !it.name || it.qty <= 0)) { alert("Complete every item row"); return; }
    if (mode === "save" || mode === "print" || mode === "new") {
      if (Math.abs(remaining) > 1) {
        const ok = window.confirm(
          `Payment allocation (${inr(totalAllocated)}) does not match Grand Total (${inr(calc.grand)}). Save anyway?`
        );
        if (!ok) return;
      }
    }
    const status =
      mode === "draft" ? "Draft" :
      mode === "hold" ? "Hold" :
      totalAllocated >= calc.grand ? "Paid" :
      totalAllocated > 0 ? "Partial" : "Pending";
    const payload = buildInvoicePayload(status as any);
    add("invoices", payload as any);
    logAudit({
      user: "Current User", entity: "Invoice", entityId: payload.number,
      action: mode === "draft" ? "Draft Saved" : mode === "hold" ? "Held" : "Created",
      newValue: `${customer?.name} · ${inr(calc.grand)}`,
    });
    if (mode === "print") window.print();
    if (mode === "new") {
      setItems([emptyItem()]);
      setPayments([{ mode: "Cash", amount: 0 }]);
      setRefNo("");
      return;
    }
    nav({ to: "/sales/invoices" });
  };

  const cancel = () => {
    if (window.confirm("Discard this invoice?")) nav({ to: "/sales/invoices" });
  };

  // ---------- RENDER ----------
  return (
    <div className="pb-32">
      <PageHeader
        title="New Invoice · Advanced Billing"
        description={`${branch?.name ?? "—"} · ${company?.name ?? ""} · ${isIntraState ? "Intra-state (CGST + SGST)" : "Inter-state (IGST)"}`}
      />

      {/* ============== SECTION 1 — HEADER ============== */}
      <Card className="p-5 mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">1 · Bill Header</h3>
          <Badge variant="secondary">{invoiceType}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-3">
            <div>
              <Label>Branch</Label>
              <Input value={branch?.name ?? ""} disabled />
            </div>
            <div>
              <Label>Invoice Type</Label>
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tax Invoice">Tax Invoice</SelectItem>
                  <SelectItem value="Bill of Supply">Bill of Supply</SelectItem>
                  <SelectItem value="Retail Invoice">Retail Invoice</SelectItem>
                  <SelectItem value="Export Invoice">Export Invoice</SelectItem>
                  <SelectItem value="Proforma">Proforma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Bill Type</Label>
                <Select value={billType} onValueChange={(v) => setBillType(v as BillType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B2B">B2B</SelectItem>
                    <SelectItem value="B2C">B2C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Invoice #</Label>
                <Input value="Auto (on save)" disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Date</Label><Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} /></div>
              <div><Label>Time</Label><Input type="time" value={invoiceTime} onChange={(e) => setInvoiceTime(e.target.value)} /></div>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="space-y-3">
            <div>
              <Label>Employee</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} · {e.empId}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sales Person</Label>
              <Select value={salesPersonId} onValueChange={setSalesPersonId}>
                <SelectTrigger><SelectValue placeholder="Select sales person" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Counter</Label><Input value={counter} onChange={(e) => setCounter(e.target.value)} /></div>
              <div><Label>Reference #</Label><Input value={refNo} onChange={(e) => setRefNo(e.target.value)} placeholder="PO / Ref" /></div>
            </div>
          </div>

          {/* RIGHT — customer */}
          <div className="space-y-3">
            <div>
              <Label>Search Customer</Label>
              <Input
                placeholder="Name, mobile or code"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>
            <div>
              <Label>Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {filteredCustomers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} · {c.mobile}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {customer && (
              <div className="rounded-md border border-border bg-muted/40 p-2 text-xs space-y-0.5">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{customer.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Credit Limit</span><span>{inr(customer.creditLimit)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Outstanding</span><span className={customer.outstanding > 0 ? "text-destructive font-medium" : ""}>{inr(customer.outstanding)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Available</span><span className="font-medium">{inr(Math.max(0, customer.creditLimit - customer.outstanding))}</span></div>
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => nav({ to: "/customers/new" })}>
                <Plus className="mr-1 h-3 w-3" /> New
              </Button>
              {customer && (
                <Button size="sm" variant="outline" onClick={() => nav({ to: "/customers/$id/edit", params: { id: customer.id } })}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* customer details grid */}
        <Separator className="my-4" />
        <div className="grid gap-3 md:grid-cols-4">
          <div><Label>Mobile</Label><Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} /></div>
          <div><Label>Email</Label><Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} /></div>
          <div><Label>GSTIN</Label><Input value={customerGSTIN} onChange={(e) => setCustomerGSTIN(e.target.value)} /></div>
          <div><Label>PAN</Label><Input value={customerPAN} onChange={(e) => setCustomerPAN(e.target.value)} /></div>
          <div className="md:col-span-2">
            <Label>Billing Address</Label>
            <Textarea rows={2} value={billingAddress} onChange={(e) => {
              setBillingAddress(e.target.value);
              if (sameAsBilling) setShippingAddress(e.target.value);
            }} />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Shipping Address</Label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input type="checkbox" checked={sameAsBilling} onChange={(e) => {
                  setSameAsBilling(e.target.checked);
                  if (e.target.checked) setShippingAddress(billingAddress);
                }} />
                Same as billing
              </label>
            </div>
            <Textarea rows={2} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} disabled={sameAsBilling} />
          </div>
        </div>
      </Card>

      {/* ============== SECTION 2 — ITEMS ============== */}
      <Card className="p-5 mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">2 · Item Details</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={addRow}><Plus className="mr-1 h-3 w-3" /> Add Item</Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="min-w-[220px]">Item</TableHead>
                <TableHead className="min-w-[140px]">Serial / Engine</TableHead>
                <TableHead>HSN</TableHead>
                <TableHead className="w-20 text-right">Qty</TableHead>
                <TableHead className="w-20">Unit</TableHead>
                <TableHead className="w-28 text-right">Rate</TableHead>
                <TableHead className="w-28 text-right">Gross</TableHead>
                <TableHead className="w-20 text-right">Disc%</TableHead>
                <TableHead className="w-28 text-right">Taxable</TableHead>
                <TableHead className="w-20 text-right">Tax%</TableHead>
                <TableHead className="w-28 text-right">Tax</TableHead>
                <TableHead className="w-28 text-right">Net</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calc.rows.map(({ it, gross, discountAmt, taxable, taxAmt, net }, idx) => (
                <TableRow key={it.id}>
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell>
                    <Select value={it.productId ?? ""} onValueChange={(v) => pickProduct(it.id, v)}>
                      <SelectTrigger className="h-8"><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.model} · {p.sku}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input
                      className="mt-1 h-7 text-xs"
                      placeholder="Description"
                      value={it.description ?? ""}
                      onChange={(e) => setItem(it.id, { description: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input className="h-8" placeholder="Serial No" value={it.serialNo ?? ""} onChange={(e) => setItem(it.id, { serialNo: e.target.value })} />
                    <Input className="mt-1 h-7 text-xs" placeholder="Engine No" value={it.engineNo ?? ""} onChange={(e) => setItem(it.id, { engineNo: e.target.value })} />
                  </TableCell>
                  <TableCell><Input className="h-8 w-20" value={it.hsn} onChange={(e) => setItem(it.id, { hsn: e.target.value })} /></TableCell>
                  <TableCell><Input type="number" className="h-8 text-right" value={it.qty} onChange={(e) => setItem(it.id, { qty: +e.target.value || 0 })} /></TableCell>
                  <TableCell><Input className="h-8" value={it.unit} onChange={(e) => setItem(it.id, { unit: e.target.value })} /></TableCell>
                  <TableCell><Input type="number" className="h-8 text-right" value={it.rate} onChange={(e) => setItem(it.id, { rate: +e.target.value || 0 })} /></TableCell>
                  <TableCell className="text-right tabular-nums">{inr(gross)}</TableCell>
                  <TableCell><Input type="number" className="h-8 text-right" value={it.discountPct} onChange={(e) => setItem(it.id, { discountPct: +e.target.value || 0 })} /></TableCell>
                  <TableCell className="text-right tabular-nums">{inr(taxable)}</TableCell>
                  <TableCell><Input type="number" className="h-8 text-right" value={it.taxPct} onChange={(e) => setItem(it.id, { taxPct: +e.target.value || 0 })} /></TableCell>
                  <TableCell className="text-right tabular-nums text-xs">
                    {inr(taxAmt)}
                    {isIntraState && <div className="text-muted-foreground">C+S {(it.taxPct / 2).toFixed(1)}%</div>}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{inr(net)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => dupRow(it.id)} title="Duplicate">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeRow(it.id)} title="Remove">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Charges row */}
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <div><Label>Bill Discount</Label><Input type="number" value={billDiscount} onChange={(e) => setBillDiscount(+e.target.value || 0)} /></div>
          <div><Label>Freight</Label><Input type="number" value={freight} onChange={(e) => setFreight(+e.target.value || 0)} /></div>
          <div><Label>Installation</Label><Input type="number" value={installation} onChange={(e) => setInstallation(+e.target.value || 0)} /></div>
          <div><Label>Delivery</Label><Input type="number" value={delivery} onChange={(e) => setDelivery(+e.target.value || 0)} /></div>
          <div><Label>Other Charges</Label><Input type="number" value={otherCharges} onChange={(e) => setOtherCharges(+e.target.value || 0)} /></div>
        </div>
      </Card>

      {/* ============== SECTION 3 — TRANSACTION + PAYMENT ============== */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Transaction details */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-foreground">3a · Transaction Details</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div><Label>Company GSTIN</Label><Input value={company?.gstin ?? ""} disabled /></div>
            <div><Label>Company PAN</Label><Input value={company?.pan ?? ""} disabled /></div>
            <div><Label>Branch State</Label><Input value={branchState} disabled /></div>
            <div><Label>Place of Supply</Label><Input value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} /></div>
            <div><Label>State Code</Label><Input value={stateCode} onChange={(e) => setStateCode(e.target.value)} placeholder="e.g. 33" /></div>
            <div>
              <Label>Reverse Charge</Label>
              <Select value={reverseCharge ? "Yes" : "No"} onValueChange={(v) => setReverseCharge(v === "Yes")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Transporter</Label><Input value={transporter} onChange={(e) => setTransporter(e.target.value)} /></div>
            <div><Label>Vehicle No</Label><Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} /></div>
            <div><Label>E-Way Bill</Label><Input placeholder="Auto (on generation)" disabled /></div>
            <div className="md:col-span-3">
              <Label>Delivery Notes</Label>
              <Textarea rows={2} value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Internal Notes</Label>
              <Textarea rows={2} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
            </div>
          </div>

          {/* Payments */}
          <Separator className="my-5" />
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">3b · Payment Details</h3>
            <Button size="sm" variant="outline" onClick={addPay}><Plus className="mr-1 h-3 w-3" /> Add Payment</Button>
          </div>

          <div className="space-y-3">
            {payments.map((p, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="grid gap-3 md:grid-cols-6">
                  <div>
                    <Label>Mode</Label>
                    <Select value={p.mode} onValueChange={(v) => setPay(i, { mode: v as PaymentMode })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PAY_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" value={p.amount} onChange={(e) => setPay(i, { amount: +e.target.value || 0 })} />
                  </div>
                  {/* per-mode fields */}
                  {p.mode === "Card" && (
                    <>
                      <div><Label>Card Type</Label><Input value={p.cardType ?? ""} onChange={(e) => setPay(i, { cardType: e.target.value })} placeholder="Visa/MC/Rupay" /></div>
                      <div><Label>Last 4</Label><Input maxLength={4} value={p.cardLast4 ?? ""} onChange={(e) => setPay(i, { cardLast4: e.target.value })} /></div>
                      <div><Label>Txn ID</Label><Input value={p.cardTxnId ?? ""} onChange={(e) => setPay(i, { cardTxnId: e.target.value })} /></div>
                      <div><Label>Bank</Label><Input value={p.cardBank ?? ""} onChange={(e) => setPay(i, { cardBank: e.target.value })} /></div>
                    </>
                  )}
                  {p.mode === "Cheque" && (
                    <>
                      <div><Label>Cheque #</Label><Input value={p.chequeNo ?? ""} onChange={(e) => setPay(i, { chequeNo: e.target.value })} /></div>
                      <div><Label>Cheque Date</Label><Input type="date" value={p.chequeDate ?? ""} onChange={(e) => setPay(i, { chequeDate: e.target.value })} /></div>
                      <div><Label>Bank</Label><Input value={p.chequeBank ?? ""} onChange={(e) => setPay(i, { chequeBank: e.target.value })} /></div>
                      <div><Label>Branch</Label><Input value={p.chequeBranch ?? ""} onChange={(e) => setPay(i, { chequeBranch: e.target.value })} /></div>
                    </>
                  )}
                  {p.mode === "UPI" && (
                    <>
                      <div><Label>UPI Txn ID</Label><Input value={p.upiTxnId ?? ""} onChange={(e) => setPay(i, { upiTxnId: e.target.value })} /></div>
                      <div><Label>Reference</Label><Input value={p.upiRef ?? ""} onChange={(e) => setPay(i, { upiRef: e.target.value })} /></div>
                      <div><Label>Provider</Label><Input value={p.upiProvider ?? ""} onChange={(e) => setPay(i, { upiProvider: e.target.value })} placeholder="GPay / PhonePe" /></div>
                    </>
                  )}
                  {p.mode === "Bank" && (
                    <>
                      <div><Label>Bank</Label><Input value={p.bankName ?? ""} onChange={(e) => setPay(i, { bankName: e.target.value })} /></div>
                      <div><Label>Account Ref</Label><Input value={p.bankAcctRef ?? ""} onChange={(e) => setPay(i, { bankAcctRef: e.target.value })} /></div>
                      <div><Label>UTR</Label><Input value={p.utrNo ?? ""} onChange={(e) => setPay(i, { utrNo: e.target.value })} /></div>
                      <div><Label>Txn Date</Label><Input type="date" value={p.txnDate ?? ""} onChange={(e) => setPay(i, { txnDate: e.target.value })} /></div>
                    </>
                  )}
                  {p.mode === "Credit" && (
                    <>
                      <div><Label>Due Date</Label><Input type="date" value={p.creditDueDate ?? ""} onChange={(e) => setPay(i, { creditDueDate: e.target.value })} /></div>
                      <div><Label>Credit Days</Label><Input type="number" value={p.creditDays ?? 0} onChange={(e) => setPay(i, { creditDays: +e.target.value || 0 })} /></div>
                      {customer && (
                        <div className="md:col-span-2 flex items-end text-xs text-muted-foreground">
                          Limit: <span className="ml-1 font-medium text-foreground">{inr(customer.creditLimit)}</span>
                          <span className="mx-2">·</span>
                          Outstanding: <span className="ml-1 font-medium text-foreground">{inr(customer.outstanding)}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex items-end justify-end">
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removePay(i)} disabled={payments.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
            <div><div className="text-xs text-muted-foreground">Total Bill</div><div className="font-semibold">{inr(calc.grand)}</div></div>
            <div><div className="text-xs text-muted-foreground">Allocated</div><div className="font-semibold">{inr(totalAllocated)}</div></div>
            <div>
              <div className="text-xs text-muted-foreground">Remaining</div>
              <div className={`font-semibold ${Math.abs(remaining) < 1 ? "text-emerald-600" : remaining > 0 ? "text-amber-600" : "text-destructive"}`}>
                {inr(remaining)}
              </div>
            </div>
          </div>
        </Card>

        {/* Sticky totals */}
        <Card className="p-5 lg:sticky lg:top-4 self-start">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Bill Total</h3>
          <div className="space-y-1.5 text-sm">
            <Row label="Total Items" value={String(calc.totalItems)} />
            <Row label="Total Quantity" value={String(calc.totalQty)} />
            <Separator className="my-2" />
            <Row label="Gross Amount" value={inr(calc.gross)} />
            <Row label="Item Discount" value={`- ${inr(calc.itemDiscount)}`} />
            <Row label="Bill Discount" value={`- ${inr(billDiscount)}`} />
            <Row label="Taxable Amount" value={inr(calc.taxable)} />
            {isIntraState ? (
              <>
                <Row label="CGST" value={inr(calc.cgst)} muted />
                <Row label="SGST" value={inr(calc.sgst)} muted />
              </>
            ) : (
              <Row label="IGST" value={inr(calc.igst)} muted />
            )}
            {calc.cess > 0 && <Row label="Cess" value={inr(calc.cess)} muted />}
            {calc.charges > 0 && <Row label="Charges" value={inr(calc.charges)} muted />}
            <Row label="Round Off" value={inr(calc.roundOff)} muted />
            <Separator className="my-2" />
            <div className="flex items-baseline justify-between rounded-md bg-primary/10 px-3 py-2">
              <span className="text-sm font-semibold text-foreground">Grand Total</span>
              <span className="text-xl font-bold text-primary tabular-nums">{inr(calc.grand)}</span>
            </div>
            <Row label="Paid" value={inr(totalAllocated)} muted />
            <Row label="Balance" value={inr(Math.max(0, calc.grand - totalAllocated))} muted />
          </div>
        </Card>
      </div>

      {/* ============== ACTION BAR ============== */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur px-4 py-3 print:hidden">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-end gap-2">
          <Button variant="ghost" onClick={cancel}><X className="mr-1 h-4 w-4" /> Cancel</Button>
          <Button variant="outline" onClick={() => save("draft")}><FileText className="mr-1 h-4 w-4" /> Save Draft</Button>
          <Button variant="outline" onClick={() => save("hold")}><PauseCircle className="mr-1 h-4 w-4" /> Hold</Button>
          <Button variant="outline" onClick={() => { /* no-op; totals live */ }}><Calculator className="mr-1 h-4 w-4" /> Calculate</Button>
          <Button variant="outline" onClick={() => window.print()}><Eye className="mr-1 h-4 w-4" /> Preview</Button>
          <Button variant="outline" onClick={() => alert("Email queued (placeholder)")}><Mail className="mr-1 h-4 w-4" /> Email</Button>
          <Button variant="outline" onClick={() => alert("WhatsApp queued (placeholder)")}><MessageSquare className="mr-1 h-4 w-4" /> WhatsApp</Button>
          <Button variant="outline" onClick={() => save("new")}>Save &amp; New</Button>
          <Button variant="outline" onClick={() => save("print")}><Printer className="mr-1 h-4 w-4" /> Save &amp; Print</Button>
          <Button onClick={() => save("save")}><Save className="mr-1 h-4 w-4" /> Save Invoice</Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

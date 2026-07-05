export type Role =
  | "Super Admin"
  | "Admin"
  | "Accounts Manager"
  | "Sales Manager"
  | "Sales Executive"
  | "Service Manager"
  | "Service Engineer"
  | "Inventory Manager"
  | "Branch Manager"
  | "Dealer"
  | "Customer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  empId?: string;
  branchAccess?: string; // "ALL" or a specific branch id
  branchId?: string;     // resolved working branch after selection
};


export type Company = {
  id: string; code: string; name: string; legalName: string;
  gstin: string; pan: string; cin?: string;
  address1: string; address2?: string; city: string; district: string;
  state: string; country: string; pincode: string;
  mobile: string; altMobile?: string; email: string; website?: string;
  logoUrl?: string; signatureUrl?: string; sealUrl?: string;
  active: boolean;
};

export type BranchType = "Head Office" | "Branch Office" | "Warehouse" | "Service Center" | "Dealer Office";

export type Branch = {
  id: string; code: string; name: string; companyId: string;
  gstin: string; address: string; state: string; district: string; pincode: string;
  mobile: string; email: string; managerEmpId?: string;
  type: BranchType; active: boolean;
};

export type LineItem = {
  productId: string; description?: string;
  qty: number; rate: number; discount: number; taxPct: number;
};

export type BillType = "B2B" | "B2C";

export type Estimate = {
  id: string; number: string; branchId: string; companyId: string;
  customerId: string; customerName: string; mobile: string; address: string; gstin?: string;
  billType: BillType; date: string; items: LineItem[];
  subtotal: number; taxAmount: number; total: number;
  status: "Draft" | "Sent" | "Converted" | "Cancelled";
};

export type CreditNote = {
  id: string; number: string; branchId: string; invoiceNumber: string;
  customerId: string; date: string; reason: string; amount: number;
};

export type DebitNote = {
  id: string; number: string; branchId: string; invoiceNumber: string;
  customerId: string; date: string; reason: string; amount: number;
};

export type AuditLog = {
  id: string; user: string; datetime: string;
  entity: string; entityId: string; action: string;
  oldValue?: string; newValue?: string;
};

export type Customer = {
  id: string; code: string; name: string;
  type: "Retail" | "Corporate" | "Government" | "Dealer" | "Distributor";
  gstin?: string; pan?: string; mobile: string; email: string;
  city: string; state: string; pincode: string;
  creditLimit: number; outstanding: number;
  branchId?: string;
};

export type Product = {
  id: string; sku: string; model: string; capacityKVA: number;
  fuel: "Diesel" | "Petrol" | "Gas";
  hsn: string; gst: number;
  purchasePrice: number; sellingPrice: number; dealerPrice: number;
  warrantyMonths: number; stock: number;
  branchId?: string;
};

export type Vendor = {
  id: string; code: string; name: string; gstin: string;
  contact: string; mobile: string; terms: string;
  branchId?: string;
};

export type Employee = {
  id: string; empId: string; name: string;
  designation: string; department: string; branch: string;
  mobile: string; email: string; joiningDate: string;
  branchId?: string;
  firstName?: string; lastName?: string;
  gender?: "Male" | "Female" | "Other";
  dob?: string;
  altMobile?: string;
  address1?: string; address2?: string; city?: string; district?: string; state?: string; pincode?: string;
  employeeType?: "Permanent" | "Contract" | "Intern" | "Consultant";
  reportingManager?: string;
  userId?: string;
  passwordHash?: string;
  loginStart?: string; // "09:00"
  loginEnd?: string;   // "18:00"
  role?: Role;
  status?: "Active" | "Inactive" | "Locked";
  branchAccess?: string; // "ALL" or a branch id
  currentSalary?: number;
};

export type PromotionStatus =
  | "Draft" | "Pending L1" | "Pending L2" | "Pending L3" | "Pending L4"
  | "Approved" | "Rejected" | "Cancelled" | "Applied";

export type PromotionApproval = {
  level: 1 | 2 | 3 | 4;
  role: "Reporting Manager" | "Department Head" | "HR Manager" | "Managing Director";
  approver?: string;
  decision?: "Approved" | "Rejected";
  at?: string;
  remarks?: string;
};

export type Promotion = {
  id: string;
  number: string;
  employeeId: string;
  empName: string;
  currentBranchId: string; currentBranch: string;
  currentDepartment: string; currentDesignation: string; currentSalary: number;
  promotedBranchId: string; promotedBranch: string;
  promotedDepartment: string; promotedDesignation: string; revisedSalary: number;
  effectiveDate: string;
  type: "Regular" | "Merit" | "Performance" | "Special" | "Transfer" | "Temporary";
  reason: string;
  remarks?: string;
  status: PromotionStatus;
  approvals: PromotionApproval[];
  createdAt: string;
  createdBy: string;
  appliedAt?: string;
};


export type Department = {
  id: string; code: string; name: string; description?: string;
};

export type Designation = {
  id: string; code: string; name: string; departmentId?: string; description?: string;
};

export type LoginHistory = {
  id: string; user: string; role: string; branchId?: string;
  loginAt: string; logoutAt?: string; ip: string; userAgent?: string;
};

export type TicketCategory = "Hardware" | "Software" | "Service" | "Billing" | "AMC" | "Spares" | "Other";
export type TicketNote = { id: string; at: string; author: string; kind: "Internal" | "Customer"; body: string };

export type ServiceTicketExt = {
  category?: TicketCategory; subCategory?: string;
  department?: string; assignedTo?: string;
  resolution?: string; notes?: TicketNote[];
  attachments?: { name: string; url?: string }[];
  escalated?: boolean;
  sla?: string; // e.g. "24h"
  updatedAt?: string;
};

export type Quotation = {
  id: string; number: string; customerId: string;
  date: string; productId: string; qty: number;
  discount: number; freight: number; installation: number;
  status: "Draft" | "Sent" | "Approved" | "Rejected" | "Converted";
  total: number;
  branchId?: string;
};

export type SalesOrder = {
  id: string; number: string; quotationId?: string;
  customerId: string; date: string; productId: string;
  qty: number; total: number;
  status: "Open" | "Dispatched" | "Delivered" | "Invoiced";
  branchId?: string;
};

export type PaymentMode = "Cash" | "Card" | "Cheque" | "UPI" | "Bank" | "Credit" | "Advance";

export type PaymentAllocation = {
  mode: PaymentMode;
  amount: number;
  // per-mode metadata (all optional)
  cardType?: string; cardLast4?: string; cardTxnId?: string; cardApproval?: string; cardBank?: string;
  chequeNo?: string; chequeDate?: string; chequeBank?: string; chequeBranch?: string;
  upiTxnId?: string; upiRef?: string; upiProvider?: string;
  bankName?: string; bankAcctRef?: string; utrNo?: string; txnDate?: string;
  creditDueDate?: string; creditDays?: number;
};

export type InvoiceItem = {
  id: string;
  productId?: string;
  itemCode: string;
  name: string;
  description?: string;
  serialNo?: string; engineNo?: string; alternatorNo?: string; modelNo?: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  discountPct: number;
  taxPct: number;
  cess?: number;
};

export type Invoice = {
  id: string; number: string; orderId?: string;
  customerId: string; date: string; productId: string;
  qty: number; subtotal: number; gstAmount: number; total: number; paid: number;
  status: "Paid" | "Partial" | "Pending" | "Overdue" | "Cancelled" | "Draft" | "Hold";
  irn?: string; ewayBill?: string;
  branchId?: string;
  billType?: BillType;
  // --- Advanced billing (all optional, non-breaking) ---
  time?: string;
  invoiceType?: string;
  employeeId?: string;
  salesPersonId?: string;
  counter?: string;
  refNo?: string;
  items?: InvoiceItem[];
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
  customerGSTIN?: string;
  customerPAN?: string;
  billingAddress?: string;
  shippingAddress?: string;
  placeOfSupply?: string;
  stateCode?: string;
  reverseCharge?: boolean;
  transporter?: string;
  vehicleNo?: string;
  deliveryNotes?: string;
  internalNotes?: string;
  freight?: number;
  installation?: number;
  delivery?: number;
  otherCharges?: number;
  billDiscount?: number;
  roundOff?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  payments?: PaymentAllocation[];
};

export type Warranty = {
  id: string; serial: string; engineNo: string;
  customerId: string; productId: string; invoiceNumber: string;
  installationDate: string; startDate: string; endDate: string;
  status: "Active" | "Expired" | "Claimed";
  branchId?: string;
};

export type ServiceTicket = {
  id: string; number: string; customerId: string; productId: string;
  problem: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "New" | "Open" | "Assigned" | "In Progress" | "Pending Parts" | "Waiting for Customer" | "Waiting for Developer" | "Resolved" | "Closed" | "Reopened";
  technician?: string; createdAt: string;
  branchId?: string;
} & ServiceTicketExt;

export type StockMovement = {
  id: string; date: string; productId: string;
  type: "Inward" | "Outward" | "Transfer" | "Adjustment";
  qty: number; warehouse: string; note?: string;
  branchId?: string;
};

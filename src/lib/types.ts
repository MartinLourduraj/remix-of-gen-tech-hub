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

export type Invoice = {
  id: string; number: string; orderId?: string;
  customerId: string; date: string; productId: string;
  qty: number; subtotal: number; gstAmount: number; total: number; paid: number;
  status: "Paid" | "Partial" | "Pending" | "Overdue" | "Cancelled";
  irn?: string; ewayBill?: string;
  branchId?: string;
  billType?: BillType;
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
  status: "Open" | "Assigned" | "In Progress" | "Pending Parts" | "Closed";
  technician?: string; createdAt: string;
  branchId?: string;
} & ServiceTicketExt;

export type StockMovement = {
  id: string; date: string; productId: string;
  type: "Inward" | "Outward" | "Transfer" | "Adjustment";
  qty: number; warehouse: string; note?: string;
  branchId?: string;
};

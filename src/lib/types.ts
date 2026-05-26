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

export type Customer = {
  id: string;
  code: string;
  name: string;
  type: "Retail" | "Corporate" | "Government" | "Dealer" | "Distributor";
  gstin?: string;
  pan?: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  creditLimit: number;
  outstanding: number;
};

export type Product = {
  id: string;
  sku: string;
  model: string;
  capacityKVA: number;
  fuel: "Diesel" | "Petrol" | "Gas";
  hsn: string;
  gst: number;
  purchasePrice: number;
  sellingPrice: number;
  dealerPrice: number;
  warrantyMonths: number;
  stock: number;
};

export type Vendor = {
  id: string;
  code: string;
  name: string;
  gstin: string;
  contact: string;
  mobile: string;
  terms: string;
};

export type Employee = {
  id: string;
  empId: string;
  name: string;
  designation: string;
  department: string;
  branch: string;
  mobile: string;
  email: string;
  joiningDate: string;
};

export type Quotation = {
  id: string;
  number: string;
  customerId: string;
  date: string;
  productId: string;
  qty: number;
  discount: number;
  freight: number;
  installation: number;
  status: "Draft" | "Sent" | "Approved" | "Rejected" | "Converted";
  total: number;
};

export type SalesOrder = {
  id: string;
  number: string;
  quotationId?: string;
  customerId: string;
  date: string;
  productId: string;
  qty: number;
  total: number;
  status: "Open" | "Dispatched" | "Delivered" | "Invoiced";
};

export type Invoice = {
  id: string;
  number: string;
  orderId?: string;
  customerId: string;
  date: string;
  productId: string;
  qty: number;
  subtotal: number;
  gstAmount: number;
  total: number;
  paid: number;
  status: "Paid" | "Partial" | "Pending" | "Overdue";
  irn?: string;
  ewayBill?: string;
};

export type Warranty = {
  id: string;
  serial: string;
  engineNo: string;
  customerId: string;
  productId: string;
  invoiceNumber: string;
  installationDate: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Claimed";
};

export type ServiceTicket = {
  id: string;
  number: string;
  customerId: string;
  productId: string;
  problem: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Assigned" | "In Progress" | "Pending Parts" | "Closed";
  technician?: string;
  createdAt: string;
};

export type StockMovement = {
  id: string;
  date: string;
  productId: string;
  type: "Inward" | "Outward" | "Transfer" | "Adjustment";
  qty: number;
  warehouse: string;
  note?: string;
};
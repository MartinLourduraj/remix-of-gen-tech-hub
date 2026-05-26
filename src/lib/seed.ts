import type {
  Customer, Product, Vendor, Employee, Quotation, SalesOrder,
  Invoice, Warranty, ServiceTicket, StockMovement
} from "./types";

export const seedCustomers: Customer[] = [
  { id: "c1", code: "CUST-0001", name: "Bharat Constructions Pvt Ltd", type: "Corporate", gstin: "27ABCDE1234F1Z5", pan: "ABCDE1234F", mobile: "9820012345", email: "ops@bharatcon.in", city: "Mumbai", state: "Maharashtra", pincode: "400001", creditLimit: 2500000, outstanding: 480000 },
  { id: "c2", code: "CUST-0002", name: "Sundaram Hospital", type: "Corporate", gstin: "33SUNDR4567K1Z2", mobile: "9840098400", email: "facility@sundaram.org", city: "Chennai", state: "Tamil Nadu", pincode: "600028", creditLimit: 1500000, outstanding: 0 },
  { id: "c3", code: "CUST-0003", name: "Rakesh Sharma", type: "Retail", mobile: "9811112233", email: "rakesh.s@gmail.com", city: "Delhi", state: "Delhi", pincode: "110001", creditLimit: 0, outstanding: 0 },
  { id: "c4", code: "CUST-0004", name: "Karnataka PWD", type: "Government", gstin: "29KPWDX9999X1Z0", mobile: "8025001000", email: "tenders@karpwd.gov.in", city: "Bengaluru", state: "Karnataka", pincode: "560001", creditLimit: 5000000, outstanding: 1200000 },
  { id: "c5", code: "CUST-0005", name: "PowerLine Dealers", type: "Dealer", gstin: "06PWRLN5678R1Z9", mobile: "9876500000", email: "sales@powerline.in", city: "Gurgaon", state: "Haryana", pincode: "122001", creditLimit: 3000000, outstanding: 750000 },
];

export const seedProducts: Product[] = [
  { id: "p1", sku: "GT-DG-15", model: "GT-Silent 15", capacityKVA: 15, fuel: "Diesel", hsn: "85021100", gst: 18, purchasePrice: 180000, sellingPrice: 235000, dealerPrice: 215000, warrantyMonths: 24, stock: 12 },
  { id: "p2", sku: "GT-DG-25", model: "GT-Silent 25", capacityKVA: 25, fuel: "Diesel", hsn: "85021100", gst: 18, purchasePrice: 280000, sellingPrice: 355000, dealerPrice: 325000, warrantyMonths: 24, stock: 8 },
  { id: "p3", sku: "GT-DG-62", model: "GT-Industrial 62", capacityKVA: 62.5, fuel: "Diesel", hsn: "85021100", gst: 18, purchasePrice: 525000, sellingPrice: 685000, dealerPrice: 620000, warrantyMonths: 24, stock: 4 },
  { id: "p4", sku: "GT-DG-125", model: "GT-Industrial 125", capacityKVA: 125, fuel: "Diesel", hsn: "85021100", gst: 18, purchasePrice: 980000, sellingPrice: 1280000, dealerPrice: 1175000, warrantyMonths: 24, stock: 2 },
  { id: "p5", sku: "GT-PG-5", model: "GT-Portable 5", capacityKVA: 5, fuel: "Petrol", hsn: "85021200", gst: 18, purchasePrice: 38000, sellingPrice: 52000, dealerPrice: 46000, warrantyMonths: 12, stock: 30 },
  { id: "p6", sku: "GT-GG-20", model: "GT-Gas 20", capacityKVA: 20, fuel: "Gas", hsn: "85021300", gst: 18, purchasePrice: 240000, sellingPrice: 310000, dealerPrice: 285000, warrantyMonths: 24, stock: 6 },
];

export const seedVendors: Vendor[] = [
  { id: "v1", code: "VEN-001", name: "Kirloskar Oil Engines", gstin: "27KOEL1234F1Z5", contact: "Suresh Patil", mobile: "9822011111", terms: "Net 30" },
  { id: "v2", code: "VEN-002", name: "Cummins India Spares", gstin: "27CUMINS999K1Z0", contact: "Ananya Iyer", mobile: "9833022222", terms: "Net 45" },
  { id: "v3", code: "VEN-003", name: "Mahindra Powerol", gstin: "27MAHIND765K1Z2", contact: "Vikram Joshi", mobile: "9844033333", terms: "Net 30" },
];

export const seedEmployees: Employee[] = [
  { id: "e1", empId: "EMP-001", name: "Arjun Reddy", designation: "Sales Manager", department: "Sales", branch: "Hyderabad", mobile: "9000011111", email: "arjun@gentech.in", joiningDate: "2021-03-10" },
  { id: "e2", empId: "EMP-002", name: "Priya Nair", designation: "Accounts Manager", department: "Finance", branch: "Bengaluru", mobile: "9000022222", email: "priya@gentech.in", joiningDate: "2020-07-22" },
  { id: "e3", empId: "EMP-003", name: "Mohammed Faizal", designation: "Service Engineer", department: "Service", branch: "Chennai", mobile: "9000033333", email: "faizal@gentech.in", joiningDate: "2022-01-15" },
  { id: "e4", empId: "EMP-004", name: "Sneha Kulkarni", designation: "Inventory Manager", department: "Warehouse", branch: "Pune", mobile: "9000044444", email: "sneha@gentech.in", joiningDate: "2019-11-05" },
];

export const seedQuotations: Quotation[] = [
  { id: "q1", number: "QTN-2026-0001", customerId: "c1", date: "2026-05-12", productId: "p3", qty: 2, discount: 25000, freight: 8000, installation: 15000, status: "Approved", total: 1615200 },
  { id: "q2", number: "QTN-2026-0002", customerId: "c2", date: "2026-05-14", productId: "p2", qty: 1, discount: 10000, freight: 3500, installation: 8000, status: "Sent", total: 415830 },
  { id: "q3", number: "QTN-2026-0003", customerId: "c4", date: "2026-05-16", productId: "p4", qty: 1, discount: 50000, freight: 12000, installation: 25000, status: "Approved", total: 1494060 },
  { id: "q4", number: "QTN-2026-0004", customerId: "c5", date: "2026-05-20", productId: "p1", qty: 5, discount: 35000, freight: 10000, installation: 0, status: "Converted", total: 1303300 },
];

export const seedSalesOrders: SalesOrder[] = [
  { id: "so1", number: "SO-2026-0001", quotationId: "q4", customerId: "c5", date: "2026-05-21", productId: "p1", qty: 5, total: 1303300, status: "Delivered" },
  { id: "so2", number: "SO-2026-0002", quotationId: "q1", customerId: "c1", date: "2026-05-22", productId: "p3", qty: 2, total: 1615200, status: "Dispatched" },
  { id: "so3", number: "SO-2026-0003", customerId: "c2", date: "2026-05-23", productId: "p5", qty: 3, total: 184080, status: "Invoiced" },
];

export const seedInvoices: Invoice[] = [
  { id: "i1", number: "INV-2026-0001", orderId: "so1", customerId: "c5", date: "2026-05-21", productId: "p1", qty: 5, subtotal: 1104492, gstAmount: 198809, total: 1303301, paid: 1303301, status: "Paid", irn: "IRN0001A2B3C4D5", ewayBill: "EWB-29011" },
  { id: "i2", number: "INV-2026-0002", orderId: "so3", customerId: "c2", date: "2026-05-23", productId: "p5", qty: 3, subtotal: 156000, gstAmount: 28080, total: 184080, paid: 100000, status: "Partial", irn: "IRN0002B3C4D5E6" },
  { id: "i3", number: "INV-2026-0003", customerId: "c1", date: "2026-04-30", productId: "p2", qty: 1, subtotal: 345000, gstAmount: 62100, total: 407100, paid: 0, status: "Overdue", irn: "IRN0003C4D5E6F7" },
  { id: "i4", number: "INV-2026-0004", customerId: "c4", date: "2026-05-10", productId: "p4", qty: 1, subtotal: 1180000, gstAmount: 212400, total: 1392400, paid: 0, status: "Pending", irn: "IRN0004D5E6F7G8" },
];

export const seedWarranties: Warranty[] = [
  { id: "w1", serial: "SN-GT15-00231", engineNo: "ENG-441129", customerId: "c5", productId: "p1", invoiceNumber: "INV-2026-0001", installationDate: "2026-05-25", startDate: "2026-05-25", endDate: "2028-05-24", status: "Active" },
  { id: "w2", serial: "SN-GT05-01102", engineNo: "ENG-PG88891", customerId: "c2", productId: "p5", invoiceNumber: "INV-2026-0002", installationDate: "2026-05-24", startDate: "2026-05-24", endDate: "2027-05-23", status: "Active" },
  { id: "w3", serial: "SN-GT62-00088", engineNo: "ENG-IND77231", customerId: "c1", productId: "p3", invoiceNumber: "INV-2024-0117", installationDate: "2024-02-11", startDate: "2024-02-11", endDate: "2026-02-10", status: "Expired" },
];

export const seedServiceTickets: ServiceTicket[] = [
  { id: "t1", number: "TKT-0001", customerId: "c1", productId: "p3", problem: "Generator not starting after monsoon rains", priority: "High", status: "In Progress", technician: "Mohammed Faizal", createdAt: "2026-05-23" },
  { id: "t2", number: "TKT-0002", customerId: "c2", productId: "p5", problem: "Abnormal noise from engine", priority: "Medium", status: "Assigned", technician: "Mohammed Faizal", createdAt: "2026-05-24" },
  { id: "t3", number: "TKT-0003", customerId: "c5", productId: "p1", problem: "Battery replacement required", priority: "Low", status: "Open", createdAt: "2026-05-25" },
  { id: "t4", number: "TKT-0004", customerId: "c4", productId: "p4", problem: "AMC scheduled service", priority: "Medium", status: "Closed", technician: "Mohammed Faizal", createdAt: "2026-05-15" },
];

export const seedStock: StockMovement[] = [
  { id: "m1", date: "2026-05-01", productId: "p1", type: "Inward", qty: 20, warehouse: "Hyderabad WH" },
  { id: "m2", date: "2026-05-21", productId: "p1", type: "Outward", qty: 5, warehouse: "Hyderabad WH", note: "SO-2026-0001" },
  { id: "m3", date: "2026-05-22", productId: "p3", type: "Outward", qty: 2, warehouse: "Bengaluru WH", note: "SO-2026-0002" },
  { id: "m4", date: "2026-05-23", productId: "p5", type: "Outward", qty: 3, warehouse: "Chennai WH", note: "SO-2026-0003" },
  { id: "m5", date: "2026-05-18", productId: "p4", type: "Transfer", qty: 1, warehouse: "Bengaluru WH \u2192 Hyderabad WH" },
];

export const monthlySales = [
  { month: "Dec", sales: 18.4, revenue: 22.1 },
  { month: "Jan", sales: 22.3, revenue: 27.4 },
  { month: "Feb", sales: 19.7, revenue: 24.0 },
  { month: "Mar", sales: 28.6, revenue: 34.8 },
  { month: "Apr", sales: 31.2, revenue: 37.9 },
  { month: "May", sales: 36.5, revenue: 44.2 },
];

export const branchSales = [
  { branch: "Hyderabad", value: 124 },
  { branch: "Bengaluru", value: 98 },
  { branch: "Chennai", value: 76 },
  { branch: "Mumbai", value: 112 },
  { branch: "Delhi", value: 64 },
];

export const productMix = [
  { name: "GT-Silent 15", value: 32 },
  { name: "GT-Silent 25", value: 24 },
  { name: "GT-Industrial 62", value: 18 },
  { name: "GT-Industrial 125", value: 14 },
  { name: "GT-Portable 5", value: 8 },
  { name: "GT-Gas 20", value: 4 },
];
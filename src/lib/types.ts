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

/* ============================================================
 * Marketing Promotions Command Center
 * Frontend-only types; wire to Django REST later.
 * ============================================================ */

export type MPromoStatus =
  | "Draft" | "Pending Approval" | "Approved" | "Scheduled"
  | "Active" | "Paused" | "Expired" | "Rejected" | "Archived";

export type MPromoPriority = "Critical" | "High" | "Medium" | "Low";

export type MPromoType =
  | "Percentage Discount" | "Fixed Amount Discount" | "Buy X Get Y" | "Buy One Get One"
  | "Bundle Offer" | "Product Discount" | "Category Discount" | "Brand Discount"
  | "Cart Value Discount" | "Quantity Discount" | "Tiered Discount"
  | "First Purchase Offer" | "Repeat Customer Offer" | "Loyalty Customer Offer"
  | "Dealer Offer" | "B2B Offer" | "B2C Offer" | "Employee Offer" | "Branch-Specific Offer"
  | "Festival Offer" | "Seasonal Offer" | "Flash Sale" | "Clearance Sale"
  | "Stock Clearance" | "Dead Stock Promotion" | "Slow-Moving Stock Promotion"
  | "New Product Launch" | "Generator + Accessory Bundle" | "Generator + Service Bundle"
  | "Generator + AMC Bundle" | "Spare Parts Bundle" | "Free Installation Offer"
  | "Free Delivery Offer" | "Free Service Offer" | "Extended Warranty Offer"
  | "Trolley Booking Offer" | "Coupon Code Promotion" | "Automatic Promotion"
  | "Referral Promotion" | "Customer-Specific Offer" | "Dealer-Specific Offer"
  | "Quote-Based Promotion" | "Invoice-Based Promotion" | "Payment-Mode Offer"
  | "Limited-Time Offer";

export type MPromoMediaUsage =
  | "Desktop Hero Banner" | "Mobile Hero Banner" | "Tablet Banner" | "Promotion Card"
  | "Product Offer Badge" | "Category Banner" | "Mega Menu Banner" | "Popup Image"
  | "Sidebar Banner" | "Dashboard Banner" | "Email Banner" | "Social Preview Image"
  | "Trolley Booking Promotion" | "Dealer Portal Banner";

export type MPromoImage = {
  id: string; url: string; name: string; size: number;
  width?: number; height?: number; format: string;
  alt: string; caption?: string; usage: MPromoMediaUsage;
  uploadedBy: string; uploadedAt: string; primary?: boolean;
};

export type MPromoVideo = {
  id: string; url: string; source: "upload" | "youtube" | "vimeo";
  title: string; description?: string; poster?: string;
  durationSec?: number; size?: number; format?: string;
  alt?: string; uploadedBy: string; uploadedAt: string;
  autoplay: boolean; muted: boolean; loop: boolean;
  showControls: boolean; playOnce: boolean; pauseOutOfView: boolean;
  mobileEnabled: boolean; desktopEnabled: boolean; lazyLoad: boolean;
  startSec?: number; endSec?: number;
  placement: string[];
};

export type MPromoRuleCondition = {
  id: string; field: string; op: string; value: string;
};
export type MPromoRuleGroup = {
  id: string; joiner: "AND" | "OR";
  conditions: MPromoRuleCondition[];
};
export type MPromoAction = {
  kind: "Percentage Off" | "Fixed Amount Off" | "Fixed Price" | "Buy X Get Y"
    | "Free Item" | "Free Accessory" | "Free Installation" | "Free Delivery"
    | "Free Service" | "Extended Warranty" | "Bundle Price" | "Tiered Discount";
  value?: number;
  buyQty?: number; getQty?: number; freeItem?: string;
  tiers?: { min: number; discountPct: number }[];
};

export type MPromoCoupon = {
  id: string; code: string; prefix?: string; suffix?: string;
  usageLimit?: number; perCustomerLimit?: number;
  minOrder?: number; maxDiscount?: number;
  used: number; disabled?: boolean;
};

export type MPromoApproval = {
  level: 1 | 2 | 3 | 4;
  role: "Marketing" | "Sales Manager" | "Accounts" | "Owner";
  decision?: "Approved" | "Rejected" | "Changes Requested";
  approver?: string; at?: string; remarks?: string;
};

export type MPromoAuditEntry = {
  at: string; user: string; action: string;
  oldValue?: string; newValue?: string; reason?: string;
};

export type MPromoVariant = {
  id: string; label: "A" | "B";
  headline?: string; imageUrl?: string; cta?: string;
  stats: { views: number; clicks: number; conversions: number; revenue: number };
};

export type MPromo = {
  id: string; number: string;
  name: string; internalCampaign?: string; code?: string; campaignId?: string;
  shortTitle?: string; headline?: string; subtitle?: string;
  shortDesc?: string; fullDesc?: string; internalNotes?: string;
  terms?: string; tags: string[];
  status: MPromoStatus; priority: MPromoPriority;
  type: MPromoType;

  // Eligibility
  products: string[]; categories: string[]; brands: string[];
  branches: string[]; // branch ids or "ALL"
  customerTypes: string[]; customerSegments: string[]; customers: string[];
  states: string[];
  // Generator-specific
  kvaMin?: number; kvaMax?: number; fuelType?: string; phase?: string;

  // Rules & actions
  rules: MPromoRuleGroup[];
  actions: MPromoAction[];
  stacking: "Allow Stack" | "Do Not Stack" | "Best Discount Only" | "Priority Promotion" | "Owner Override";

  // Coupons
  coupons: MPromoCoupon[];
  isAutomatic: boolean;

  // Media
  images: MPromoImage[]; videos: MPromoVideo[];

  // Placement
  placements: string[]; // e.g. "Home Hero", "Cart", "Dashboard"
  channels: string[];  // "E-Commerce", "ERP", "Dealer Portal"

  // Schedule
  startDate: string; startTime?: string;
  endDate: string; endTime?: string;
  timezone?: string; repeat: "Never" | "Daily" | "Weekly" | "Monthly" | "Custom";

  // Budget & limits
  budgetTotal?: number; budgetDiscount?: number; budgetMedia?: number;
  budgetUsed?: number;
  maxRedemptions?: number; maxDiscountValue?: number;
  perCustomerLimit?: number; perDayLimit?: number; perBranchLimit?: number;
  perProductLimit?: number; maxDiscountPerOrder?: number;

  // Margin
  costPrice?: number; sellingPrice?: number; promoPrice?: number;

  // Approval
  approvals: MPromoApproval[];

  // Analytics
  stats: {
    impressions: number; uniqueViews: number; clicks: number;
    addToCart: number; checkoutStarted: number; orders: number;
    revenue: number; discountGiven: number; unitsSold: number;
  };

  // A/B
  variants?: MPromoVariant[];

  // Audit
  audit: MPromoAuditEntry[];
  createdAt: string; createdBy: string;
  approvedBy?: string; publishedAt?: string;
  archivedAt?: string; deletedAt?: string;
};


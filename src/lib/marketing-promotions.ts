// Marketing Promotions data layer.
// Frontend-only localStorage store, structured for a future Django REST API.
// Replace `promoApi.*` with fetch calls when the backend is ready.

import * as React from "react";
import type {
  MPromo, MPromoStatus, MPromoType, MPromoImage, MPromoVideo,
  MPromoRuleGroup, MPromoAuditEntry, MPromoCoupon,
} from "./types";

const KEY = "gentech_marketing_promos_v1";

function load(): MPromo[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function save(list: MPromo[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("mpromo:changed"));
}

export const promoApi = {
  list(): MPromo[] { return load(); },
  upsert(p: MPromo) {
    const list = load();
    const i = list.findIndex((x) => x.id === p.id);
    if (i >= 0) list[i] = p; else list.unshift(p);
    save(list);
  },
  remove(id: string) { save(load().filter((p) => p.id !== id)); },
  softDelete(id: string) {
    const list = load().map((p) => p.id === id ? { ...p, status: "Archived" as MPromoStatus, archivedAt: new Date().toISOString() } : p);
    save(list);
  },
};

export function useMarketingPromos() {
  const [list, setList] = React.useState<MPromo[]>(() => load());
  React.useEffect(() => {
    const h = () => setList(load());
    window.addEventListener("mpromo:changed", h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener("mpromo:changed", h); window.removeEventListener("storage", h); };
  }, []);
  return {
    promos: list,
    upsert: (p: MPromo) => promoApi.upsert(p),
    remove: (id: string) => promoApi.remove(id),
    archive: (id: string) => promoApi.softDelete(id),
  };
}

export function makeEmpty(nextNumber: string, user: string): MPromo {
  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  return {
    id: `mp_${Date.now()}`, number: nextNumber, name: "", tags: [],
    status: "Draft", priority: "Medium", type: "Percentage Discount",
    products: [], categories: [], brands: [],
    branches: ["ALL"], customerTypes: ["All Customers"], customerSegments: [], customers: [],
    states: [],
    rules: [], actions: [{ kind: "Percentage Off", value: 10 }],
    stacking: "Best Discount Only",
    coupons: [], isAutomatic: true,
    images: [], videos: [],
    placements: ["Home Hero"], channels: ["E-Commerce"],
    startDate: today, endDate: in30, timezone: "Asia/Kolkata", repeat: "Never",
    approvals: [
      { level: 1, role: "Marketing" },
      { level: 2, role: "Sales Manager" },
      { level: 3, role: "Accounts" },
      { level: 4, role: "Owner" },
    ],
    stats: { impressions: 0, uniqueViews: 0, clicks: 0, addToCart: 0, checkoutStarted: 0, orders: 0, revenue: 0, discountGiven: 0, unitsSold: 0 },
    audit: [{ at: new Date().toISOString(), user, action: "Created" }],
    createdAt: new Date().toISOString(), createdBy: user,
  };
}

export function nextPromoNumber(list: MPromo[]) {
  return `PROMO-${new Date().getFullYear()}-${String(list.length + 1).padStart(4, "0")}`;
}

export function logAudit(p: MPromo, entry: Omit<MPromoAuditEntry, "at">): MPromo {
  return { ...p, audit: [{ at: new Date().toISOString(), ...entry }, ...p.audit] };
}

// Seed a few demos on first visit so the module isn't empty for the owner.
export function ensureSeed(user: string) {
  if (load().length > 0) return;
  const now = new Date().toISOString();
  const today = new Date().toISOString().slice(0, 10);
  const in7 = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const past = new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10);
  const seed: MPromo[] = [
    {
      ...makeEmpty("PROMO-2026-0001", user),
      id: "mp_seed_1", name: "Diwali Generator Bonanza", internalCampaign: "Diwali 2026",
      code: "DIWALI26", headline: "Flat 12% off + Free Installation",
      shortDesc: "Special festival pricing on all diesel gensets 5–50 kVA.",
      type: "Festival Offer", status: "Active", priority: "High",
      startDate: past, endDate: in7,
      actions: [{ kind: "Percentage Off", value: 12 }, { kind: "Free Installation" }],
      placements: ["Home Hero", "Product Detail", "Cart", "Dashboard"],
      channels: ["E-Commerce", "ERP", "Dealer Portal"],
      budgetTotal: 500000, budgetUsed: 187500, maxRedemptions: 200,
      stats: { impressions: 24310, uniqueViews: 12480, clicks: 3120, addToCart: 480, checkoutStarted: 240, orders: 96, revenue: 4820000, discountGiven: 187500, unitsSold: 108 },
      audit: [{ at: now, user, action: "Published" }],
      approvedBy: user, publishedAt: now,
      approvals: [
        { level: 1, role: "Marketing", decision: "Approved", approver: user, at: now },
        { level: 2, role: "Sales Manager", decision: "Approved", approver: user, at: now },
        { level: 3, role: "Accounts", decision: "Approved", approver: user, at: now },
        { level: 4, role: "Owner", decision: "Approved", approver: user, at: now },
      ],
    },
    {
      ...makeEmpty("PROMO-2026-0002", user),
      id: "mp_seed_2", name: "Spare Parts Flash Sale", type: "Flash Sale",
      status: "Scheduled", priority: "Medium",
      startDate: in7, endDate: in30,
      headline: "10% off spare parts weekend",
      actions: [{ kind: "Percentage Off", value: 10 }],
      placements: ["Product Listing", "Cart"], channels: ["E-Commerce"],
      budgetTotal: 100000, budgetUsed: 0,
    },
    {
      ...makeEmpty("PROMO-2026-0003", user),
      id: "mp_seed_3", name: "Dealer Bulk Discount – Q2", type: "Dealer Offer",
      status: "Pending Approval", priority: "High",
      startDate: today, endDate: in30,
      headline: "Tiered dealer pricing on 20+ kVA",
      actions: [{ kind: "Tiered Discount", tiers: [{ min: 5, discountPct: 6 }, { min: 10, discountPct: 9 }, { min: 20, discountPct: 12 }] }],
      channels: ["Dealer Portal", "ERP"], placements: ["Dealer Portal"],
    },
  ];
  save(seed);
}

import type { Product } from "./types";

// Derived spec values for marketing/comparison surfaces. Keeps the core
// Product type lean while giving the public site rich spec data.
export type FullSpec = {
  capacityKVA: number;
  capacityKW: number;
  fuel: string;
  engineModel: string;
  alternator: string;
  frequency: string;
  voltage: string;
  tankLiters: number;
  fuelConsumption: string;
  noiseDb: number;
  weightKg: number;
  dimensions: string;
  startingSystem: string;
  controller: string;
  application: string;
  warrantyMonths: number;
  badges: string[];
};

const engines: Record<string, string> = {
  Diesel: "Kirloskar 4R1040TA",
  Petrol: "GT-Petrol PX-Series",
  Gas: "Cummins GTA-Series (CNG/LPG)",
};

export function productSpecs(p: Product): FullSpec {
  const kw = +(p.capacityKVA * 0.8).toFixed(1);
  const noise = Math.round(70 + Math.log2(p.capacityKVA + 1) * 1.6);
  const weight = Math.round(180 + p.capacityKVA * 14);
  const tank = Math.round(40 + p.capacityKVA * 2.8);
  const consumption = `${(p.capacityKVA * 0.22).toFixed(1)} L/hr @ 75% load`;
  const dims =
    p.capacityKVA < 20
      ? "1200 × 700 × 900 mm"
      : p.capacityKVA < 80
      ? "2100 × 900 × 1400 mm"
      : p.capacityKVA < 200
      ? "2900 × 1100 × 1700 mm"
      : "3800 × 1300 × 2100 mm";
  const app =
    p.capacityKVA < 10
      ? "Residential / Retail"
      : p.capacityKVA < 50
      ? "Commercial / SMB"
      : p.capacityKVA < 200
      ? "Industrial / Hospitals"
      : "Heavy Industry / Telecom";
  const badges: string[] = [];
  if (p.stock >= 10) badges.push("Best Seller");
  if (p.capacityKVA >= 25 && p.capacityKVA <= 100) badges.push("Recommended");
  if (p.fuel === "Gas") badges.push("Most Efficient");
  if (p.sku.includes("125")) badges.push("New Launch");

  return {
    capacityKVA: p.capacityKVA,
    capacityKW: kw,
    fuel: p.fuel,
    engineModel: engines[p.fuel],
    alternator: "Stamford / Mecc Alte BCI Series",
    frequency: "50 Hz",
    voltage: p.capacityKVA < 20 ? "230 V (1-Ph)" : "415 V (3-Ph)",
    tankLiters: tank,
    fuelConsumption: consumption,
    noiseDb: noise,
    weightKg: weight,
    dimensions: dims,
    startingSystem: p.capacityKVA < 10 ? "Recoil / Electric" : "Electric (12V/24V DC)",
    controller: p.capacityKVA < 25 ? "Manual Start Panel" : "AMF + Remote Monitoring",
    application: app,
    warrantyMonths: p.warrantyMonths,
    badges,
  };
}
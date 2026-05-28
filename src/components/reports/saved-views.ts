export type ReportView = { name: string; columns: string[]; createdAt: string };

const key = (id: string) => `gentech_views_${id}`;

export function listViews(id: string): ReportView[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key(id)) ?? "[]"); } catch { return []; }
}
export function saveView(id: string, view: ReportView) {
  const all = listViews(id).filter((v) => v.name !== view.name);
  all.unshift(view);
  localStorage.setItem(key(id), JSON.stringify(all.slice(0, 12)));
}
export function removeView(id: string, name: string) {
  const all = listViews(id).filter((v) => v.name !== name);
  localStorage.setItem(key(id), JSON.stringify(all));
}
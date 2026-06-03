import * as React from "react";
import type { Role, User } from "./types";

type AuthCtx = {
  user: User | null;
  login: (email: string, role?: Role, meta?: { branchId?: string }) => void;
  logout: () => void;
  loginHistory: LoginEntry[];
};

export type LoginEntry = {
  id: string; user: string; role: string; branchId?: string;
  loginAt: string; logoutAt?: string; ip: string;
};

const Ctx = React.createContext<AuthCtx | null>(null);
const KEY = "gentech_user";
const HIST_KEY = "gentech_login_history";
const CUR_KEY = "gentech_current_session";

function nowStr() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fakeIp() {
  return `192.168.${Math.floor(Math.random()*250)+1}.${Math.floor(Math.random()*250)+1}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loginHistory, setLoginHistory] = React.useState<LoginEntry[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
    try {
      const h = localStorage.getItem(HIST_KEY);
      if (h) setLoginHistory(JSON.parse(h));
    } catch { /* ignore */ }
  }, []);

  const persistHist = (next: LoginEntry[]) => {
    setLoginHistory(next);
    try { localStorage.setItem(HIST_KEY, JSON.stringify(next.slice(0, 200))); } catch { /* ignore */ }
  };

  const login = (email: string, role: Role = "Super Admin", meta?: { branchId?: string }) => {
    const u: User = {
      id: "u1",
      name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
    };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    const entry: LoginEntry = {
      id: `lh_${Date.now()}`, user: email.split("@")[0], role,
      branchId: meta?.branchId, loginAt: nowStr(), ip: fakeIp(),
    };
    localStorage.setItem(CUR_KEY, entry.id);
    persistHist([entry, ...loginHistory]);
  };

  const logout = () => {
    try {
      const curId = localStorage.getItem(CUR_KEY);
      if (curId) {
        const next = loginHistory.map((h) => h.id === curId ? { ...h, logoutAt: nowStr() } : h);
        persistHist(next);
      }
      localStorage.removeItem(CUR_KEY);
    } catch { /* ignore */ }
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout, loginHistory }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
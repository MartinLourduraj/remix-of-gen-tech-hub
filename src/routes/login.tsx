import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Building2, Mail, KeyRound, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/login")({ component: LoginPage });

const ROLES: Role[] = [
  "Super Admin", "Admin", "Accounts Manager", "Sales Manager",
  "Sales Executive", "Service Manager", "Inventory Manager", "Dealer",
];

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = React.useState("admin@gentech.in");
  const [password, setPassword] = React.useState("demo1234");
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [role, setRole] = React.useState<Role>("Super Admin");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || `${mobile}@gentech.in`, role);
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-white/15">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold">Gen-Tech Generators</div>
            <div className="text-xs opacity-80">Authorized Dealer ERP Suite</div>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight">Run your dealership on one platform.</h1>
          <p className="text-primary-foreground/80 max-w-md">
            Sales, GST billing, e-invoicing, warranty, AMC service, inventory, accounting and analytics — built for authorized generator dealers across India.
          </p>
          <ul className="space-y-1.5 text-sm text-primary-foreground/80">
            <li>• GSTR-1 / GSTR-3B ready with IRN & E-Way Bill</li>
            <li>• Lead → Quotation → Order → Invoice → Warranty</li>
            <li>• Multi-branch inventory + technician scheduling</li>
            <li>• Role-based access for 15+ default roles</li>
          </ul>
        </div>
        <p className="text-xs opacity-70">© 2026 Gen-Tech Generators Pvt Ltd</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold">Sign in to your workspace</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use email, mobile OTP, or your dealer credentials.</p>

          <Tabs defaultValue="email" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email"><Mail className="mr-1.5 h-3.5 w-3.5" />Email</TabsTrigger>
              <TabsTrigger value="otp"><Smartphone className="mr-1.5 h-3.5 w-3.5" />Mobile OTP</TabsTrigger>
              <TabsTrigger value="user"><KeyRound className="mr-1.5 h-3.5 w-3.5" />Username</TabsTrigger>
            </TabsList>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <TabsContent value="email" className="space-y-4 mt-0">
                <div className="space-y-1.5">
                  <Label>Email address</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </TabsContent>
              <TabsContent value="otp" className="space-y-4 mt-0">
                <div className="space-y-1.5">
                  <Label>Mobile number</Label>
                  <Input type="tel" placeholder="98XXXXXXXX" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>6-digit OTP</Label>
                  <Input inputMode="numeric" maxLength={6} placeholder="• • • • • •" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>
              </TabsContent>
              <TabsContent value="user" className="space-y-4 mt-0">
                <div className="space-y-1.5">
                  <Label>Username</Label>
                  <Input defaultValue="admin" />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <Input type="password" defaultValue="demo1234" />
                </div>
              </TabsContent>

              <div className="space-y-1.5">
                <Label>Sign in as (demo)</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Sign in</Button>

              <div className="flex items-center justify-between text-xs">
                <a className="text-primary hover:underline" href="#">Forgot password?</a>
                <span className="text-muted-foreground">2FA available • Session-managed</span>
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
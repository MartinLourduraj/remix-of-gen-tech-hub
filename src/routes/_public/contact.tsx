import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">Get in Touch</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">Talk to our power experts</h1>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Enquiry submitted — our team will be in touch in 24 hrs."); (e.target as HTMLFormElement).reset(); }} className="grid sm:grid-cols-2 gap-4">
              <F label="Name"><Input required /></F>
              <F label="Mobile"><Input required type="tel" /></F>
              <F label="Email"><Input required type="email" /></F>
              <F label="Company"><Input /></F>
              <F label="Requirement" className="col-span-2"><Textarea required rows={5} placeholder="Capacity (KVA), quantity, location, application…" /></F>
              <Button type="submit" className="col-span-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">Send Enquiry</Button>
            </form>
          </Card>
        </div>
        <div className="space-y-4">
          {[
            { i: Phone, t: "Sales Helpline", d: "1800-200-7777 (Toll Free)" },
            { i: Mail, t: "Email", d: "sales@gentech.in" },
            { i: MapPin, t: "Head Office", d: "Plot 12, Industrial Estate, Pune 411019" },
            { i: Clock, t: "Service Hours", d: "24x7 emergency · Mon–Sat sales" },
          ].map(x => (
            <Card key={x.t} className="p-4 flex items-start gap-3"><x.i className="h-5 w-5 text-[var(--brand-orange)] mt-0.5" /><div><div className="font-semibold text-sm">{x.t}</div><div className="text-sm text-muted-foreground">{x.d}</div></div></Card>
          ))}
        </div>
      </div>
    </div>
  );
}
function F({ label, children, className = "" }: any) { return <div className={"space-y-1.5 " + className}><Label>{label}</Label>{children}</div>; }

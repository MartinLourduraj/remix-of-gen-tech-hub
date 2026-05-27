import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/service-request")({ component: ServicePage });

function ServicePage() {
  const [ticket, setTicket] = React.useState<string | null>(null);
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="text-center mb-8">
        <div className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] mb-4"><Wrench className="h-7 w-7" /></div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Book a Service / Raise a Complaint</h1>
        <p className="mt-2 text-muted-foreground">Tickets are auto-assigned to your nearest engineer — typical first response in 90 minutes.</p>
      </div>
      {ticket ? (
        <Card className="p-10 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <div className="text-xl font-bold">Ticket {ticket} created</div>
          <p className="mt-2 text-muted-foreground">An engineer will call you within 90 minutes.</p>
          <Button asChild className="mt-6"><Link to="/">Back to Home</Link></Button>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); const id = "SR-" + Math.floor(Math.random() * 90000 + 10000); setTicket(id); toast.success(`Ticket ${id} created`); }} className="grid sm:grid-cols-2 gap-4">
            <F label="Name"><Input required /></F>
            <F label="Mobile"><Input required type="tel" /></F>
            <F label="Email"><Input type="email" /></F>
            <F label="Generator Model"><Input required /></F>
            <F label="Serial / Warranty No"><Input /></F>
            <F label="Service Type">
              <Select defaultValue="Breakdown">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Breakdown", "Periodic Service", "Load Bank Test", "AMC Renewal", "Installation"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Site Address" className="col-span-2"><Textarea required rows={2} /></F>
            <F label="Issue Description" className="col-span-2"><Textarea required rows={3} placeholder="Describe the problem…" /></F>
            <Button type="submit" className="col-span-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">Submit Service Request</Button>
          </form>
        </Card>
      )}
    </div>
  );
}
function F({ label, children, className = "" }: any) { return <div className={"space-y-1.5 " + className}><Label>{label}</Label>{children}</div>; }

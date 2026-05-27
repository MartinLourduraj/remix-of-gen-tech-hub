import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Factory, Users, Wrench } from "lucide-react";

export const Route = createFileRoute("/_public/about")({ component: AboutPage });

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-xs uppercase tracking-wider text-[var(--brand-orange)] font-semibold">About Gen-Tech</div>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Powering India's industries since 2008</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">Authorized dealer for Kirloskar, Cummins and Mahindra Powerol — Gen-Tech delivers turnkey power solutions from 5 kVA to 2500 kVA backed by a 240-strong service engineer network.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {[{i: Award, n: "17+", l: "Years"}, {i: Factory, n: "8.4k+", l: "Installs"}, {i: Wrench, n: "240+", l: "Engineers"}, {i: Users, n: "6.2k+", l: "Customers"}].map(x => (
          <Card key={x.l} className="p-5 text-center"><x.i className="h-7 w-7 text-[var(--brand-orange)] mx-auto mb-2" /><div className="text-2xl font-extrabold text-[var(--brand-navy)]">{x.n}</div><div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{x.l}</div></Card>
        ))}
      </div>
      <Button asChild className="mt-8 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white"><Link to="/contact">Get in touch</Link></Button>
    </div>
  );
}

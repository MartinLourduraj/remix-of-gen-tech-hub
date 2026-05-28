import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FileText, Phone, GitCompare, Download, MessageSquare } from "lucide-react";

type Props = {
  productId?: string;
  variant?: "card" | "detail";
  className?: string;
};

export function ProductActions({ variant = "card", className }: Props) {
  if (variant === "detail") {
    return (
      <div className={className ?? "flex flex-wrap gap-3"}>
        <Button asChild size="lg" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white">
          <Link to="/contact"><FileText className="mr-1.5 h-4 w-4" /> Request Quote</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/contact"><MessageSquare className="mr-1.5 h-4 w-4" /> Get Best Price</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/contact"><Phone className="mr-1.5 h-4 w-4" /> Contact Sales</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/compare"><GitCompare className="mr-1.5 h-4 w-4" /> Compare</Link>
        </Button>
        <Button size="lg" variant="ghost" onClick={() => window.print()}>
          <Download className="mr-1.5 h-4 w-4" /> Brochure (PDF)
        </Button>
      </div>
    );
  }
  return (
    <div className={className ?? "grid grid-cols-2 gap-1.5"}>
      <Button asChild size="sm" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-2)] text-white col-span-2">
        <Link to="/contact"><FileText className="mr-1.5 h-3.5 w-3.5" /> Request Quote</Link>
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link to="/compare"><GitCompare className="mr-1 h-3.5 w-3.5" /> Compare</Link>
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link to="/contact"><Phone className="mr-1 h-3.5 w-3.5" /> Sales</Link>
      </Button>
    </div>
  );
}
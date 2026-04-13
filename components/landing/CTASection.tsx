import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-[var(--foreground)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold mb-3">
            Live-Demo
          </div>
          <h2 className="text-[30px] leading-[1.1] tracking-[-0.02em] font-semibold">
            Werksumzug Hannover — in 3 Minuten durchgespielt.
          </h2>
        </div>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-8 h-14 font-semibold text-[15px] transition-colors shrink-0"
        >
          Demo starten
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

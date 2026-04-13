import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-[var(--foreground)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-8">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold mb-4">
            Demo
          </div>
          <h2 className="text-[36px] leading-[1.1] tracking-[-0.02em] font-semibold">
            In drei Minuten durchgespielt:
            <br />
            Ein Werksumzug nach Hannover.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] text-white/70 leading-[1.6]">
            Live-Szenario mit vier Monteuren, 4 Nächten, Werkzeug-Transport und
            Richtlinien-Check. Klickbar, nachvollziehbar, SCHOLPP-spezifisch.
          </p>
        </div>
        <div className="md:col-span-4 flex md:justify-end">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-8 h-14 font-semibold text-[15px] transition-colors"
          >
            Live-Demo starten
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

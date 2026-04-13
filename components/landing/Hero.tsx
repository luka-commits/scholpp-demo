import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-8">
          <div className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold mb-6">
            <span className="w-8 h-px bg-[var(--scholpp-red)]" />
            Konzept Pilot
          </div>
          <h1 className="font-sans text-[44px] md:text-[56px] leading-[1.05] tracking-[-0.02em] font-bold text-[var(--foreground)]">
            Reisekoordinator
            <br />
            <span className="text-[var(--muted-foreground)] font-light">
              Ein digitaler Kollege
            </span>
            <br />
            für eure Projektleiter.
          </h1>
          <p className="mt-8 max-w-xl text-[16px] leading-[1.6] text-[var(--muted-foreground)]">
            Hotelrecherche, Fahrzeug-Optimierung und Richtlinien-Kontrolle für
            Monteur-Einsätze — automatisiert bis zur Freigabe, jede Entscheidung
            nachvollziehbar. Eure Projektleiter behalten die Kontrolle, der Agent
            übernimmt die Fleißarbeit.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-6 h-12 font-semibold text-[14px] transition-colors"
            >
              Live-Demo starten
              <ArrowRight size={16} />
            </Link>
            <a
              href="#problem"
              className="text-[14px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium"
            >
              Ausgangslage →
            </a>
          </div>
        </div>
        <div className="md:col-span-4 hairline border bg-[var(--muted)]/40 p-6">
          <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] mb-3 font-semibold">
            Pilot-Szenario
          </div>
          <dl className="space-y-3 text-[13px]">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <dt className="text-[var(--muted-foreground)]">Fachgebiet</dt>
              <dd className="font-medium">Reisemanagement</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <dt className="text-[var(--muted-foreground)]">Mitarbeiter-Kontext</dt>
              <dd className="font-medium">Projektleiter Field Service</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <dt className="text-[var(--muted-foreground)]">Integrationen</dt>
              <dd className="font-medium">Roomix, Fleet, Kalender</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">Aufbauzeit</dt>
              <dd className="font-medium">4 Wochen</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

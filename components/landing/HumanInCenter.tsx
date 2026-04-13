import { Clock, Check } from "lucide-react";

export function HumanInCenter() {
  return (
    <section className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold mb-4">
            Mensch im Zentrum
          </div>
          <h2 className="text-[32px] leading-[1.15] tracking-[-0.01em] font-semibold">
            Niemand wird ersetzt — die Fleißarbeit verschwindet.
          </h2>
          <p className="mt-4 text-[15px] text-[var(--muted-foreground)] leading-[1.6]">
            Der Mitarbeiter behält die Entscheidung. Der Agent übernimmt die Recherche, das
            Vergleichen, das Zusammenstellen.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-[var(--border)] hairline border">
          <div className="bg-white p-8">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] font-semibold text-[var(--muted-foreground)] mb-6">
              <Clock size={14} />
              Heute
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-[44px] font-bold tracking-[-0.02em] leading-none">
                45 min
              </span>
              <span className="text-[14px] text-[var(--muted-foreground)]">pro Buchung</span>
            </div>
            <ul className="space-y-3 text-[14px] text-[var(--muted-foreground)] leading-[1.5]">
              <li>40 min Recherche (Roomix, Google Maps, Preisvergleich)</li>
              <li>5 min Freigabe / Entscheidung</li>
            </ul>
          </div>
          <div className="bg-white p-8 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--scholpp-red)]" />
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] font-semibold text-[var(--scholpp-red)] mb-6">
              <Check size={14} />
              Mit Agent
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-[44px] font-bold tracking-[-0.02em] leading-none">
                2 min
              </span>
              <span className="text-[14px] text-[var(--muted-foreground)]">pro Buchung</span>
            </div>
            <ul className="space-y-3 text-[14px] text-[var(--muted-foreground)] leading-[1.5]">
              <li>0 min Recherche (Agent liefert Vorschlag mit Quellen)</li>
              <li>2 min Freigabe / Anpassung</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

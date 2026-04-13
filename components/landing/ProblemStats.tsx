import { problemZahlen } from "@/data/kpis";

export function ProblemStats() {
  return (
    <section id="problem" className="border-b border-[var(--border)] bg-[var(--muted)]/30">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold mb-4">
            Ausgangslage
          </div>
          <h2 className="text-[32px] leading-[1.15] tracking-[-0.01em] font-semibold">
            Reisekoordination bindet Zeit, die an anderer Stelle fehlt.
          </h2>
          <p className="mt-4 text-[15px] text-[var(--muted-foreground)] leading-[1.6]">
            Auf Basis des Erstgesprächs und typischer Field-Service-Benchmarks — die Pilotphase
            validiert diese Zahlen mit echten SCHOLPP-Daten.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[var(--border)] hairline border">
          {problemZahlen.map((p) => (
            <div key={p.label} className="bg-white p-8">
              <div className="text-[42px] font-bold tracking-[-0.02em] text-[var(--scholpp-red)] leading-none">
                {p.zahl}
              </div>
              <div className="mt-4 text-[14px] font-medium leading-[1.4] text-[var(--foreground)]">
                {p.label}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-wide text-[var(--muted-foreground)]">
                {p.quelle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

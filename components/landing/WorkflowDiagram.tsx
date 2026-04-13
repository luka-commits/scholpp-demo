import { Inbox, Search, ShieldCheck, SlidersHorizontal, UserCheck } from "lucide-react";

const schritte = [
  { icon: Inbox, label: "Anfrage", sub: "Projektleiter-Eingabe" },
  { icon: Search, label: "Recherche", sub: "Hotels, Fahrzeuge, Routen" },
  { icon: ShieldCheck, label: "Richtlinien-Check", sub: "Betriebsordnung v2.3" },
  { icon: SlidersHorizontal, label: "Bewertung", sub: "Scoring & Ranking" },
  { icon: UserCheck, label: "Freigabe", sub: "Human-in-the-Loop" },
];

export function WorkflowDiagram() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--muted)]/30">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold mb-4">
            Workflow
          </div>
          <h2 className="text-[32px] leading-[1.15] tracking-[-0.01em] font-semibold">
            Von der Anfrage zur Freigabe — 5 Schritte.
          </h2>
        </div>
        <div className="hairline border bg-white p-8">
          <div className="flex items-start justify-between gap-4 overflow-x-auto">
            {schritte.map((s, i) => (
              <div key={s.label} className="flex items-start flex-1 min-w-[140px]">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-[var(--border-strong)] flex items-center justify-center bg-white">
                      <s.icon size={16} className="text-[var(--scholpp-red)]" />
                    </div>
                    <div className="font-mono text-[11px] text-[var(--muted-foreground)]">
                      0{i + 1}
                    </div>
                  </div>
                  <div className="mt-3 text-[14px] font-semibold tracking-[-0.01em]">
                    {s.label}
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--muted-foreground)] leading-[1.4]">
                    {s.sub}
                  </div>
                </div>
                {i < schritte.length - 1 && (
                  <div className="flex-1 h-px bg-[var(--border-strong)] mt-4 mx-3 min-w-[20px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

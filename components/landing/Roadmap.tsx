const wochen = [
  {
    label: "Woche 1",
    titel: "Datenzugang & Scoping",
    items: [
      "Zugang Roomix, Fleet-System, Kalender",
      "Betriebsordnung digitalisiert",
      "3 Test-Projektleiter ausgewählt",
    ],
  },
  {
    label: "Woche 2",
    titel: "Agent-Prototyp",
    items: [
      "Live-Agent auf 5 realen Testanfragen",
      "Reasoning-Audit + Freigabe-Workflow",
      "Erste Feedback-Runde",
    ],
  },
  {
    label: "Woche 3",
    titel: "Edge-Cases & Feinschliff",
    items: [
      "Sonderfälle (Messen, Mehrort-Einsätze)",
      "Ausnahme-Handling für Richtlinien-Abweichungen",
      "Monitoring-Dashboard",
    ],
  },
  {
    label: "Woche 4",
    titel: "Go-Live & Handover",
    items: [
      "Rollout an Projektleiter-Pool",
      "Schulung (30-min-Onboarding)",
      "Bewertungsgespräch + Retainer-Entscheidung",
    ],
  },
];

export function Roadmap() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--muted)]/30">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold mb-4">
            Aufbau
          </div>
          <h2 className="text-[32px] leading-[1.15] tracking-[-0.01em] font-semibold">
            Vier Wochen vom Scoping bis Go-Live.
          </h2>
        </div>
        <div className="hairline border bg-white">
          {wochen.map((w, i) => (
            <div
              key={w.label}
              className={`grid grid-cols-[160px_1fr_2fr] gap-8 p-6 ${
                i < wochen.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <div>
                <div className="font-mono text-[11px] text-[var(--muted-foreground)] mb-1">
                  0{i + 1} / 04
                </div>
                <div className="text-[14px] font-semibold text-[var(--scholpp-red)]">
                  {w.label}
                </div>
              </div>
              <div className="text-[16px] font-semibold tracking-[-0.01em] self-start">
                {w.titel}
              </div>
              <ul className="space-y-2 text-[14px] text-[var(--muted-foreground)] leading-[1.5]">
                {w.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--muted-foreground)]">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

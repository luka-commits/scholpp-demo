import { FileText, MessageSquare, BarChart3 } from "lucide-react";

const phasen = [
  {
    icon: FileText,
    titel: "Angebotswesen",
    sub: "Text-zu-Dokument, CRM-Pflege, Kalkulations-Synthese",
  },
  {
    icon: MessageSquare,
    titel: "Baustellen-Kommunikation",
    sub: "WhatsApp-Triage, Statusmeldungen, Krankmeldungen",
  },
  {
    icon: BarChart3,
    titel: "Reporting & Controlling",
    sub: "Automatisierte Auslastungs- und Kostenreports",
  },
];

export function FuturePhases() {
  return (
    <section className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold mb-4">
            Phase 2+
          </div>
          <h2 className="text-[32px] leading-[1.15] tracking-[-0.01em] font-semibold">
            Weitere Einsatzgebiete — wenn der Pilot aufgeht.
          </h2>
          <p className="mt-4 text-[15px] text-[var(--muted-foreground)] leading-[1.6]">
            Das gleiche Framework, andere Rollen. Nach erfolgreicher Reisemanagement-Pilotierung
            sind das naheliegende nächste Schritte:
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[var(--border)] hairline border">
          {phasen.map((p) => (
            <div key={p.titel} className="bg-[var(--muted)]/50 p-8 opacity-70">
              <p.icon size={20} className="text-[var(--muted-foreground)]" />
              <div className="mt-4 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                Phase 2
              </div>
              <div className="mt-1 text-[18px] font-semibold tracking-[-0.01em] text-[var(--muted-foreground)]">
                {p.titel}
              </div>
              <div className="mt-3 text-[13px] text-[var(--muted-foreground)] leading-[1.5]">
                {p.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

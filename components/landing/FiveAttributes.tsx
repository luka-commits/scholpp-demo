import { UserCircle, Zap, Shield, Network, Wrench } from "lucide-react";

const attribute = [
  {
    icon: UserCircle,
    label: "Rolle",
    kurz: "Reisekoordinator",
    inhalte: [
      "Entlastet Projektleiter bei Reisevorbereitung",
      "Vorschläge zur Freigabe, keine Auto-Buchung",
    ],
  },
  {
    icon: Zap,
    label: "Aktionen",
    kurz: "6 Kernaufgaben",
    inhalte: [
      "Hotelrecherche (Roomix + Marktportale)",
      "Fahrzeug- und Route-Optimierung",
      "Richtlinien-Check & Compliance-Report",
    ],
  },
  {
    icon: Shield,
    label: "Leitplanken",
    kurz: "SCHOLPP-Betriebsordnung",
    inhalte: [
      "Max. 120 €/Nacht, ≥ 3★, ≤ 15 km zur Baustelle",
      "Roomix bevorzugt (Sammelrechnung)",
      "Human-in-the-Loop bei jeder Freigabe",
    ],
  },
  {
    icon: Network,
    label: "Kanäle",
    kurz: "Nahtlose Anbindung",
    inhalte: [
      "Eingabeformular im Projektleiter-Portal",
      "Optional: Gmail/Outlook, WhatsApp Business",
      "Ausgabe an Kalender, CRM, Abrechnung",
    ],
  },
  {
    icon: Wrench,
    label: "Tools",
    kurz: "Bestehende Systeme",
    inhalte: [
      "Roomix-Portal (SCHOLPP-Hotelbuchung)",
      "Fleet-Management-System",
      "Google Maps, booking.com, hrs.de",
    ],
  },
];

export function FiveAttributes() {
  return (
    <section className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold mb-4">
            Framework
          </div>
          <h2 className="text-[32px] leading-[1.15] tracking-[-0.01em] font-semibold">
            Fünf Attribute pro digitalem Mitarbeiter.
          </h2>
          <p className="mt-4 text-[15px] text-[var(--muted-foreground)] leading-[1.6]">
            So strukturieren wir jeden Agent — bei SCHOLPP konkret so ausgefüllt:
          </p>
        </div>
        <div className="grid md:grid-cols-5 gap-px bg-[var(--border)] hairline border">
          {attribute.map((a) => (
            <div key={a.label} className="bg-white p-6 flex flex-col">
              <a.icon size={20} className="text-[var(--scholpp-red)]" />
              <div className="mt-4 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                {a.label}
              </div>
              <div className="mt-1 text-[16px] font-semibold tracking-[-0.01em]">
                {a.kurz}
              </div>
              <ul className="mt-4 space-y-2 text-[13px] text-[var(--muted-foreground)] leading-[1.5]">
                {a.inhalte.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--scholpp-red)]">·</span>
                    <span>{i}</span>
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

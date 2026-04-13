import { Users, Wrench, ShieldCheck, Route, Building2 } from "lucide-react";

const bullets = [
  {
    icon: Users,
    titel: "Team-Auswahl",
    sub: "Qualifikations-Matching, Verfügbarkeits-Check, G25/G41-Untersuchungen aktuell",
  },
  {
    icon: Wrench,
    titel: "Equipment-Disposition",
    sub: "Geschirr, Werkzeug, Prüfplaketten — Konflikte erkennen, Ersatz vorschlagen",
  },
  {
    icon: Route,
    titel: "Anreise & Logistik",
    sub: "Hotel, Fahrzeug und Equipment-Transport abgestimmt auf die Betriebsordnung",
  },
  {
    icon: ShieldCheck,
    titel: "Compliance",
    sub: "Betriebsordnung v2.3, Tarifvertrag, PSA-Check, bei Bedarf A1-Bescheinigung",
  },
  {
    icon: Building2,
    titel: "Vor-Ort-Setup",
    sub: "Werkschutz-Anmeldung, Ansprechpartner beim Kunden, Parkplatz und Stellplatz",
  },
];

export function WasDerAgentUebernimmt() {
  return (
    <section className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold mb-8">
          Was der Agent übernimmt · 5 Facetten pro Einsatz
        </div>
        <ul className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {bullets.map((b) => (
            <li key={b.titel} className="flex flex-col gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[var(--scholpp-red)]/10 text-[var(--scholpp-red)] shrink-0">
                <b.icon size={18} />
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-[-0.01em] mb-1">
                  {b.titel}
                </div>
                <div className="text-[12px] text-[var(--muted-foreground)] leading-[1.5]">
                  {b.sub}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

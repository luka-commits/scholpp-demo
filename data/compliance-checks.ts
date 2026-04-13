export type ComplianceCheck = {
  id: string;
  label: string;
  detail: string;
  status: "ok" | "warning" | "n/a";
  quelle: string;
};

export const complianceChecks: ComplianceCheck[] = [
  {
    id: "c1",
    label: "G25-Untersuchung (Fahr-/Steuertätigkeit)",
    detail: "Alle 3 Monteure aktuell gültig (nächste Frist 08/2026)",
    status: "ok",
    quelle: "Personal-DB",
  },
  {
    id: "c2",
    label: "G41-Untersuchung (Arbeiten mit Absturzgefahr)",
    detail: "2/3 gültig — bei Höhenzugang-Arbeit aktiv (Brandt, Petersen)",
    status: "ok",
    quelle: "Personal-DB",
  },
  {
    id: "c3",
    label: "PSA-Vollständigkeit",
    detail: "Sicherheitsschuhe, Helm, Handschuhe, Warnweste — alle Monteure ausgestattet",
    status: "ok",
    quelle: "Lager-DB",
  },
  {
    id: "c4",
    label: "Arbeitszeitgesetz (Fahrt + Arbeitszeit)",
    detail: "Anreise mit Sprinter + Übernachtung → max. 10 h Fahrt/Tag eingehalten",
    status: "ok",
    quelle: "Tarifvertrag Sächs. Verkehrsgewerbe",
  },
  {
    id: "c5",
    label: "Reisekosten-Pauschale / Auslösen",
    detail: "Tagessatz 28 € · Übernachtungs-Pauschale 20 € — in Kalkulation berücksichtigt",
    status: "ok",
    quelle: "Tarifvertrag Sächs. Verkehrsgewerbe",
  },
  {
    id: "c6",
    label: "A1-Bescheinigung (EU-Auslands-Einsatz)",
    detail: "Nicht erforderlich — Einsatz innerhalb Deutschlands",
    status: "n/a",
    quelle: "DRV",
  },
];

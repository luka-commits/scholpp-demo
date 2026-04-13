export type FahrzeugOption = {
  id: string;
  name: string;
  kurz: string;
  fahrzeuge: { typ: string; anzahl: number; kosten: number }[];
  kapazitaetPax: number;
  kapazitaetGut: string;
  gesamtkosten: number;
  fahrzeit: string;
  co2Kg: number;
  empfohlen: boolean;
  begruendung?: string;
};

// Kostenbasis: ADAC Autokostenrechner + SCHOLPP Fleet-Management.
// Sprinter-Start-NL wird zur Laufzeit von der Routes-API-Optimierung gewählt
// (siehe lib/route-optimizer.ts), nicht hier hart kodiert.
export const fahrzeugOptionen: FahrzeugOption[] = [
  {
    id: "f-status-quo",
    name: "Status Quo",
    kurz: "4× Privat-PKW",
    fahrzeuge: [{ typ: "PKW (privat, KM-Abrechnung)", anzahl: 4, kosten: 310 }],
    kapazitaetPax: 4,
    kapazitaetGut: "Keine Werkzeug-Transport-Kapazität — Extra-Spedition nötig",
    gesamtkosten: 1240,
    fahrzeit: "~5.5 h",
    co2Kg: 312,
    empfohlen: false,
    begruendung: "Kein Werkzeug-Transport, 4× Reisekosten",
  },
  {
    id: "f-optimiert",
    name: "Optimiert",
    kurz: "1× Sprinter + 1× Caddy",
    fahrzeuge: [
      { typ: "VW Crafter Sprinter (Fleet)", anzahl: 1, kosten: 380 },
      { typ: "VW Caddy (Fleet)", anzahl: 1, kosten: 180 },
    ],
    kapazitaetPax: 4,
    kapazitaetGut: "2t Werkzeug integriert — kein Extra-Transport nötig",
    gesamtkosten: 560,
    fahrzeit: "~5.5 h",
    co2Kg: 178,
    empfohlen: true,
    begruendung: "Werkzeug integriert, 55 % Kostenersparnis, 43 % weniger CO₂",
  },
  {
    id: "f-alternativ",
    name: "Alternative",
    kurz: "1× Transporter + ICE-Tickets",
    fahrzeuge: [
      { typ: "VW Crafter Sprinter (Fleet)", anzahl: 1, kosten: 380 },
      { typ: "ICE 2. Klasse (4× Pers.)", anzahl: 4, kosten: 128 },
    ],
    kapazitaetPax: 4,
    kapazitaetGut: "2t Werkzeug via Transporter, Monteure im Zug",
    gesamtkosten: 892,
    fahrzeit: "~7 h",
    co2Kg: 98,
    empfohlen: false,
    begruendung: "Niedrigstes CO₂, aber 30 min mehr Arbeitszeit/Fahrt",
  },
];

export const empfohleneFahrzeugOption = fahrzeugOptionen.find((o) => o.empfohlen)!;
export const ersparnisFahrzeug =
  fahrzeugOptionen[0].gesamtkosten - empfohleneFahrzeugOption.gesamtkosten;

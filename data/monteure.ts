export type Qualifikation =
  | "Kran-Schein"
  | "Schweißer-Zert"
  | "Hydraulik"
  | "Höhenzugang"
  | "Elektrofachkraft"
  | "Stapler";

export type Monteur = {
  id: string;
  name: string;
  kuerzel: string;
  heimatort: string;
  heimatKoordinaten: { lat: number; lng: number };
  heimNiederlassungId: string | null;
  qualifikationen: Qualifikation[];
  rolle?: string;
  verfuegbarAb: string;
  g25Gueltig: string;
  g41Gueltig?: string;
  erfahrungKunde?: string;
  stundensatz: number;
};

export const monteure: Monteur[] = [
  {
    id: "m1",
    name: "Michael Brandt",
    kuerzel: "MB",
    heimatort: "Renningen",
    rolle: "Richtmeister",
    heimatKoordinaten: { lat: 48.7681, lng: 8.9367 },
    heimNiederlassungId: "nl-leonberg",
    qualifikationen: ["Kran-Schein", "Hydraulik", "Stapler"],
    verfuegbarAb: "13.04.2026",
    g25Gueltig: "08/2026",
    g41Gueltig: "03/2027",
    erfahrungKunde: "3 frühere Einsätze bei KUKA",
    stundensatz: 62,
  },
  {
    id: "m2",
    name: "Thomas Weigl",
    kuerzel: "TW",
    heimatort: "Kassel",
    heimatKoordinaten: { lat: 51.3127, lng: 9.4797 },
    heimNiederlassungId: null,
    qualifikationen: ["Schweißer-Zert", "Hydraulik", "Elektrofachkraft"],
    verfuegbarAb: "13.04.2026",
    g25Gueltig: "11/2026",
    stundensatz: 68,
  },
  {
    id: "m3",
    name: "Jan Oskar Petersen",
    kuerzel: "JP",
    heimatort: "Achim (bei Bremen)",
    heimatKoordinaten: { lat: 53.1106, lng: 8.8919 },
    heimNiederlassungId: "nl-bremen",
    qualifikationen: ["Kran-Schein", "Höhenzugang", "Stapler"],
    verfuegbarAb: "13.04.2026",
    g25Gueltig: "05/2026",
    g41Gueltig: "09/2026",
    erfahrungKunde: "1 Einsatz bei KUKA",
    stundensatz: 58,
  },
  {
    id: "m4",
    name: "Ali Demir",
    kuerzel: "AD",
    heimatort: "Dietzenbach",
    heimatKoordinaten: { lat: 50.0061, lng: 8.7773 },
    heimNiederlassungId: "nl-dietzenbach",
    qualifikationen: ["Schweißer-Zert", "Elektrofachkraft"],
    verfuegbarAb: "20.04.2026",
    g25Gueltig: "01/2027",
    stundensatz: 60,
  },
  {
    id: "m5",
    name: "Kevin Schulz",
    kuerzel: "KS",
    heimatort: "Leipzig",
    heimatKoordinaten: { lat: 51.34, lng: 12.374 },
    heimNiederlassungId: "nl-chemnitz",
    qualifikationen: ["Hydraulik", "Stapler"],
    verfuegbarAb: "13.04.2026",
    g25Gueltig: "02/2026",
    stundensatz: 54,
  },
];

export const ausgewaehlteMonteure = [monteure[0], monteure[1], monteure[2]];

export const monteurAuswahlBegruendung = [
  "Vom PL zusammengestellt (Richtmeister Brandt + 2 Monteure) — Agent validiert 4 harte Checks",
  "Verfügbarkeit 13.–17.04.2026 gegen Disposition abgeglichen — alle frei",
  "G25-Untersuchung (Fahrtätigkeit) aktuell gültig — nächste Frist 08/2026",
  "Führerschein C1E bei Brandt/Petersen gültig — Sprinter mit 2t Geschirr fahrbar",
  "Arbeitszeit-Check (Betriebsordnung §7.1): Anreise + Arbeit unter 10 h/Tag",
];

export const monteurAlternativenGefiltert = [
  {
    name: "Ali Demir",
    grund: "Erst ab 20.04. verfügbar (anderes Projekt)",
  },
  {
    name: "Kevin Schulz",
    grund: "G25 läuft 02/2026 ab — vor Einsatz Nachuntersuchung nötig",
  },
];

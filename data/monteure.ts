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
  qualifikationen: Qualifikation[];
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
    heimatort: "Stuttgart",
    heimatKoordinaten: { lat: 48.775, lng: 9.182 },
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
    heimatort: "Frankfurt a. M.",
    heimatKoordinaten: { lat: 50.11, lng: 8.682 },
    qualifikationen: ["Schweißer-Zert", "Hydraulik", "Elektrofachkraft"],
    verfuegbarAb: "13.04.2026",
    g25Gueltig: "11/2026",
    stundensatz: 68,
  },
  {
    id: "m3",
    name: "Jan Oskar Petersen",
    kuerzel: "JP",
    heimatort: "Hamburg",
    heimatKoordinaten: { lat: 53.551, lng: 9.993 },
    qualifikationen: ["Kran-Schein", "Höhenzugang", "Stapler"],
    verfuegbarAb: "13.04.2026",
    g25Gueltig: "05/2026",
    g41Gueltig: "09/2026",
    erfahrungKunde: "1 Einsatz bei KUKA",
    stundensatz: 58,
  },
  // Alternativen / nicht ausgewählt — für Demo-Depth
  {
    id: "m4",
    name: "Ali Demir",
    kuerzel: "AD",
    heimatort: "Dietzenbach",
    heimatKoordinaten: { lat: 50.006, lng: 8.777 },
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
    qualifikationen: ["Hydraulik", "Stapler"],
    verfuegbarAb: "13.04.2026",
    g25Gueltig: "02/2026",
    stundensatz: 54,
  },
];

export const ausgewaehlteMonteure = [monteure[0], monteure[1], monteure[2]];

export const monteurAuswahlBegruendung = [
  "Qualifikations-Abdeckung: 2× Kran-Schein, 2× Hydraulik, 1× Schweißer",
  "Alle drei verfügbar 13.–17.04.2026",
  "Alle G25-Untersuchungen aktuell gültig",
  "Michael Brandt hat 3 frühere KUKA-Einsätze — Kunden-Kontext vorhanden",
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

export type Regel = {
  id: string;
  kategorie: "Hotel" | "Fahrzeug" | "Allgemein";
  regel: string;
  kurz: string;
};

export const betriebsordnung = {
  version: "v2.3",
  gueltigSeit: "01.01.2026",
  regeln: [
    {
      id: "H1",
      kategorie: "Hotel",
      regel: "Maximaler Übernachtungspreis 120 € inkl. Frühstück (Inland)",
      kurz: "≤ 120 €/Nacht",
    },
    {
      id: "H2",
      kategorie: "Hotel",
      regel: "Mindeststandard 3★ — bei Einsätzen > 5 Nächten 4★",
      kurz: "≥ 3★ (≥ 4★ ab 5 Nächten)",
    },
    {
      id: "H3",
      kategorie: "Hotel",
      regel: "Max. 15 km Entfernung zur Baustelle",
      kurz: "≤ 15 km zur Baustelle",
    },
    {
      id: "H4",
      kategorie: "Hotel",
      regel: "Buchung bevorzugt über Roomix-Portal (Sammelrechnung)",
      kurz: "Roomix bevorzugt",
    },
    {
      id: "F1",
      kategorie: "Fahrzeug",
      regel: "Bei Anfahrten > 150 km Prüfung auf Transporter-Poolung",
      kurz: "Flotten-Optimierung > 150 km",
    },
  ] as Regel[],
};

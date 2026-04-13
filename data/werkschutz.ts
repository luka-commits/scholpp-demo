export type VorOrtCheck = {
  label: string;
  detail: string;
  status: "erledigt" | "offen" | "info";
};

export const vorOrtChecks: VorOrtCheck[] = [
  {
    label: "Werkschutz-Voranmeldung",
    detail: "Entwurf erstellt, 3 Monteure + Fahrzeug-Kennzeichen · wartet auf Freigabe",
    status: "erledigt",
  },
  {
    label: "Ansprechpartner beim Kunden",
    detail: "Hr. Dr. Mertens (Werksleiter) · +49 511 4471-233 · mertens@kuka-werk.de",
    status: "info",
  },
  {
    label: "Parkplatz & Zufahrt",
    detail: "Tor 4 (Münchner Str.) · Stellplätze P-12/P-13 reserviert",
    status: "erledigt",
  },
  {
    label: "Kran-Stellplatz / Montage-Zone",
    detail: "Halle H-2, Bereich West · Strom 32A CEE vor Ort",
    status: "erledigt",
  },
  {
    label: "Sicherheitseinweisung vor Ort",
    detail: "Mo 13.04. 07:30 mit Werkschutz · Termin eingetragen",
    status: "erledigt",
  },
];

export type VorOrtCheck = {
  label: string;
  detail: string;
  status: "erledigt" | "offen" | "info";
};

export const vorOrtChecks: VorOrtCheck[] = [
  {
    label: "Werkschutz-Voranmeldung",
    detail: "Entwurf mit 3 Namen + 2 Kennzeichen generiert · PL schickt an Kunden-Kontakt",
    status: "erledigt",
  },
  {
    label: "Ansprechpartner beim Kunden",
    detail: "Hr. Dr. Mertens (Werksleiter) · aus letzter Einsatz-Korrespondenz extrahiert",
    status: "info",
  },
];

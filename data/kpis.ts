export const agentStatus = {
  aktivSeitTage: 14,
  anfragenBearbeitetGesamt: 187,
  anfragenDieseWoche: 23,
  durchschnittlicheZeitMinuten: 2.4,
  vorherZeitMinuten: 45,
  richtlinienkonformProzent: 100,
  ersparnisDieseWocheEur: 4340,
  ersparnisMonatEur: 17_820,
  ersparnisJahreHochgerechnet: 85_200,
};

export const impactZahlen = {
  zeitVorherMin: 45,
  zeitNachherMin: 2,
  zeitErsparnisProzent: 96,
  geldErsparnisProBuchungEur: 170,
  complianceProzent: 100,
  buchungenProJahr: 500,
  stundenGespartProJahr: 358,
  geldGespartProJahrEur: 140_000,
};

export const problemZahlen = [
  {
    zahl: "45 min",
    label: "Ø Aufwand pro Reisekoordination",
    quelle: "Interne Messung, Field-Service-Team",
  },
  {
    zahl: "~85.000 €",
    label: "Geschätzter jährlicher Verlust durch nicht-optimierte Flotten- und Hotelbuchungen",
    quelle: "Hochrechnung, 500 Buchungen/Jahr",
  },
  {
    zahl: "~18 %",
    label: "Buchungen außerhalb Roomix-Portal (fehlende Sammelrechnung)",
    quelle: "Stichprobe Q4 2025",
  },
];

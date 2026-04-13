export type SourceCardDef = {
  id: string;
  name: string;
  domain: string;
  typ: "intern" | "extern";
  snippets: string[];
  ergebnis: string; // shown when done
  delay: number; // ms bis scanning start
  dauer: number; // ms scanning duration
  inaktiv?: boolean; // "nicht benötigt für diesen Einsatz" → gegraut
  inaktivGrund?: string;
};

// Reihenfolge + Timing stimmen grob mit reasoning-steps überein, aber Cards laufen parallel
export const sourceCards: SourceCardDef[] = [
  {
    id: "personal-db",
    name: "Personal-DB / Quali-Matrix",
    domain: "personal.scholpp.intern",
    typ: "intern",
    snippets: [
      "Michael Brandt (Böblingen) — Kran + Hydraulik ✓",
      "Thomas Weigl (Sindelfingen) — Schweißer + Hydraulik ✓",
      "Jan Petersen (Leonberg) — Kran + Höhenzugang ✓",
    ],
    ergebnis: "3 qualifizierte Monteure, alle verfügbar",
    delay: 200,
    dauer: 2400,
  },
  {
    id: "equipment-kalender",
    name: "Equipment-Kalender",
    domain: "equipment.scholpp.intern",
    typ: "intern",
    snippets: [
      "Schwerlastgeschirr 2t — frei (Prüfplakette 09/2026)",
      "Hydraulik-Set Böblingen — Konflikt Projekt 0398",
      "Ersatz-Set Dietzenbach → OK",
    ],
    ergebnis: "4 Items disponiert, 1 Ersatz vorgeschlagen",
    delay: 500,
    dauer: 2600,
  },
  {
    id: "betriebsordnung",
    name: "Betriebsordnung v2.3",
    domain: "scholpp.intern/docs/betriebsordnung",
    typ: "intern",
    snippets: [
      "§ 4.2 Hotelbuchungen: max. 120 €/Nacht",
      "§ 4.3 Mindestens 3★, max. 15 km Baustellen-Distanz",
      "§ 7.1 Fahrzeug-Pooling bei Teams ≥ 3",
    ],
    ergebnis: "5 Regeln aktiv",
    delay: 300,
    dauer: 2200,
  },
  {
    id: "fleet",
    name: "SCHOLPP Fleet-DB",
    domain: "fleet.scholpp.intern",
    typ: "intern",
    snippets: [
      "Sprinter 319 — verfügbar ab 13.04. 06:00",
      "Caddy Maxi — verfügbar 13.–17.04.",
      "Aktueller Kraftstoff-Satz: 0,32 €/km",
    ],
    ergebnis: "3 Fahrzeuge verfügbar",
    delay: 600,
    dauer: 2400,
  },
  {
    id: "roomix",
    name: "Roomix Portal",
    domain: "roomix.scholpp.intern",
    typ: "intern",
    snippets: [
      "IntercityHotel Langenhagen — 115 €",
      "NH Hannover — 128 €",
      "Motel One Hannover — 99 €",
    ],
    ergebnis: "9 Hotels im Umkreis",
    delay: 1200,
    dauer: 3000,
  },
  {
    id: "booking",
    name: "booking.com",
    domain: "booking.com/hotels/de/hannover",
    typ: "extern",
    snippets: [
      "IntercityHotel — 112 € (−3 € vs. Roomix)",
      "Courtyard Maschsee — 135 €",
      "B&B Hannover-Nord — 89 €",
    ],
    ergebnis: "5 weitere Hotels, 3 mit Preisvorteil",
    delay: 1800,
    dauer: 2800,
  },
  {
    id: "hrs",
    name: "hrs.de",
    domain: "hrs.de/hannover-langenhagen",
    typ: "extern",
    snippets: [
      "IntercityHotel Langenhagen — 114 €",
      "H+ Hannover — 119 €",
      "Wyndham Atrium — 142 €",
    ],
    ergebnis: "Bestpreis-Check: 3 Matches",
    delay: 2400,
    dauer: 2600,
  },
  {
    id: "trivago",
    name: "trivago",
    domain: "trivago.de/hannover",
    typ: "extern",
    snippets: [
      "IntercityHotel — 113 € (Meta-Vergleich 14 Portale)",
      "Courtyard Maschsee — 132 €",
      "H4 Hannover Messe — 108 €",
    ],
    ergebnis: "Meta-Preisvergleich: 3 Matches",
    delay: 2800,
    dauer: 2400,
  },
  {
    id: "hrs-corp",
    name: "HRS Corporate",
    domain: "hrs.de/corporate/scholpp",
    typ: "extern",
    snippets: [
      "Firmenraten-Zugriff: aktiv",
      "IntercityHotel — 108 € (Corporate)",
      "Sammelrechnung: ja",
    ],
    ergebnis: "2 Corporate-Raten unter Portal-Preis",
    delay: 3000,
    dauer: 2200,
  },
  {
    id: "adac",
    name: "ADAC Kostenrechner",
    domain: "adac.de/autokosten",
    typ: "extern",
    snippets: [
      "Sprinter 319 — 0,68 €/km Vollkosten",
      "VW Caddy Maxi — 0,42 €/km",
      "4× PKW-Pool — Alternative: +340 €",
    ],
    ergebnis: "Optimum: Sprinter + Caddy (−680 €)",
    delay: 3200,
    dauer: 2400,
  },
  {
    id: "tarif",
    name: "Tarifvertrag Sächs. Verkehrsgewerbe",
    domain: "bgl-ev.de/tarife/sachsen",
    typ: "extern",
    snippets: [
      "Auslösen 28 €/Tag · Übernachtung 20 €/Nacht",
      "Max. 10 h Fahrt+Arbeit kombiniert",
      "Wegezeit > 1 h zählt anteilig als Arbeitszeit",
    ],
    ergebnis: "Tarif-konform kalkuliert",
    delay: 3800,
    dauer: 2200,
  },
  {
    id: "a1",
    name: "A1-Bescheinigung / DRV",
    domain: "deutsche-rentenversicherung.de",
    typ: "extern",
    snippets: [],
    ergebnis: "Nicht benötigt — Inlands-Einsatz",
    delay: 0,
    dauer: 0,
    inaktiv: true,
    inaktivGrund: "Nur bei EU-Auslands-Einsätzen aktiv",
  },
];

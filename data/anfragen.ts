export type Anfrage = {
  id: string;
  projektleiter: string;
  projektleiterKuerzel: string;
  projekt: string;
  ort: string;
  baustelleAdresse: string;
  baustelleKoordinaten: { lat: number; lng: number };
  zeitraum: { von: string; bis: string; naechte: number };
  teamGroesse: number;
  equipment: string[];
  sonderwuensche?: string;
  eingegangenAm: string;
  status: "neu" | "in-bearbeitung" | "abgeschlossen";
  prioritaet: "hoch" | "normal";
};

export const anfragen: Anfrage[] = [
  {
    id: "REQ-2026-0412",
    projektleiter: "Thomas Koch",
    projektleiterKuerzel: "TK",
    projekt: "Werksumzug Presse H-2 — KUKA-Anlage",
    ort: "Hannover-Langenhagen",
    baustelleAdresse: "Münchner Str. 45, 30855 Langenhagen",
    baustelleKoordinaten: { lat: 52.4478, lng: 9.7219 },
    zeitraum: { von: "13.04.2026", bis: "17.04.2026", naechte: 4 },
    teamGroesse: 4,
    equipment: ["Schwerlastgeschirr 2t", "Hydraulikwerkzeug-Set", "Laser-Nivelliergerät"],
    sonderwuensche: "Werkzeug muss sicher transportiert werden — Monteure bevorzugt gemeinsame Unterkunft.",
    eingegangenAm: "Heute, 08:42",
    status: "neu",
    prioritaet: "hoch",
  },
  {
    id: "REQ-2026-0411",
    projektleiter: "Martina Lehmann",
    projektleiterKuerzel: "ML",
    projekt: "Wartung Fördertechnik — Werk Leipzig",
    ort: "Leipzig-Plagwitz",
    baustelleAdresse: "Plagwitzer Str. 120, 04229 Leipzig",
    baustelleKoordinaten: { lat: 51.327, lng: 12.336 },
    zeitraum: { von: "21.04.2026", bis: "23.04.2026", naechte: 2 },
    teamGroesse: 2,
    equipment: ["Standard-Werkzeug"],
    eingegangenAm: "Gestern, 16:21",
    status: "neu",
    prioritaet: "normal",
  },
  {
    id: "REQ-2026-0410",
    projektleiter: "Ahmet Yildiz",
    projektleiterKuerzel: "AY",
    projekt: "Aufbau CNC-Zentrum — Standort Stuttgart",
    ort: "Stuttgart-Vaihingen",
    baustelleAdresse: "Nobelstr. 12, 70569 Stuttgart",
    baustelleKoordinaten: { lat: 48.743, lng: 9.101 },
    zeitraum: { von: "28.04.2026", bis: "06.05.2026", naechte: 8 },
    teamGroesse: 6,
    equipment: ["Kran-Ausrüstung", "Laser-Messsystem", "Präzisionswerkzeug"],
    eingegangenAm: "Gestern, 11:03",
    status: "neu",
    prioritaet: "normal",
  },
];

export const aktiveAnfrage = anfragen[0];

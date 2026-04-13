export type EquipmentItem = {
  id: string;
  name: string;
  typ: "geschirr" | "werkzeug" | "messtechnik" | "kran";
  gewichtKg: number;
  pruefplaketteGueltig: string;
  status: "verfuegbar" | "konflikt" | "ersatz";
  konfliktDetail?: string;
  ersatzVorschlag?: string;
  standort: string;
};

export const equipmentInventory: EquipmentItem[] = [
  {
    id: "e1",
    name: "Schwerlastgeschirr 2t",
    typ: "geschirr",
    gewichtKg: 180,
    pruefplaketteGueltig: "09/2026",
    status: "verfuegbar",
    standort: "Depot Böblingen",
  },
  {
    id: "e2",
    name: "Hydraulikwerkzeug-Set (Enerpac)",
    typ: "werkzeug",
    gewichtKg: 95,
    pruefplaketteGueltig: "06/2026",
    status: "konflikt",
    konfliktDetail: "Auf Projekt REQ-2026-0398 (München) bis 15.04.",
    ersatzVorschlag: "Ersatz-Set aus Depot Dietzenbach — gleiche Spezifikation, verfügbar",
    standort: "Depot Dietzenbach",
  },
  {
    id: "e3",
    name: "Laser-Nivelliergerät (Leica LS15)",
    typ: "messtechnik",
    gewichtKg: 8,
    pruefplaketteGueltig: "11/2026",
    status: "verfuegbar",
    standort: "Depot Böblingen",
  },
  {
    id: "e4",
    name: "Anschlagmittel-Set (Ketten, Schäkel)",
    typ: "geschirr",
    gewichtKg: 45,
    pruefplaketteGueltig: "04/2027",
    status: "verfuegbar",
    standort: "Depot Böblingen",
  },
];

export const equipmentSummary = {
  gesamtGewichtKg: equipmentInventory.reduce((s, e) => s + e.gewichtKg, 0),
  transportEmpfehlung: "Sprinter 319 (bis 3.5 t Zuladung) ausreichend",
  pickupDepot: "Depot Böblingen (am 13.04. 06:00 ab)",
};

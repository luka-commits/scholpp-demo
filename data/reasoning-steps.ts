export type Quelle =
  | "betriebsordnung"
  | "google-maps"
  | "booking"
  | "hrs"
  | "roomix"
  | "fleet"
  | "adac"
  | "internal";

export type ReasoningStep = {
  id: string;
  label: string;
  detail?: string;
  quelle?: Quelle;
  dauer: number; // ms die der Step sichtbar "arbeitet"
  status?: "info" | "warn" | "success";
};

// Reasoning-Sequenz für Hannover-Szenario (~7 sec total)
export const reasoningSteps: ReasoningStep[] = [
  {
    id: "s1",
    label: "Betriebsordnung v2.3 geladen",
    detail: "5 aktive Regeln: 3 Hotel, 1 Fahrzeug, 1 Allgemein",
    quelle: "betriebsordnung",
    dauer: 600,
  },
  {
    id: "s2",
    label: "Baustelle geolokalisiert",
    detail: "Münchner Str. 45, 30855 Langenhagen (52.45°N, 9.72°O)",
    quelle: "google-maps",
    dauer: 700,
  },
  {
    id: "s3",
    label: "Hotelsuche Roomix (SCHOLPP-Portal)",
    detail: "9 Hotels im Umkreis 15 km verfügbar",
    quelle: "roomix",
    dauer: 900,
  },
  {
    id: "s4",
    label: "Hotelsuche booking.com + hrs.de",
    detail: "5 weitere Hotels, 3 mit Preisvorteil",
    quelle: "booking",
    dauer: 800,
  },
  {
    id: "s5",
    label: "Betriebsordnung angewandt",
    detail: "14 → 4 Hotels (Preis ≤ 120 €, 3★+, ≤ 15 km, Verfügbarkeit ≥ 4)",
    quelle: "betriebsordnung",
    dauer: 750,
  },
  {
    id: "s6",
    label: "Fahrzeug-Optionen berechnet",
    detail: "3 Szenarien: 4× PKW, 1× Sprinter + Caddy, Transporter + ICE",
    quelle: "fleet",
    dauer: 900,
  },
  {
    id: "s7",
    label: "Kosten & CO₂ verglichen",
    detail: "Optimum: Sprinter + Caddy — 680 € Ersparnis, 134 kg CO₂ weniger",
    quelle: "adac",
    dauer: 700,
  },
  {
    id: "s8",
    label: "Scoring & Ranking",
    detail: "Top-Empfehlung: IntercityHotel Hannover-Langenhagen (Score 9.4)",
    quelle: "internal",
    dauer: 600,
    status: "success",
  },
  {
    id: "s9",
    label: "Vorschlag erstellt",
    detail: "Audit-Log mit 8 Schritten, 6 Quellen dokumentiert",
    quelle: "internal",
    dauer: 500,
    status: "success",
  },
];

export const quellenMeta: Record<Quelle, { label: string; farbe: string }> = {
  betriebsordnung: { label: "Betriebsordnung", farbe: "#7c3aed" },
  "google-maps": { label: "Google Maps", farbe: "#059669" },
  booking: { label: "booking.com", farbe: "#1d4ed8" },
  hrs: { label: "hrs.de", farbe: "#ea580c" },
  roomix: { label: "Roomix", farbe: "#e00028" },
  fleet: { label: "SCHOLPP Fleet", farbe: "#111111" },
  adac: { label: "ADAC Kosten", farbe: "#a16207" },
  internal: { label: "Agent", farbe: "#646464" },
};

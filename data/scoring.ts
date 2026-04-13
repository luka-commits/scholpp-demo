import { topHotels } from "./hotels";

export type ScoringKriterium = {
  key: "preis" | "distanz" | "verfuegbarkeit" | "komfort";
  label: string;
  gewicht: number; // 0-1
};

export const scoringKriterien: ScoringKriterium[] = [
  { key: "preis", label: "Preis", gewicht: 0.3 },
  { key: "distanz", label: "Distanz zur Baustelle", gewicht: 0.3 },
  { key: "verfuegbarkeit", label: "Verfügbarkeit", gewicht: 0.2 },
  { key: "komfort", label: "Komfort & Bewertung", gewicht: 0.2 },
];

export type HotelScore = {
  hotelId: string;
  breakdown: { preis: number; distanz: number; verfuegbarkeit: number; komfort: number };
  gesamt: number; // 0-10
};

function normalize(value: number, min: number, max: number, invert = false) {
  const n = (value - min) / (max - min);
  return invert ? 1 - n : n;
}

export function scoreHotel(h: (typeof topHotels)[number]): HotelScore {
  const preisScore = 10 * normalize(h.preisProNacht, 60, 120, true);
  const distanzScore = 10 * normalize(h.entfernungKm, 0, 15, true);
  const verfuegbarkeitScore = h.verfuegbareZimmer >= 4 ? 10 : 6;
  const komfortScore = h.bewertungSchnitt;

  const gesamt =
    preisScore * 0.3 +
    distanzScore * 0.3 +
    verfuegbarkeitScore * 0.2 +
    komfortScore * 0.2;

  return {
    hotelId: h.id,
    breakdown: {
      preis: +preisScore.toFixed(1),
      distanz: +distanzScore.toFixed(1),
      verfuegbarkeit: verfuegbarkeitScore,
      komfort: +komfortScore.toFixed(1),
    },
    gesamt: +gesamt.toFixed(1),
  };
}

// Pre-rank top hotels by score (descending)
export const rankedHotels = topHotels
  .map((h) => ({ hotel: h, score: scoreHotel(h) }))
  .sort((a, b) => b.score.gesamt - a.score.gesamt)
  .slice(0, 4);

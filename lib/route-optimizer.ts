import type { Niederlassung } from "@/data/niederlassungen";
import type { Monteur } from "@/data/monteure";
import type { Anfrage } from "@/data/anfragen";

export type AnreiseStrategie =
  | "sprinter_fahrer"
  | "direkt"
  | "pickup_on_route"
  | "zum_hub_mitfahren"
  | "bahn_direkt";

export type FahrzeitMin = number;

export type SprinterDispatchInput = {
  anfrage: Anfrage;
  niederlassungen: Niederlassung[];
  fahrzeitNlZurBaustelleMin: Record<string, FahrzeitMin>;
};

export type SprinterDispatchResult = {
  startNl: Niederlassung;
  fahrzeitMin: FahrzeitMin;
  begruendung: string;
  kandidaten: Array<{ nl: Niederlassung; fahrzeitMin: FahrzeitMin }>;
};

export function selectSprinterStartNl(
  input: SprinterDispatchInput,
): SprinterDispatchResult {
  const { anfrage, niederlassungen, fahrzeitNlZurBaustelleMin } = input;

  // 1. Werkzeug-Filter: bei "schwerlast" nur Großniederlassungen
  const werkzeugOk = (n: Niederlassung) =>
    anfrage.werkzeugAnforderung === "schwerlast"
      ? n.fleet.schwerlastWerkzeug
      : true;

  const eligibles = niederlassungen.filter(
    (n) => n.fleet.sprinter && werkzeugOk(n),
  );

  if (eligibles.length === 0) {
    throw new Error(
      `Keine Niederlassung erfüllt Werkzeug-Anforderung "${anfrage.werkzeugAnforderung}"`,
    );
  }

  // 2. argmin Fahrzeit
  const ranked = eligibles
    .map((nl) => ({
      nl,
      fahrzeitMin: fahrzeitNlZurBaustelleMin[nl.id] ?? Number.POSITIVE_INFINITY,
    }))
    .sort((a, b) => a.fahrzeitMin - b.fahrzeitMin);

  const winner = ranked[0];

  return {
    startNl: winner.nl,
    fahrzeitMin: winner.fahrzeitMin,
    begruendung:
      anfrage.werkzeugAnforderung === "schwerlast"
        ? `Kürzeste Fahrzeit zur Baustelle (${Math.round(winner.fahrzeitMin)} min) unter NL mit Schwerlast-Werkzeug`
        : `Kürzeste Fahrzeit zur Baustelle (${Math.round(winner.fahrzeitMin)} min)`,
    kandidaten: ranked,
  };
}

export type AnreiseInput = {
  monteur: Monteur;
  startNl: Niederlassung;
  istRichtmeisterFuerDispatch: boolean;
  tDirektMin: FahrzeitMin;
  tHubMin: FahrzeitMin;
  tSprinterDirektMin: FahrzeitMin;
  tSprinterMitPickupMin: FahrzeitMin;
};

export type AnreiseEntscheidung = {
  monteurId: string;
  strategie: AnreiseStrategie;
  fahrzeitMin: FahrzeitMin;
  begruendung: string;
  metriken: {
    tDirektMin: FahrzeitMin;
    tHubMin: FahrzeitMin;
    tSprinterDirektMin: FahrzeitMin;
    korridorUmwegMin: FahrzeitMin;
  };
};

const DIREKT_GRENZE_MIN = 90;
const KORRIDOR_GRENZE_MIN = 30;
const HUB_GRENZE_MIN = 60;

export function decideAnreise(input: AnreiseInput): AnreiseEntscheidung {
  const {
    monteur,
    tDirektMin,
    tHubMin,
    tSprinterDirektMin,
    tSprinterMitPickupMin,
    istRichtmeisterFuerDispatch,
  } = input;

  const korridorUmwegMin = Math.max(
    0,
    tSprinterMitPickupMin - tSprinterDirektMin,
  );

  const metriken = {
    tDirektMin,
    tHubMin,
    tSprinterDirektMin,
    korridorUmwegMin,
  };

  if (istRichtmeisterFuerDispatch) {
    return {
      monteurId: monteur.id,
      strategie: "sprinter_fahrer",
      fahrzeitMin: tSprinterDirektMin,
      begruendung: `Richtmeister & ${monteur.heimatort} liegt nahe Sprinter-Start-NL — fährt Sprinter`,
      metriken,
    };
  }

  if (tDirektMin < DIREKT_GRENZE_MIN) {
    return {
      monteurId: monteur.id,
      strategie: "direkt",
      fahrzeitMin: tDirektMin,
      begruendung: `Heimat → Baustelle nur ${Math.round(tDirektMin)} min — direkte Anreise sinnvoll`,
      metriken,
    };
  }

  if (
    korridorUmwegMin <= KORRIDOR_GRENZE_MIN &&
    tSprinterMitPickupMin < tDirektMin
  ) {
    return {
      monteurId: monteur.id,
      strategie: "pickup_on_route",
      fahrzeitMin: tSprinterMitPickupMin,
      begruendung: `Sprinter-Umweg über Heimat nur +${Math.round(korridorUmwegMin)} min — Pickup auf Route`,
      metriken,
    };
  }

  if (tHubMin <= HUB_GRENZE_MIN) {
    return {
      monteurId: monteur.id,
      strategie: "zum_hub_mitfahren",
      fahrzeitMin: tHubMin + tSprinterDirektMin,
      begruendung: `Heimat → Sprinter-Start-NL ${Math.round(tHubMin)} min — fährt zum Hub und steigt zu`,
      metriken,
    };
  }

  return {
    monteurId: monteur.id,
    strategie: "bahn_direkt",
    fahrzeitMin: tDirektMin,
    begruendung: `Heimat zu weit von Hub (${Math.round(tHubMin)} min) und Korridor (Umweg ${Math.round(korridorUmwegMin)} min) — Bahn-Direktanreise`,
    metriken,
  };
}

export const ANREISE_LABEL: Record<AnreiseStrategie, string> = {
  sprinter_fahrer: "Sprinter-Fahrer",
  direkt: "Direkte Anreise",
  pickup_on_route: "Pickup auf Route",
  zum_hub_mitfahren: "Zum Hub mitfahren",
  bahn_direkt: "Bahn direkt",
};

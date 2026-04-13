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

const DIREKT_GRENZE_MIN = 90;
const KORRIDOR_GRENZE_MIN = 30;
const HUB_GRENZE_MIN = 60;

export type SprinterDispatchInput = {
  anfrage: Anfrage;
  niederlassungen: Niederlassung[];
  monteure: Monteur[];
  fahrzeitNlZurBaustelleMin: Record<string, FahrzeitMin>;
  /** Heimat Monteur → Baustelle (direkt, DRIVE) */
  fahrzeitMonteurZurBaustelleMin: Record<string, FahrzeitMin>;
  /** Heimat Monteur → NL (DRIVE) — matrix[monteurId][nlId] */
  fahrzeitMonteurZurNlMin: Record<string, Record<string, FahrzeitMin>>;
};

export type MonteurZugangBreakdown = {
  monteurId: string;
  /** gewählte Kosten (min von direkt / zum-hub / sprinter-fahrer) */
  kostenMin: FahrzeitMin;
  pfad: "direkt" | "zum_hub" | "sprinter_fahrer";
};

export type NlKandidat = {
  nl: Niederlassung;
  /** Sprinter-Fahrzeit NL → Baustelle */
  tSprinterMin: FahrzeitMin;
  /** Summe Monteur-Zugangskosten an diese NL */
  summeMonteurZugangMin: FahrzeitMin;
  /** Total Cost = tSprinterMin + Σ monteur-zugang */
  totalCostMin: FahrzeitMin;
  monteurBreakdown: MonteurZugangBreakdown[];
};

export type SprinterDispatchResult = {
  startNl: Niederlassung;
  fahrzeitMin: FahrzeitMin;
  begruendung: string;
  kandidaten: NlKandidat[];
};

export function selectSprinterStartNl(
  input: SprinterDispatchInput,
): SprinterDispatchResult {
  const {
    anfrage,
    niederlassungen,
    monteure,
    fahrzeitNlZurBaustelleMin,
    fahrzeitMonteurZurBaustelleMin,
    fahrzeitMonteurZurNlMin,
  } = input;

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

  // 2. Pro Kandidat-NL: Total-Cost berechnen
  const kandidaten: NlKandidat[] = eligibles.map((nl) => {
    const tSprinterMin =
      fahrzeitNlZurBaustelleMin[nl.id] ?? Number.POSITIVE_INFINITY;

    const breakdown: MonteurZugangBreakdown[] = monteure.map((m) => {
      const direktRaw =
        fahrzeitMonteurZurBaustelleMin[m.id] ?? Number.POSITIVE_INFINITY;
      // "direkt" nur als Option wenn ≤ 90 min (Arbeitszeit-Cap, Anreise-Regel).
      // Darüber muss Monteur via Hub/Sprinter/Bahn → sonst konkurriert direkt
      // illusorisch an jeder NL und macht tSprinter-Vergleich toothless.
      const direkt = direktRaw <= DIREKT_GRENZE_MIN ? direktRaw : Number.POSITIVE_INFINITY;
      const zumHub =
        (fahrzeitMonteurZurNlMin[m.id]?.[nl.id] ?? Number.POSITIVE_INFINITY) +
        tSprinterMin;
      // sprinter_fahrer: Monteur wohnt "an" der NL (heimNiederlassungId match)
      // → nur tSprinterMin als Kosten (kein Anfahrtsweg zum Hub)
      const istLokal = m.heimNiederlassungId === nl.id;
      const sprinterFahrer = istLokal ? tSprinterMin : Number.POSITIVE_INFINITY;

      const options: Array<[number, MonteurZugangBreakdown["pfad"]]> = [
        [direkt, "direkt"],
        [zumHub, "zum_hub"],
        [sprinterFahrer, "sprinter_fahrer"],
      ];
      options.sort((a, b) => a[0] - b[0]);
      const [kostenMin, pfad] = options[0];
      // Fallback wenn alle Optionen INF (kein realistischer Zugang): raw-direkt als Bahn-Proxy
      const finalKosten = isFinite(kostenMin) ? kostenMin : direktRaw;
      return { monteurId: m.id, kostenMin: finalKosten, pfad };
    });

    const summeMonteurZugangMin = breakdown.reduce(
      (s, b) => s + (isFinite(b.kostenMin) ? b.kostenMin : 0),
      0,
    );
    const totalCostMin = tSprinterMin + summeMonteurZugangMin;

    return {
      nl,
      tSprinterMin,
      summeMonteurZugangMin,
      totalCostMin,
      monteurBreakdown: breakdown,
    };
  });

  kandidaten.sort((a, b) => a.totalCostMin - b.totalCostMin);
  const winner = kandidaten[0];
  const runnerUp = kandidaten[1];

  const delta = runnerUp
    ? Math.round(runnerUp.totalCostMin - winner.totalCostMin)
    : null;

  const werkzeugNote =
    anfrage.werkzeugAnforderung === "schwerlast"
      ? " unter NL mit Schwerlast-Werkzeug"
      : "";

  const begruendung = runnerUp
    ? `Niedrigste Total-Cost (${Math.round(winner.totalCostMin)} min = ${Math.round(winner.tSprinterMin)} Sprinter + ${Math.round(winner.summeMonteurZugangMin)} Monteur-Zugang)${werkzeugNote}. ${delta} min günstiger als ${runnerUp.nl.stadt}.`
    : `Niedrigste Total-Cost (${Math.round(winner.totalCostMin)} min)${werkzeugNote}.`;

  return {
    startNl: winner.nl,
    fahrzeitMin: winner.tSprinterMin,
    begruendung,
    kandidaten,
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

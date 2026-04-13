import { NextRequest, NextResponse } from "next/server";
import { aktiveAnfrage, anfragen, type Anfrage } from "@/data/anfragen";
import { ausgewaehlteMonteure, monteure, type Monteur } from "@/data/monteure";
import { niederlassungen, getNiederlassung } from "@/data/niederlassungen";
import { computeRoute, computeRouteMatrix, type LatLng } from "@/lib/google-routes";
import {
  decideAnreise,
  selectSprinterStartNl,
  type AnreiseEntscheidung,
} from "@/lib/route-optimizer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = {
  anfrageId?: string;
  monteurIds?: string[];
};

type PolylineOut = {
  kind: "sprinter" | "direkt" | "bahn";
  monteurIds: string[];
  encodedPolyline: string;
  durationSec: number;
  distanceMeters: number;
};

type KandidatOut = {
  id: string;
  name: string;
  stadt: string;
  fahrzeitMin: number; // Alias auf tSprinterMin (Backwards-Compat)
  tSprinterMin: number;
  summeMonteurZugangMin: number;
  totalCostMin: number;
  gewaehlt: boolean;
  breakdown: Array<{
    monteurId: string;
    kostenMin: number;
    pfad: "direkt" | "zum_hub" | "sprinter_fahrer";
  }>;
};

type ResponseShape = {
  startNl: {
    id: string;
    name: string;
    stadt: string;
    koordinaten: LatLng;
    fahrzeitMin: number;
    begruendung: string;
  };
  kandidaten: KandidatOut[];
  strategien: AnreiseEntscheidung[];
  polylines: PolylineOut[];
  eckdaten: {
    anfrageId: string;
    baustelle: LatLng;
    werkzeugAnforderung: Anfrage["werkzeugAnforderung"];
  };
  generatedAt: string;
};

// Simple in-memory cache (per dev-server lifetime), keyed by request hash.
const cache = new Map<string, ResponseShape>();

function hashKey(anfrageId: string, monteurIds: string[]): string {
  return `${anfrageId}|${[...monteurIds].sort().join(",")}`;
}

export async function POST(req: NextRequest) {
  let body: RequestBody = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const anfrage =
    anfragen.find((a) => a.id === body.anfrageId) ?? aktiveAnfrage;
  const monteureSel: Monteur[] = body.monteurIds?.length
    ? monteure.filter((m) => body.monteurIds!.includes(m.id))
    : ausgewaehlteMonteure;

  const cacheKey = hashKey(
    anfrage.id,
    monteureSel.map((m) => m.id),
  );
  const cached = cache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "x-cache": "hit" },
    });
  }

  if (!process.env.GOOGLE_ROUTES_API_KEY) {
    return NextResponse.json(
      {
        error: "GOOGLE_ROUTES_API_KEY not configured on server.",
        hint: "Set env var and reload. See PLAN-route-optimization.md §7.",
      },
      { status: 500 },
    );
  }

  const baustelle = anfrage.baustelleKoordinaten;

  try {
    // === A) NL → Baustelle Matrix
    const nlMatrix = await computeRouteMatrix(
      niederlassungen.map((n) => n.koordinaten),
      [baustelle],
    );
    const fahrzeitNlZurBaustelleMin: Record<string, number> = {};
    nlMatrix.forEach((row) => {
      const nl = niederlassungen[row.originIndex];
      fahrzeitNlZurBaustelleMin[nl.id] = row.durationSec / 60;
    });

    // === A2) Monteure × {Baustelle, alle NL} — Matrix für Total-Cost-Heuristik
    const monteurOrigins = monteureSel.map((m) => m.heimatKoordinaten);
    const candidateNls = niederlassungen; // wir filtern später im Optimizer
    const bigDests: LatLng[] = [
      baustelle,
      ...candidateNls.map((n) => n.koordinaten),
    ];
    const bigMatrix = await computeRouteMatrix(monteurOrigins, bigDests);

    const fahrzeitMonteurZurBaustelleMin: Record<string, number> = {};
    const fahrzeitMonteurZurNlMin: Record<
      string,
      Record<string, number>
    > = {};
    monteureSel.forEach((m) => {
      fahrzeitMonteurZurNlMin[m.id] = {};
    });
    bigMatrix.forEach((row) => {
      const m = monteureSel[row.originIndex];
      const minutes = row.durationSec / 60;
      if (row.destinationIndex === 0) {
        fahrzeitMonteurZurBaustelleMin[m.id] = minutes;
      } else {
        const nl = candidateNls[row.destinationIndex - 1];
        fahrzeitMonteurZurNlMin[m.id][nl.id] = minutes;
      }
    });

    // === B) Regel: Sprinter-Start-NL (Total-Cost-Heuristik)
    const dispatch = selectSprinterStartNl({
      anfrage,
      niederlassungen,
      monteure: monteureSel,
      fahrzeitNlZurBaustelleMin,
      fahrzeitMonteurZurBaustelleMin,
      fahrzeitMonteurZurNlMin,
    });

    // === C) Abgeleitete Maps für decideAnreise (Start-NL-spezifisch)
    const tDirektMap: Record<string, number> = {
      ...fahrzeitMonteurZurBaustelleMin,
    };
    const tHubMap: Record<string, number> = {};
    monteureSel.forEach((m) => {
      tHubMap[m.id] =
        fahrzeitMonteurZurNlMin[m.id]?.[dispatch.startNl.id] ??
        Number.POSITIVE_INFINITY;
    });

    // === D) Sprinter direct route (Start-NL → Baustelle) for baseline + polyline
    const sprinterDirect = await computeRoute(
      dispatch.startNl.koordinaten,
      baustelle,
      [],
    );
    const tSprinterDirektMin = sprinterDirect.durationSec / 60;

    // === E) Per-Monteur: pickup-on-route variant
    // We pre-determine candidate "richtmeister fahrer": Monteur whose
    // heimNiederlassungId matches dispatch.startNl AND has Richtmeister role.
    const richtmeisterCandidate = monteureSel.find(
      (m) =>
        m.rolle === "Richtmeister" &&
        m.heimNiederlassungId === dispatch.startNl.id,
    );
    // Fallback: any Richtmeister
    const fahrer =
      richtmeisterCandidate ?? monteureSel.find((m) => m.rolle === "Richtmeister");

    const strategien: AnreiseEntscheidung[] = [];

    for (const m of monteureSel) {
      const tDirektMin = tDirektMap[m.id] ?? Number.POSITIVE_INFINITY;
      const tHubMin = tHubMap[m.id] ?? Number.POSITIVE_INFINITY;

      // Compute pickup-variant only if heimat lies somewhat "between" hub and baustelle
      // Cheap proxy: compute and let the rule decide via korridorUmweg.
      let tSprinterMitPickupMin = Number.POSITIVE_INFINITY;
      try {
        const pickupRoute = await computeRoute(
          dispatch.startNl.koordinaten,
          baustelle,
          [m.heimatKoordinaten],
        );
        tSprinterMitPickupMin = pickupRoute.durationSec / 60;

        // Pickup-Route nur für Regel-Bewertung — nicht weiter stashen
        void pickupRoute;
      } catch {
        // ignore — rule will fall through to bahn/hub
      }

      const decision = decideAnreise({
        monteur: m,
        startNl: dispatch.startNl,
        istRichtmeisterFuerDispatch: fahrer?.id === m.id,
        tDirektMin,
        tHubMin,
        tSprinterDirektMin,
        tSprinterMitPickupMin,
      });
      strategien.push(decision);
    }

    // === Final polylines for the map
    const polylines: PolylineOut[] = [];

    // Determine pickups in sprinter route
    const pickupMonteure = strategien.filter(
      (s) => s.strategie === "pickup_on_route",
    );

    if (pickupMonteure.length > 0) {
      // Recompute ONE sprinter route with all pickup waypoints (in sane order: nearest to NL first — naive: by tHub)
      const sortedPickups = pickupMonteure
        .map((s) => monteureSel.find((m) => m.id === s.monteurId)!)
        .sort((a, b) => (tHubMap[a.id] ?? 0) - (tHubMap[b.id] ?? 0));

      try {
        const sprinterCombined = await computeRoute(
          dispatch.startNl.koordinaten,
          baustelle,
          sortedPickups.map((m) => m.heimatKoordinaten),
        );
        polylines.push({
          kind: "sprinter",
          monteurIds: [
            fahrer?.id ?? "sprinter",
            ...sortedPickups.map((m) => m.id),
          ],
          encodedPolyline: sprinterCombined.encodedPolyline,
          durationSec: sprinterCombined.durationSec,
          distanceMeters: sprinterCombined.distanceMeters,
        });
      } catch {
        polylines.push({
          kind: "sprinter",
          monteurIds: [fahrer?.id ?? "sprinter"],
          encodedPolyline: sprinterDirect.encodedPolyline,
          durationSec: sprinterDirect.durationSec,
          distanceMeters: sprinterDirect.distanceMeters,
        });
      }
    } else {
      polylines.push({
        kind: "sprinter",
        monteurIds: [fahrer?.id ?? "sprinter"],
        encodedPolyline: sprinterDirect.encodedPolyline,
        durationSec: sprinterDirect.durationSec,
        distanceMeters: sprinterDirect.distanceMeters,
      });
    }

    // Direkt-Routen (eigene Anreise per PKW) — eine Linie pro Monteur
    for (const s of strategien) {
      if (s.strategie === "direkt") {
        const m = monteureSel.find((mm) => mm.id === s.monteurId)!;
        try {
          const r = await computeRoute(m.heimatKoordinaten, baustelle, []);
          polylines.push({
            kind: "direkt",
            monteurIds: [m.id],
            encodedPolyline: r.encodedPolyline,
            durationSec: r.durationSec,
            distanceMeters: r.distanceMeters,
          });
        } catch (e) {
          console.error(
            `[optimize-route] direkt-Polyline fehlgeschlagen für ${m.id}:`,
            e,
          );
          // Fallback: leere Polyline (Client rendert Luftlinie)
          polylines.push({
            kind: "direkt",
            monteurIds: [m.id],
            encodedPolyline: "",
            durationSec: Math.round((s.fahrzeitMin ?? 0) * 60),
            distanceMeters: 0,
          });
        }
      }
      if (s.strategie === "bahn_direkt") {
        const m = monteureSel.find((mm) => mm.id === s.monteurId)!;
        // No TRANSIT polyline — just emit a "bahn" entry without polyline so client renders straight line
        polylines.push({
          kind: "bahn",
          monteurIds: [m.id],
          encodedPolyline: "",
          durationSec: Math.round((s.fahrzeitMin ?? 0) * 60),
          distanceMeters: 0,
        });
      }
      if (s.strategie === "zum_hub_mitfahren") {
        const m = monteureSel.find((mm) => mm.id === s.monteurId)!;
        try {
          const r = await computeRoute(
            m.heimatKoordinaten,
            dispatch.startNl.koordinaten,
            [],
          );
          polylines.push({
            kind: "direkt",
            monteurIds: [m.id],
            encodedPolyline: r.encodedPolyline,
            durationSec: r.durationSec,
            distanceMeters: r.distanceMeters,
          });
        } catch (e) {
          console.error(
            `[optimize-route] zum-hub-Polyline fehlgeschlagen für ${m.id}:`,
            e,
          );
          polylines.push({
            kind: "direkt",
            monteurIds: [m.id],
            encodedPolyline: "",
            durationSec: 0,
            distanceMeters: 0,
          });
        }
      }
    }

    const result: ResponseShape = {
      startNl: {
        id: dispatch.startNl.id,
        name: dispatch.startNl.name,
        stadt: dispatch.startNl.stadt,
        koordinaten: dispatch.startNl.koordinaten,
        fahrzeitMin: dispatch.fahrzeitMin,
        begruendung: dispatch.begruendung,
      },
      kandidaten: dispatch.kandidaten.map((k) => ({
        id: k.nl.id,
        name: k.nl.name,
        stadt: k.nl.stadt,
        fahrzeitMin: k.tSprinterMin,
        tSprinterMin: k.tSprinterMin,
        summeMonteurZugangMin: k.summeMonteurZugangMin,
        totalCostMin: k.totalCostMin,
        gewaehlt: k.nl.id === dispatch.startNl.id,
        breakdown: k.monteurBreakdown,
      })),
      strategien,
      polylines,
      eckdaten: {
        anfrageId: anfrage.id,
        baustelle,
        werkzeugAnforderung: anfrage.werkzeugAnforderung,
      },
      generatedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, result);
    return NextResponse.json(result, { headers: { "x-cache": "miss" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

// Make sure we don't accidentally rely on getNiederlassung (kept for clarity)
void getNiederlassung;

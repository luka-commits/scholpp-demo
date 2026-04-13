# Szenario & Regel-Doku

Doku-File, **nicht im Build**. Erklärt Regeln und Mocks der Route-Optimierung.

## Niederlassungen (`data/niederlassungen.ts`)

Quelle: [scholpp.de](https://scholpp.de/) Standorte. Adressen + Koordinaten approximiert (Demo).

| NL | Sprinter | Caddy | Schwerlast (≥2t) |
|---|---|---|---|
| Dietzenbach (HQ) | ✓ | ✓ | ✓ |
| Berlin | ✓ | ✓ | ✓ |
| Chemnitz | ✓ | ✓ | ✓ |
| Leonberg | ✓ | ✓ | ✓ |
| Dresden | ✓ | ✓ | — |
| Jena | ✓ | ✓ | — |
| Bremen | ✓ | ✓ | — |

**Mock-Hinweis:** Fleet-Flags sind hardcoded; in echt käme das aus einer Fleet-DB. Großniederlassungen (HQ, Berlin, Chemnitz, Leonberg) führen Schwerlast-Werkzeug, kleine NL nur Standard.

## Monteure (`data/monteure.ts`)

Realistisch verteilt — keine Story-Cluster:

- **MB** Brandt (Richtmeister) → Renningen, NL Leonberg
- **TW** Weigl → Kassel, keine NL-Zuordnung
- **JP** Petersen → Achim (Bremen), NL Bremen
- AD Demir → Dietzenbach, NL Dietzenbach
- KS Schulz → Leipzig, NL Chemnitz

`heimNiederlassungId: string | null` — `null` wenn Monteur keiner NL angehängt ist (Privat-Wohnort).

## Anfragen (`data/anfragen.ts`)

Neues Feld: `werkzeugAnforderung: "standard" | "schwerlast"` — abgeleitet aus Equipment-Liste (z.B. "Schwerlastgeschirr 2t" → "schwerlast"). Triggert Filter im Dispatch.

## Regel-Engine (`lib/route-optimizer.ts`)

### Sprinter-Start-NL

1. Filtere NL nach Werkzeug + Sprinter-Verfügbarkeit (mock: alle haben Sprinter)
2. Wähle Min-Fahrzeit zur Baustelle (Routes-Matrix)

### Anreise pro Monteur

```
if Richtmeister + heim-NL == start-NL:   sprinter_fahrer
elif t_direkt < 90min:                    direkt
elif korridor_umweg ≤ 30min UND besser:   pickup_on_route
elif t_hub ≤ 60min:                       zum_hub_mitfahren
else:                                     bahn_direkt
```

Schwellwerte sind Konstanten in `route-optimizer.ts` — anpassbar pro Demo-Setup.

## API-Route (`app/api/optimize-route`)

- `POST` mit `{anfrageId, monteurIds}`
- 4 Routes-API-Calls minimum (Matrix NL, Matrix Monteure, Sprinter-Direkt, Sprinter-Pickup-Varianten)
- Field-Mask mandatory, sonst voller Response = teuer
- In-Memory-Cache pro Request-Hash → Demo-Reload triggert keinen neuen API-Call
- Server-Env: `GOOGLE_ROUTES_API_KEY` (NICHT `NEXT_PUBLIC_`)

## Client-Fallback

`lib/use-route-optimization.ts` — bei API-Fehler wird letzter erfolgreicher Response aus `localStorage` geholt. Banner zeigt "Cache-Modus".

## Quellen-Hinweis für Demo

Auf Karte: "Fahrzeiten · Google Routes API". Kein Mock-Banner — Daten sind live.

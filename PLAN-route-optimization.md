# SCHOLPP Demo — Regel-basierte Route-Optimierung via Google Routes API

## Context

Aktuelle Demo zeigt statische Luftlinien-Polylines mit geclusterten Demo-Monteuren am angeblichen "HQ Böblingen". Zwei Probleme:

1. **Factual error**: SCHOLPP-HQ ist laut scholpp.de **Dietzenbach**, nicht Böblingen. Echte Niederlassungen: Dietzenbach (HQ), Berlin, Chemnitz, Dresden, Jena, Leonberg (BW), Bremen.
2. **Fehlende Tiefe**: Demo soll zeigen wie Agent mit realistisch verteilten Monteuren umgeht — unterschiedliche Strategien pro Person (Sprinter-Pool / Pickup-on-Route / Bahn-Direkt) aus echten Fahrzeiten.

**Designentscheidung (mit User final geklärt):** Statt story-basierter Einzel-Annahmen (KUKA-Cluster, spezifische Wohnorte) — **explizite Regeln** im Code. Alle Agent-Entscheidungen müssen aus der Regel + Input (Baustelle, Team, Werkzeug) ableitbar sein. Story-Annahmen sind fragil, Regeln skalieren.

Ziel: Routes API (`computeRouteMatrix` + `computeRoutes`) server-side, Regel-Engine entscheidet Sprinter-Start-NL + pro-Monteur-Anreise, Karte zeigt echte Straßen-Polylines.

---

## Regel-System

### Fleet-Regel (pro Niederlassung)

| NL | Sprinter | Caddy | Schwerlast-Werkzeug (≥2t) |
|---|---|---|---|
| Dietzenbach (HQ) | ✓ | ✓ | ✓ |
| Berlin | ✓ | ✓ | ✓ |
| Chemnitz | ✓ | ✓ | ✓ |
| Leonberg | ✓ | ✓ | ✓ |
| Dresden | ✓ | ✓ | — |
| Jena | ✓ | ✓ | — |
| Bremen | ✓ | ✓ | — |

Großniederlassungen haben Schwerlast-Werkzeug, kleine nur Standard. Fleet ist pro NL gemockt (keine echte Fleet-DB).

### Dispatch-Regel (Sprinter-Start-NL ermitteln)

```
1. Filter nl → hat benötigtes Werkzeug + hat verfügbaren Sprinter
2. Für verbliebene nl: t_sprinter = route(nl → baustelle)
3. Gewinner = argmin(t_sprinter)
4. Richtmeister bevorzugt aus dieser NL gezogen (wenn verfügbar + qualifiziert)
```

### Anreise-Regel (pro Monteur)

Aus echter Routes-Matrix:
- `t_direkt` = Heimat → Baustelle (DRIVE)
- `t_hub`    = Heimat → Sprinter-Start-NL (DRIVE)
- `t_sprinter` = Sprinter-Start-NL → Baustelle (DRIVE)
- `korridor_umweg` = Sprinter mit Pickup-Waypoint durch Heimat vs. Direkt-Route

```
if monteur.istRichtmeisterFürDispatch:         → "sprinter_fahrer"
elif t_direkt < 90min:                          → "direkt" (Bahn/PKW)
elif korridor_umweg ≤ 30min UND sinnvoll:       → "pickup_on_route"
elif t_hub ≤ 60min:                             → "zum_hub_mitfahren"
else:                                           → "bahn_direkt"
```

### Transparenz

Jede Entscheidung zeigt die drei Zahlen (t_direkt, t_hub, korridor_umweg) — nachvollziehbar, nicht Black-Box.

---

## Scope

### 1. Daten-Files

**NEW** `data/niederlassungen.ts`
```ts
type Niederlassung = {
  id: string; name: string; stadt: string;
  adresse: string; koordinaten: {lat, lng};
  istHQ?: boolean;
  fleet: { sprinter: boolean; caddy: boolean; schwerlastWerkzeug: boolean };
};
```
7 Einträge mit echten Adressen + Flags aus Fleet-Regel oben.

**Update** `data/monteure.ts`
- Neues Feld `heimNiederlassungId: string` (FK auf niederlassungen)
- Heimatkoordinaten: realistische Verteilung (nicht alle im Cluster)
  - MB Richtmeister → heim Leonberg-Umland (48.80, 9.01)
  - TW → heim Kassel (privat, keiner NL direkt angehängt, `heimNiederlassungId` = null erlaubt) (51.31, 9.49)
  - JP → heim Bremen-Umland (53.11, 8.89), NL Bremen
- **Keine Story-Annahmen** in Kommentaren — nur Daten

**Update** `data/anfragen.ts`
- Neues Feld `werkzeugAnforderung: "standard" | "schwerlast"` (aus Equipment-Liste abgeleitet)
- Default für aktive Anfrage: "schwerlast" (2t Geschirr in Equipment-Liste → triggert Großniederlassungs-Filter)

**NEW** `context/szenario.md` (nur als Doku, nicht im Build)
- Dokumentiert die Regeln + explizit: welche Mocks, welche Quellen
- Einmal geschrieben, muss nicht ständig gepflegt werden

### 2. Regel-Engine (pure TS, ohne API-Aufrufe)

**NEW** `lib/route-optimizer.ts`
- `selectSprinterStartNl(nls, anfrage, werkzeugSet, fahrzeitenZurBaustelle) → Niederlassung`
- `decideAnreise(monteur, startNl, matrix, routenKorridor) → Strategie`
- Rein funktional, testbar ohne Routes API
- Input = Matrix-Ergebnisse, Output = strukturierte Entscheidung mit Begründung

### 3. Server-side Route Handler

**NEW** `app/api/optimize-route/route.ts`
- POST-Handler
- **Schritt A**: Geokodierung der Input-Adressen (oder vorab in Daten — für Demo-Stabilität mit festen Koordinaten arbeiten)
- **Schritt B**: `computeRouteMatrix` mit Großniederlassungen (oder alle 7 bei Standard-Werkzeug) als Origins, Baustelle als Destination → Fahrzeiten pro NL
- **Schritt C**: Regel-Engine wählt Start-NL
- **Schritt D**: `computeRouteMatrix` Monteure × {Start-NL, Baustelle} + potenzielle Pickup-Punkte → Entscheidungs-Input
- **Schritt E**: `computeRoutes` final für Sprinter (mit Pickup-Intermediates) + ggf. TRANSIT für Bahn-Monteure
- Returns: `{ startNl, strategien[], polylines[], eckdaten }`
- Field-Mask mandatory: `routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline`
- Env: `GOOGLE_ROUTES_API_KEY` (server-only)
- Caching: simpler In-Memory-Cache pro Request-Hash (innerhalb einer Deployment-Instance), damit Demo-Reloads keine API-Kosten triggern

### 4. Client-side RouteMap Rewrite

`components/demo/RouteMap.tsx`
- `libraries: ['geometry']` als **module-level const** (sonst reload-warning von useJsApiLoader)
- Bei Mount: `fetch('/api/optimize-route')` mit aktueller Anfrage/Monteur-Daten
- Loading-State ("Agent berechnet Routen via Google Maps…")
- Error-State (bei API-Key-Fehler: klarer Hinweis + Fallback auf Luftlinien)
- `google.maps.geometry.encoding.decodePath(encoded)` für jede Polyline
- Rendert bis zu 3 Routen farbkodiert:
  - Sprinter-Route (mit Pickup-Waypoints) — SCHOLPP-Rot, dick durchgezogen
  - Bahn-Route — blau, gestrichelt (Luftlinie, TRANSIT-polyline ist kein Straßenverlauf)
  - Direkt-Anreise (wenn abweichend) — grau durchgezogen
- Marker: alle 7 NL (aktive Start-NL hervorgehoben), Monteur-Heimaten, Baustelle, Pickup-Punkte
- Karte zeigt ganz Deutschland (zoom 6, center auf mittelpunkt aller Punkte)
- Legende + Quellen-Hinweis ("Fahrzeiten: Google Routes API · live berechnet")

### 5. StrategyBlock

**NEW** `components/demo/StrategyBlock.tsx`
- Eine Zeile pro Monteur:
  - Name · Heimat → Strategie (Sprinter/Pickup/Bahn/Direkt)
  - echte Fahrzeit + Begründung aus Regel-Engine
- Eingebaut in ApprovalCard **über** VehicleBlock (dieser bleibt Sprinter-spezifisch)

### 6. Bestehenden Code anpassen

- `data/fahrzeuge.ts` — Empfohlenes Fahrzeug „ab Niederlassung Leonberg" → dynamisch aus Dispatch-Regel, nicht hart codiert. Oder: Startort entfernen, VehicleBlock zeigt Dispatch-Ergebnis.
- `data/sourceCards.ts` — personal-db + fleet Snippets: Heimatorte + NL-Zuordnung aus neuen Daten generieren, kein hardcodierter "Böblingen"-Text
- `components/demo/VehicleBlock.tsx` — Hero-Text liest `startNl` aus API-Response statt Konstanten
- `components/demo/ApprovalCard.tsx` — StrategyBlock vor VehicleBlock einfügen

### 7. Env + GCP Setup (User-Blocker, doku)

1. Google Cloud Console → APIs & Services → Library → **Routes API** enablen
2. Billing-Account auf Projekt aktiv
3. API-Key erstellen (ohne HTTP-Referrer-Restriction für Server-Use; empfohlen: Application-Restrictions = None, API-Restriction auf Routes API)
4. In `.env.local` und Vercel-Env-Vars: `GOOGLE_ROUTES_API_KEY=...` (explizit ohne `NEXT_PUBLIC_`-Prefix)
5. Bestehender `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` bleibt für Client-Map-Rendering

### 8. End-Slide: "Aufbau nach innen" (Tech-Stack-Panel)

Auf der finalen Impact-Slide (`components/demo/ImpactScreen.tsx`) neben dem existierenden Was-leistet-das-System-Block einen **zweiten Block „Wie ist es gebaut"** — gibt Frau Paal technisches Vertrauen ohne Details-Overload.

Inhalt (Icon-Liste, nicht technisch-tief):
- **Research-Layer**: Perplexity API (strukturierte Web-Recherche z.B. Hotel-Meta-Vergleich, Tarif-Lookup)
- **Geo-Layer**: Google Routes API (Fahrzeiten-Matrix, Route-Berechnung) + Google Maps JS (Visualisierung)
- **Daten-Layer**: Verbindung zu SCHOLPP-Interna (Fleet-DB, Personal-DB, Roomix, Betriebsordnung) via n8n/MCP
- **Kommunikations-Layer**: E-Mail (SMTP/IMAP) für Kundenkommunikation + Buchungs-Bestätigungen, optional Slack/Teams
- **Agent-Layer**: Claude 4 / Agent-Framework mit Human-in-the-Loop-Approval

Layout: 5 Zeilen mit Icon + Kurz-Label + 1-Satz-Beschreibung, bewusst schlicht. Keine Logos externer Anbieter (außer wo rechtlich okay). Stil konsistent mit linkem „Was leistet das System"-Block.

### 9. Fallback-Strategie (Demo-Robustheit)

Bei API-Fehler (403, Netzwerk-Problem vor Ort):
- Erster erfolgreicher Response wird in `localStorage` gecached unter Request-Hash
- Bei Fehler: gecachter Response wird verwendet, Banner "Cache-Modus · letzter erfolgreicher Live-Call YYYY-MM-DD"
- Kein Crash, Demo läuft auch offline durch wenn einmal live geladen

---

## Out of Scope

- OR-Tools VRP-Solver (Regel-Heuristik reicht für die Demo-Größenordnung)
- Echte Fleet-DB-Integration
- Live-Traffic-Simulation mit Animation
- A1-Bescheinigung / EU-Auslandseinsatz
- Änderungen an InboxView (Form ist frisch gebaut und passt)
- Geokodierung aus Freitext-Adressen (Demo nutzt vorab definierte Koordinaten in Daten)
- Änderungen an Zukunftsmusik-Blöcken

---

## Critical Files

| Datei | Aktion |
|---|---|
| `data/niederlassungen.ts` | **NEW** — 7 Standorte + Fleet-Flags |
| `data/monteure.ts` | Update — `heimNiederlassungId`, neue Heimat-Koords |
| `data/anfragen.ts` | Update — `werkzeugAnforderung` |
| `data/fahrzeuge.ts` | Dynamischer Start statt „Böblingen" |
| `data/sourceCards.ts` | Snippets aus Daten generieren |
| `lib/route-optimizer.ts` | **NEW** — Regel-Engine, pure TS |
| `app/api/optimize-route/route.ts` | **NEW** — Server-side Routes API |
| `components/demo/RouteMap.tsx` | Rewrite — fetch + echte Polylines |
| `components/demo/StrategyBlock.tsx` | **NEW** — Pro-Monteur-Übersicht |
| `components/demo/VehicleBlock.tsx` | Dynamischer Start-NL-Text |
| `components/demo/ApprovalCard.tsx` | StrategyBlock einbauen |
| `components/demo/ImpactScreen.tsx` | „Aufbau nach innen"-Panel neben bestehenden End-Block |
| `context/szenario.md` | **NEW** — Regel-Doku + Mock-Liste |
| `.env.local` + Vercel | `GOOGLE_ROUTES_API_KEY` |

---

## Verification

1. **Unit**: Regel-Engine hat Tests (oder curl-Test): gegeben Matrix → erwartete Strategie pro Monteur
2. **API-Route**: `curl -X POST localhost:3000/api/optimize-route -d '{...}'` liefert Strategien + Polylines. 200 mit plausiblen Fahrzeiten.
3. **Visual**: RouteMap zeigt 1–3 echte Straßen-Routes — Sprinter folgt Autobahn-Netz realistisch, Bahn-Linie klar abgegrenzt, Pickup-Punkt markiert
4. **Regel-Tests** (manuell per Input-Änderung im Form):
   - Monteur-Adresse auf „Hannover" → Strategie = `direkt`
   - Werkzeug-Anforderung auf „standard" → Dispatch kann auch Bremen/Dresden wählen
   - Monteur weit von Korridor → `bahn_direkt` statt Pickup
5. **Error-Path**: API-Key falsch → klarer Banner statt Crash
6. **Offline-Fallback**: Nach einem erfolgreichen Load, Netzwerk aus → Demo läuft weiter aus Cache
7. **Prod**: Vercel-Env-Var gesetzt, Live-URL zeigt echte Routes

---

## Risiken

- **GCP-Billing nicht aktiv** → 403. Mitigation: klarer Banner im UI + Anleitung
- **Key-Leak**: strikt server-only-Var, nie `NEXT_PUBLIC_`
- **Demo-Flaky ohne Netz** bei Frau Paal → localStorage-Cache als Fallback
- **Kosten** bei vielen Reloads während Demo-Dev: In-Memory-Cache im Dev-Server (HMR-safe)

---

## Approach / Reihenfolge

1. **GCP-Setup** (User-Blocker, parallel) — 5 min
2. Niederlassungen + Anfragen-Feld (Daten) — 15 min
3. Monteure neu verteilen + `heimNiederlassungId` — 10 min
4. Regel-Engine `lib/route-optimizer.ts` (pure, testbar) — 45 min
5. API-Route mit Routes API + Field-Masks + Caching — 60 min
6. RouteMap Rewrite mit Geometry-Lib + echten Polylines — 45 min
7. StrategyBlock + ApprovalCard-Integration — 25 min
8. Text-Updates (VehicleBlock, sourceCards, fahrzeuge) — 15 min
9. ImpactScreen „Aufbau nach innen"-Panel — 20 min
10. `context/szenario.md` Doku — 10 min
11. Build + Prod-Deploy + Live-Smoke-Test — 20 min
12. Puffer (Error-States, Edge-Cases, localStorage-Fallback) — 30 min

**Gesamt: ~4.5-5 h Arbeit.** Machbar bis Freitag 2026-04-17 wenn GCP-Setup bis Mittwoch steht.

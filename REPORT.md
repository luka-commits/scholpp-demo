# SCHOLPP Reisekoordinator Demo — Build Report

**Stand:** 2026-04-13
**Zielmeeting:** Fr 17.04.2026, 9:30 Uhr mit Frau Paal
**Live-URL:** https://scholpp-demo.vercel.app
**GitHub:** https://github.com/luka-commits/scholpp-demo

---

## Was gebaut wurde

- **Landing (`/`)** — 9 Sektionen: Hero · ProblemStats · FiveAttributes · WorkflowDiagram · HumanInCenter · Roadmap · FuturePhases · CTA · Footer
- **Demo (`/demo`)** — interaktiver State-Automat mit 6 Zuständen:
  1. `intro` — Szenario-Karte (Werksumzug Hannover)
  2. `inbox` — 3 Anfragen-Liste, aktive Anfrage REQ-2026-0412
  3. `working` — Terminal-style Reasoning-Log, 9 Schritte mit Quellen, Framer-Motion
  4. `approval` — Vergleichstabelle 4 Hotels + Scoring-Breakdown + SVG Route-Map + Fahrzeug-Vergleich + Betriebsordnung-Check + Audit-Log (expandable) + KPI-Sidebar + „Neue Anfrage"-Toast
  5. `success` — 4-Schritt Completion-Sequenz (Roomix / Kalender / Fleet / Mail)
  6. `impact` — 3-Block Vorher/Nachher + Hochrechnung auf 500 Buchungen/Jahr

- **Daten-Layer (mock, scripted):**
  - 14 realistische Hannover/Langenhagen-Hotels
  - 4 richtlinienkonform, 10 durch Regeln gefiltert (transparent als „weitere 10" einblendbar)
  - 3 Fahrzeug-Szenarien (Status Quo 1.240 € · Optimiert 560 € · Alternative 892 €)
  - 5 Betriebsordnungs-Regeln (v2.3)
  - 9 Reasoning-Steps mit 6 verschiedenen Quellen (Betriebsordnung, Google Maps, Roomix, booking.com, hrs.de, Fleet, ADAC, Agent-intern)
  - Deterministisches Scoring (Preis 30 % · Distanz 30 % · Verfügbarkeit 20 % · Komfort 20 %)

- **Branding:** SCHOLPP-Rot #E00028 / #C40023 hover, Open Sans, JetBrains Mono für Codes/IDs, scharfe Ecken (1-2px), Hairlines #E5E5E5, Logo links + „Powered by Meisterwerk" dezent im Footer.

---

## Entscheidungen / Deviations vom Plan

1. **Google Maps Static API → SVG-Route-Map**
   API-Key war nicht aktiviert (`This API is not activated on your API project`). Statt Key zu aktivieren: stylized SVG-Karte mit Grid, Autobahn A2, Maschsee, Baustelle + 3 Hotel-Marker. Vorteil: passt besser zum Hairline-Design-System, kein externer Request, kein CORS-Risiko, deterministisch.

2. **Booking.com Firecrawl-Scrape → kuratierte Hotel-Liste**
   Firecrawl-Output war JS-gerendert und unsauber (abgeschnittene Namen, Preise im Falschformat). 14 realistische Hotels für Hannover/Langenhagen manuell kuratiert (IntercityHotel, NH, Best Western Kronsberg, Courtyard Maschsee, Mercure, Holiday Inn Express, Maritim, Leonardo, Wyndham, Motel One, Ibis, B&B, H+, Super 8). Alle mit plausiblen Preisen, Distanzen, Bewertungen, Quelle-Varianten.

3. **E-Mail-Parsing-Animation → strukturiertes Formular**
   Ursprünglich geplant: „unstrukturierte E-Mail wird geparst". Ersetzt durch: strukturiertes Projektleiter-Formular mit klar benannten Feldern (Baustelle, Zeitraum, Equipment, Sonderwünsche). Näher an der SCHOLPP-Realität (Projektleiter kommuniziert ohnehin strukturiert via Roomix-Portal-Form).

4. **Tech-Stack- und DSGVO-Sektionen entfernt**
   Wie besprochen — wird im Meeting mündlich erklärt.

5. **Shared sticky Action-Bar am Demo-Boden**
   Zusätzlich eingebaut: die drei Buttons (Ablehnen · Anpassen · Buchen & Freigeben) sticken am unteren Rand der Approval-Seite. Frau Paal scrollt nicht bis zum Ende — sie sieht die Entscheidung immer.

6. **„Neue Anfrage"-Toast**
   Popup nach 18 Sek „REQ-2026-0413 · Dortmund, 3 Monteure · Agent übernimmt automatisch". Subtile Lebendigkeit, zeigt: das System läuft, auch während Frau Paal zuschaut.

7. **Empfehlungs-Summary-Card**
   Zusätzliche Sidebar-Card mit Gesamt-Kalkulation (Hotelkosten + Fahrtkosten = Gesamt). Macht die finanzielle Wirkung auf einen Blick greifbar.

---

## Was beim E2E-Testing aufgefallen ist

✅ Beide Playwright-Tests grün (Landing + Demo-Flow) gegen Live-Vercel-URL.
✅ Komplette Demo in 13-14 Sek durchklickbar → passt in den 3-5-Min-Slot im Meeting mit Puffer.
✅ Auto-Transitions (Agent Working → Approval, Success → Impact) funktionieren robust.

---

## Empfehlungen für den Meeting-Run

- Im Teams-Screenshare: Chrome-Fenster auf **1440×900+**. Alles darunter zwingt die Hotel-Vergleichstabelle in horizontales Scrollen.
- **Demo nicht selbst durchklicken** — Luka/Philippe durchklicken, Frau Paal reagiert. Intro 3 Sek sprechen lassen, dann klicken.
- **Bei Approval stoppen** — das ist der Moment, wo die Belief-States einrasten (Quellen, Scoring, Audit-Log). 30-60 Sek dort verweilen, dann "Buchen".
- **Impact-Screen = Closing-Moment** — die Hochrechnung (358 h · 85.000 €/Jahr) ist der Anker für die 4-8 k€-Pilot-Entscheidung.

---

## Offene Verbesserungen (nach Meeting, falls Pilot kommt)

- [ ] Echte Roomix-API-Integration (in Phase 1 des Pilots)
- [ ] Echter Google Maps / OSM Layer (statt SVG-Karte)
- [ ] Mobile-Responsive (aktuell Desktop-first, im Meeting auch Desktop)
- [ ] Variant B mit 2 Projektleitern parallel — für das "wir schaffen wirklich viel"-Belief
- [ ] Edge-Case Karten (Messe-Einsatz, Mehrort-Einsatz, Richtlinien-Ausnahme-Freigabe)

---

## Tech-Summary

- Next.js 16 (App Router) + TypeScript 5 + Tailwind 4
- Framer Motion 12 (Reasoning-Animation, State-Transitions)
- Lucide React (Icons)
- Vercel statisches Deployment (`/`, `/demo`, `/_not-found` alle SSG)
- Keine Runtime-API-Calls · volle Determinismus → jeder Demo-Lauf identisch
- Playwright E2E gegen Live-URL

---

## Deployment

```
gh:       https://github.com/luka-commits/scholpp-demo
live:     https://scholpp-demo.vercel.app
last:     https://scholpp-demo-4u4b5zfvl-escapedtherats-projects.vercel.app
redeploy: cd ~/Desktop/Projekte/scholpp-demo && vercel --prod --yes
```

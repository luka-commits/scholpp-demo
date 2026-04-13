"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Search, Scale, ShieldCheck, Route, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function ImpactScreen({ onReset }: { onReset: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/30 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero — Video: Freigabe → Produktionshalle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 overflow-hidden border border-[var(--border)] bg-black"
        >
          <video
            src="/impact.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            className="w-full h-auto block"
            onEnded={(e) => {
              e.currentTarget.pause();
              setVideoEnded(true);
            }}
          />
        </motion.div>

        <AnimatePresence>
        {videoEnded && (
        <>
        {/* Was der Agent macht */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-3">
            5 Kernfunktionen · Feature-Überblick
          </div>
          <h2 className="text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em] font-semibold text-[var(--foreground)] max-w-3xl">
            Was der Agent im Alltag für SCHOLPP übernimmt.
          </h2>
          <p className="mt-4 text-[15px] text-[var(--muted-foreground)] leading-[1.6] max-w-2xl">
            Fünf Funktionen, die zusammen den Koordinations-Workflow abdecken —
            von der ersten Recherche bis zum Einsatz-Dashboard.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Search,
              title: "Research verschiedenster Optionen",
              body: "Hotels, Fahrzeuge und Vor-Ort-Infos werden aus unterschiedlichen Quellen gleichzeitig zusammengetragen.",
              value: "Kein Tab-Hopping mehr — alle relevanten Optionen in einem Durchlauf.",
            },
            {
              icon: Scale,
              title: "Scoring verschiedener Variablen",
              body: "Preis, Distanz, Eignung und weitere Faktoren werden gewichtet und transparent verglichen.",
              value: "Entscheidungen basieren auf Daten, nicht auf Bauchgefühl.",
            },
            {
              icon: ShieldCheck,
              title: "Abgleich mit Betriebsordnung",
              body: "Jeder Vorschlag wird automatisch gegen SCHOLPPs Regeln und Vorgaben geprüft.",
              value: "Fehlbuchungen werden verhindert, bevor sie entstehen.",
            },
            {
              icon: Route,
              title: "Organisation der Mitarbeiter",
              body: "Einsätze und Reisen werden so geplant, dass Routen und Teams optimal zusammenpassen.",
              value: "Weniger Leerfahrten, bessere Auslastung, entspanntere Monteure.",
            },
            {
              icon: LayoutDashboard,
              title: "Visuelles Dashboard",
              body: "Alle geplanten und laufenden Einsätze auf einen Blick — Status, Route, Team, Freigaben.",
              value: "Der Projektleiter behält den Überblick, ohne fünf Tools zu öffnen.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="hairline border bg-white p-6 relative"
            >
              <div className="absolute top-4 right-4 text-[11px] font-mono text-[var(--muted-foreground)]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center mb-4">
                <item.icon size={16} className="text-[var(--scholpp-red)]" />
              </div>
              <div className="text-[15px] font-semibold text-[var(--foreground)] mb-2">
                {item.title}
              </div>
              <div className="text-[13px] text-[var(--muted-foreground)] leading-[1.55] mb-3">
                {item.body}
              </div>
              <div className="text-[12px] text-[var(--scholpp-red)] leading-[1.5] font-medium pt-3 border-t border-[var(--border)]">
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Infrastruktur */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-3">
            So ist das System gebaut
          </div>
          <h2 className="text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.02em] font-semibold text-[var(--foreground)] max-w-3xl mb-6">
            Nach außen eine Oberfläche — dahinter eine saubere Infrastruktur.
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="hairline border bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-2">
                Frontend
              </div>
              <div className="text-[14px] text-[var(--foreground)] font-medium mb-2">
                Ein Dashboard für den Projektleiter.
              </div>
              <div className="text-[13px] text-[var(--muted-foreground)] leading-[1.6]">
                Keine neuen Tools zum Lernen. Einsätze planen, Vorschläge
                prüfen, freigeben — alles in einer Oberfläche.
              </div>
            </div>
            <div className="hairline border bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-2">
                Agent-Layer
              </div>
              <div className="text-[14px] text-[var(--foreground)] font-medium mb-2">
                Der Agent als Recherche- und Vergleichs-Schicht.
              </div>
              <div className="text-[13px] text-[var(--muted-foreground)] leading-[1.6]">
                Läuft parallel gegen interne und externe Quellen, scort
                Optionen und bereitet eine begründete Empfehlung vor.
              </div>
            </div>
            <div className="hairline border bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-2">
                Integration
              </div>
              <div className="text-[14px] text-[var(--foreground)] font-medium mb-2">
                Angebunden an SCHOLPPs Systeme.
              </div>
              <div className="text-[13px] text-[var(--muted-foreground)] leading-[1.6]">
                Betriebsordnung, Monteur-Stammdaten und Equipment-Listen
                werden direkt aus bestehenden Quellen gelesen — keine
                Parallel-Datenhaltung.
              </div>
            </div>
            <div className="hairline border bg-white p-6">
              <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-2">
                Audit & Governance
              </div>
              <div className="text-[14px] text-[var(--foreground)] font-medium mb-2">
                Jeder Schritt protokolliert.
              </div>
              <div className="text-[13px] text-[var(--muted-foreground)] leading-[1.6]">
                Eingaben, abgefragte Quellen, Scoring, Freigabe — lückenlos
                nachvollziehbar. Hosting in Europa, Daten bleiben bei SCHOLPP.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom — CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="hairline border bg-[var(--foreground)] text-white p-8 md:p-10"
        >
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold mb-3">
              Nächster Schritt
            </div>
            <h3 className="text-[26px] leading-[1.15] tracking-[-0.01em] font-semibold">
              Pilot starten.
            </h3>
            <p className="mt-3 text-[14px] text-white/70 leading-[1.6]">
              Wir installieren den Agent für eine kleine Gruppe Projektleiter,
              begleiten Go-Live und entscheiden danach gemeinsam über den
              Rollout.
            </p>
          </div>
        </motion.div>
        </>
        )}
        </AnimatePresence>

        <div className="mt-10 text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-[13px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <RotateCcw size={12} />
            Demo zurücksetzen
          </button>
          <span className="mx-3 text-[var(--border-strong)]">·</span>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </div>
  );
}

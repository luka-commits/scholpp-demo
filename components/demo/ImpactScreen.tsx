"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Search,
  Scale,
  ShieldCheck,
  Route,
  LayoutDashboard,
  Globe,
  MapPin,
  Database,
  Mail,
  Bot,
} from "lucide-react";
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

        <motion.div
          initial={false}
          animate={videoEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: videoEnded ? "auto" : "none" }}
        >
        {/* Nach außen / Nach innen — Vergleichs-Tabelle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={videoEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-3">
            Was der Agent macht · Wie er gebaut ist
          </div>
          <h2 className="text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em] font-semibold text-[var(--foreground)] max-w-3xl">
            Nach außen 5 Funktionen — nach innen 5 Layer.
          </h2>
        </motion.div>

        <div className="hairline border bg-white mb-12 overflow-hidden">
          <div className="grid grid-cols-2 border-b border-[var(--border)] bg-[var(--muted)]/40">
            <div className="px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold border-r border-[var(--border)]">
              Nach außen · Funktionen
            </div>
            <div className="px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-[var(--muted-foreground)] font-semibold">
              Nach innen · Infrastruktur
            </div>
          </div>

          {[
            {
              outIcon: Search,
              outTitle: "Research verschiedenster Optionen",
              outBody: "Hotels, Fahrzeuge, Vor-Ort-Infos — parallel aus allen Quellen.",
              inIcon: Globe,
              inTitle: "Research-Layer",
              inBody: "Perplexity API für strukturierte Web-Recherche, Portal-übergreifend.",
            },
            {
              outIcon: Scale,
              outTitle: "Scoring verschiedener Variablen",
              outBody: "Preis, Distanz, Eignung — gewichtet und transparent verglichen.",
              inIcon: MapPin,
              inTitle: "Geo-Layer",
              inBody: "Google Routes API für Fahrzeiten-Matrix, Google Maps JS im Dashboard.",
            },
            {
              outIcon: ShieldCheck,
              outTitle: "Abgleich mit Betriebsordnung",
              outBody: "Jeder Vorschlag gegen SCHOLPPs Regeln geprüft, bevor er sichtbar wird.",
              inIcon: Database,
              inTitle: "Daten-Layer",
              inBody: "Fleet-DB, Personal-DB, Roomix, Betriebsordnung via n8n/MCP — keine Parallel-Datenhaltung.",
            },
            {
              outIcon: Route,
              outTitle: "Organisation der Mitarbeiter",
              outBody: "Einsätze und Reisen so geplant, dass Routen und Teams zusammenpassen.",
              inIcon: Mail,
              inTitle: "Kommunikations-Layer",
              inBody: "E-Mail via SMTP/IMAP für Kunden + Buchungen, optional Slack/Teams.",
            },
            {
              outIcon: LayoutDashboard,
              outTitle: "Visuelles Dashboard",
              outBody: "Alle Einsätze auf einen Blick — Status, Route, Team, Freigaben.",
              inIcon: Bot,
              inTitle: "Agent-Layer",
              inBody: "Claude 4 Agent-Framework mit Human-in-the-Loop-Approval bei jeder Buchung.",
            },
          ].map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={videoEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
              className={`grid grid-cols-2 ${i < 4 ? "border-b border-[var(--border)]" : ""}`}
            >
              {/* Links: Funktion */}
              <div className="px-5 py-4 flex gap-3 items-start border-r border-[var(--border)]">
                <span className="w-8 h-8 border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                  <row.outIcon size={13} className="text-[var(--scholpp-red)]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--foreground)] leading-tight mb-1">
                    {String(i + 1).padStart(2, "0")} · {row.outTitle}
                  </div>
                  <div className="text-[12px] text-[var(--muted-foreground)] leading-[1.5]">
                    {row.outBody}
                  </div>
                </div>
              </div>

              {/* Rechts: Layer */}
              <div className="px-5 py-4 flex gap-3 items-start">
                <span className="w-8 h-8 border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                  <row.inIcon size={13} className="text-[var(--scholpp-red)]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--foreground)] leading-tight mb-1">
                    {row.inTitle}
                  </div>
                  <div className="text-[12px] text-[var(--muted-foreground)] leading-[1.5]">
                    {row.inBody}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
        </motion.div>

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

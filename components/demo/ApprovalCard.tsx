"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Edit3,
  X,
  ChevronDown,
  ShieldCheck,
  Route,
  Sparkles,
} from "lucide-react";
import { rankedHotels } from "@/data/scoring";
import { hotels } from "@/data/hotels";
import { formatEur } from "@/lib/utils";
import { aktiveAnfrage } from "@/data/anfragen";
import { HotelCard } from "./HotelCard";
import { RouteMap } from "./RouteMap";
import { VehicleBlock } from "./VehicleBlock";
import { TeamBlock } from "./TeamBlock";
import { EquipmentBlock } from "./EquipmentBlock";
import { ComplianceBlock } from "./ComplianceBlock";
import { VorOrtBlock } from "./VorOrtBlock";
import { empfohleneFahrzeugOption } from "@/data/fahrzeuge";
import { NewRequestToast } from "./NewRequestToast";

export function ApprovalCard({ onApprove }: { onApprove: () => void }) {
  const [showFiltered, setShowFiltered] = useState(false);
  const [showFuture, setShowFuture] = useState(false);

  const top = rankedHotels[0];
  const topCards = rankedHotels.slice(0, 3);
  const gefiltert = hotels.filter((h) => !h.erfuelltRichtlinie);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/30">
      <NewRequestToast />
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-[1fr_300px] gap-6">
        {/* Main */}
        <div className="space-y-5 min-w-0">
          {/* Header */}
          <div className="hairline border bg-white p-6">
            <div className="mb-3">
              <div className="font-mono text-[11px] text-[var(--muted-foreground)] mb-1">
                {aktiveAnfrage.id} · Einsatz-Vorschlag 08:43:12
              </div>
              <h1 className="text-[26px] font-semibold tracking-[-0.01em] leading-tight">
                Einsatz: Hannover 13.–17.04.
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-[13px] text-[var(--muted-foreground)]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--success)]" />
                100 % richtlinienkonform
              </span>
              <span>3 Monteure · 1 Hotel + Anreise</span>
              <span>11 Quellen · 7 Hotel-Portale</span>
            </div>
          </div>

          {/* MVP-Sektion ============================ */}
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold pt-2">
            Kern · Reise-Koordination
          </div>

          {/* 1. Anreise-Pooling (Multi-Origin) */}
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-3">
              <Route size={12} />
              Anreise · Pooling + Fahrzeug-Optimierung
            </div>
            <RouteMap />
            <div className="mt-4">
              <VehicleBlock />
            </div>
          </div>

          {/* 2. Hotel-Recherche */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                <Sparkles size={12} />
                Hotel-Recherche · Preis-Check über 7 Portale
              </div>
              <div className="text-[11px] text-[var(--muted-foreground)]">
                Sortiert nach Scoring · alle richtlinienkonform
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {topCards.map((r, i) => (
                <HotelCard
                  key={r.hotel.id}
                  hotel={r.hotel}
                  score={r.score}
                  rank={i + 1}
                  isTop={i === 0}
                />
              ))}
            </div>

            <div className="hairline border bg-white mt-3">
              <button
                onClick={() => setShowFiltered((v) => !v)}
                className="w-full px-5 py-3 flex items-center justify-between text-[12px] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/40 text-left"
              >
                <span>
                  {gefiltert.length} weitere Hotels durch Richtlinie ausgeschlossen —{" "}
                  <span className="text-[var(--foreground)] font-medium">Details anzeigen</span>
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showFiltered ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {showFiltered && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-[var(--border)] bg-[var(--muted)]/30"
                  >
                    <ul className="divide-y divide-[var(--border)]">
                      {gefiltert.map((h) => (
                        <li
                          key={h.id}
                          className="px-5 py-2.5 flex items-center justify-between text-[12px]"
                        >
                          <div>
                            <span className="font-medium">{h.name}</span>
                            <span className="text-[var(--muted-foreground)] ml-2">
                              {formatEur(h.preisProNacht)} · {h.entfernungKm} km · {h.sterne}★
                            </span>
                          </div>
                          <span className="text-[var(--scholpp-red)] text-[11px]">
                            {h.gefilterterGrund}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="hairline border bg-white sticky bottom-0 p-4 flex items-center justify-between z-20">
            <div className="text-[12px] text-[var(--muted-foreground)]">
              Human-in-the-Loop · Projektleiter behält die Entscheidung
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 h-11 px-5 border border-[var(--border-strong)] text-[13px] font-semibold hover:bg-[var(--muted)]">
                <X size={14} />
                Ablehnen
              </button>
              <button className="inline-flex items-center gap-2 h-11 px-5 border border-[var(--border-strong)] text-[13px] font-semibold hover:bg-[var(--muted)]">
                <Edit3 size={14} />
                Anpassen
              </button>
              <button
                onClick={onApprove}
                className="inline-flex items-center gap-2 h-11 px-6 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white text-[13px] font-semibold"
              >
                <Check size={14} />
                Buchen & Freigeben
              </button>
            </div>
          </div>

          {/* Zukunftsmusik-Sektion ============================ */}
          <div className="pt-6">
            <button
              onClick={() => setShowFuture((v) => !v)}
              className="w-full hairline border bg-white px-5 py-4 flex items-center justify-between hover:bg-[var(--muted)]/30 text-left"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] font-semibold mb-1">
                  Ausbau-Stufe · Zukunftsmusik
                </div>
                <div className="text-[15px] font-semibold tracking-[-0.01em]">
                  Weitere Facetten des Einsatz-Koordinators
                </div>
                <div className="text-[12px] text-[var(--muted-foreground)] mt-1">
                  Team-Validierung · Equipment-Dispo · Reiseregeln · Vor-Ort-Setup — nach dem MVP-Pilot
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform text-[var(--muted-foreground)] shrink-0 ml-4 ${
                  showFuture ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {showFuture && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 space-y-5">
                    <TeamBlock />
                    <EquipmentBlock />
                    <ComplianceBlock />
                    <VorOrtBlock />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right rail — nur Einsatz-Summary */}
        <div className="hidden md:block space-y-4">
          <div className="hairline border bg-white p-4">
            <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-3">
              Einsatz-Summary
            </div>
            <ul className="space-y-2 text-[12px]">
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Team</span>
                <span className="font-medium">3 Monteure</span>
              </li>
              <li className="flex justify-between gap-2 pt-2 mt-1 border-t border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Hotel</span>
                <span className="font-medium text-right truncate max-w-[180px]">
                  {top.hotel.name}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Nächte × Zi.</span>
                <span className="font-medium">
                  {aktiveAnfrage.zeitraum.naechte} × 4
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Hotelkosten</span>
                <span className="font-medium">
                  {formatEur(
                    top.hotel.preisProNacht * aktiveAnfrage.zeitraum.naechte * 4
                  )}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Fahrzeug</span>
                <span className="font-medium">{empfohleneFahrzeugOption.kurz}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Fahrtkosten</span>
                <span className="font-medium">
                  {formatEur(empfohleneFahrzeugOption.gesamtkosten)}
                </span>
              </li>
              <li className="flex justify-between pt-2 mt-1 border-t border-[var(--border)]">
                <span className="font-semibold">Gesamt</span>
                <span className="font-bold">
                  {formatEur(
                    top.hotel.preisProNacht * aktiveAnfrage.zeitraum.naechte * 4 +
                      empfohleneFahrzeugOption.gesamtkosten
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

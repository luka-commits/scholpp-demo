"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fahrzeugOptionen, empfohleneFahrzeugOption } from "@/data/fahrzeuge";
import { formatEur } from "@/lib/utils";
import { Check, ChevronDown, Truck } from "lucide-react";

const begruendungen = [
  "Alle 3 Monteure ab Niederlassung Böblingen — Pooling möglich (≤ 15 km Heimat-Distanz)",
  "2 t Werkzeug muss mit (aus Anfrage) — Sprinter hat Laderaum, kein Extra-Transport nötig",
  "Sprinter 319 im Fleet frei ab 13.04. 06:00 (SCHOLPP Fleet-DB verifiziert)",
  "Richtmeister Brandt hat C1E — darf Sprinter mit 2 t Anhänger-Last fahren",
];

export function VehicleBlock() {
  const [showWhy, setShowWhy] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const empf = empfohleneFahrzeugOption;
  const alternativen = fahrzeugOptionen.filter((f) => !f.empfohlen);

  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          <Truck size={12} />
          Fahrzeug · Empfehlung des Agents
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Quellen: SCHOLPP Fleet · ADAC
        </div>
      </div>

      {/* Hero: Single Empfehlung */}
      <div className="p-6 bg-[var(--scholpp-red)]/[0.04] relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--scholpp-red)]" />
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <div className="inline-flex items-center gap-1 text-[10px] bg-[var(--scholpp-red)] text-white px-1.5 py-0.5 font-semibold uppercase tracking-wide mb-2">
              <Check size={10} />
              Empfehlung
            </div>
            <div className="text-[22px] font-semibold tracking-[-0.01em] leading-tight">
              1× VW Crafter Sprinter ab Niederlassung Böblingen
            </div>
            <div className="text-[13px] text-[var(--muted-foreground)] mt-1.5">
              Team + 2 t Werkzeug in einem Fahrzeug · Fahrer: Richtmeister Brandt (C1E)
            </div>
          </div>
          <div className="text-right">
            <div className="text-[30px] font-bold tracking-[-0.02em] leading-none">
              {formatEur(empf.gesamtkosten)}
            </div>
            <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
              gesamt · {empf.fahrzeit} · {empf.co2Kg} kg CO₂
            </div>
          </div>
        </div>

        {/* Expandable: Warum Sprinter? */}
        <div className="mt-5 pt-4 border-t border-[var(--border)]">
          <button
            onClick={() => setShowWhy((v) => !v)}
            className="w-full inline-flex items-center justify-between text-[12px] font-semibold text-[var(--foreground)] hover:text-[var(--scholpp-red)]"
          >
            <span>Warum Sprinter?</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${showWhy ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {showWhy && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-1.5 mt-3 text-[12px]"
              >
                {begruendungen.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <Check
                      size={13}
                      className="text-[var(--success)] shrink-0 mt-0.5"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Weniger sinnvolle Alternativen */}
      <button
        onClick={() => setShowAlternatives((v) => !v)}
        className="w-full px-5 py-3 flex items-center justify-between text-[11px] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/40 border-t border-[var(--border)] text-left"
      >
        <span>
          Andere Ansätze geprüft — weniger sinnvoll für diesen Einsatz
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform ${showAlternatives ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {showAlternatives && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--muted)]/30"
          >
            <ul className="divide-y divide-[var(--border)]">
              {alternativen.map((a) => (
                <li
                  key={a.id}
                  className="px-5 py-3 flex items-start justify-between gap-4 text-[12px]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{a.kurz}</div>
                    <div className="text-[var(--muted-foreground)] text-[11px] mt-0.5">
                      {a.begruendung}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-[var(--muted-foreground)]">
                      {formatEur(a.gesamtkosten)}
                    </div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      {a.fahrzeit} · {a.co2Kg} kg CO₂
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

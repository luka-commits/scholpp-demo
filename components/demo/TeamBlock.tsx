"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Users, MapPin } from "lucide-react";
import {
  ausgewaehlteMonteure,
  monteurAuswahlBegruendung,
  monteurAlternativenGefiltert,
} from "@/data/monteure";

export function TeamBlock() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          <Users size={12} />
          Team-Validierung · 3 Monteure · 4 harte Checks bestanden
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)]">
          Verfügbarkeit · G25 · Führerscheine · Arbeitszeit
        </div>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {ausgewaehlteMonteure.map((m) => (
          <li key={m.id} className="px-5 py-3 flex items-center gap-4">
            <div className="w-9 h-9 bg-[var(--muted)] text-[var(--foreground)] font-semibold text-[12px] flex items-center justify-center shrink-0">
              {m.kuerzel}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[14px] font-semibold tracking-[-0.01em]">
                  {m.name}
                </span>
                {m.rolle && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[var(--scholpp-red)]/10 text-[var(--scholpp-red)] font-semibold uppercase tracking-wide">
                    {m.rolle}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                  <MapPin size={10} />
                  {m.heimatort}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {m.qualifikationen.map((q) => (
                  <span
                    key={q}
                    className="text-[10px] px-1.5 py-0.5 bg-[var(--muted)] text-[var(--foreground)] font-mono"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right text-[11px] shrink-0">
              <div className="inline-flex items-center gap-1 text-[var(--success)] font-semibold">
                <Check size={11} />
                verfügbar
              </div>
              <div className="text-[var(--muted-foreground)] font-mono mt-0.5">
                G25 · {m.g25Gueltig}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-2.5 flex items-center justify-between text-[11px] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/40 border-t border-[var(--border)] text-left"
      >
        <span>Was der Agent geprüft hat</span>
        <ChevronDown
          size={13}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-[var(--muted)]/30 border-t border-[var(--border)]"
          >
            <div className="px-5 py-3">
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-2">
                Validierungs-Ergebnisse
              </div>
              <ul className="space-y-1.5 text-[12px]">
                {monteurAuswahlBegruendung.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <Check size={12} className="text-[var(--success)] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {monteurAlternativenGefiltert.length > 0 && (
                <>
                  <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mt-3 mb-2">
                    Vom PL erwogen, Agent hat geflaggt
                  </div>
                  <ul className="space-y-1 text-[11px] text-[var(--muted-foreground)]">
                    {monteurAlternativenGefiltert.map((a, i) => (
                      <li key={i}>
                        <span className="font-medium text-[var(--foreground)]">
                          {a.name}
                        </span>{" "}
                        — {a.grund}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

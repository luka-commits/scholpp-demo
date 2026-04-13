"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const schritte = [
  { label: "Roomix-Buchung erstellt", sub: "Sammelrechnung #RMX-2026-4782" },
  { label: "Monteur-Kalender aktualisiert", sub: "4 Einträge 13.–17.04." },
  { label: "Fahrzeuge reserviert (Fleet)", sub: "Sprinter #VW-318, Caddy #VW-212" },
  { label: "Bestätigungs-Mail an Thomas Koch", sub: "Audit-Log angehängt" },
];

export function SuccessState({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let t: number;
    if (idx < schritte.length) {
      t = window.setTimeout(() => setIdx(idx + 1), 500);
    } else {
      t = window.setTimeout(onDone, 900);
    }
    return () => clearTimeout(t);
  }, [idx, onDone]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex w-14 h-14 items-center justify-center bg-[var(--success)] text-white mb-5"
          >
            <Check size={28} />
          </motion.div>
          <h2 className="text-[28px] font-semibold tracking-[-0.01em]">
            Buchung abgeschlossen
          </h2>
          <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
            Der Agent erledigt die Folgeschritte automatisch.
          </p>
        </div>

        <ul className="space-y-3">
          {schritte.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <motion.li
                key={s.label}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: done || active ? 1 : 0.3 }}
                className="hairline border bg-white px-4 py-3 flex items-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {done ? (
                    <Check size={16} className="text-[var(--success)]" />
                  ) : active ? (
                    <Loader2 size={14} className="animate-spin text-[var(--muted-foreground)]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">{s.label}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {s.sub}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { aktiveAnfrage } from "@/data/anfragen";

export function ScenarioIntro({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[70vh] flex items-center justify-center bg-white"
    >
      <div className="max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-6"
        >
          Szenario
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[34px] leading-[1.15] tracking-[-0.02em] font-semibold"
        >
          Werksumzug nach Hannover.
          <br />
          Projektleiter Thomas Koch plant einen 4-Mann-Einsatz vom 13.–17.04.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-[14px] text-[var(--muted-foreground)]"
        >
          Anfrage-ID {aktiveAnfrage.id} · Baustelle Münchner Str. 45, Langenhagen
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          onClick={onDone}
          className="mt-12 inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-6 h-12 text-[14px] font-semibold transition-colors"
        >
          Inbox öffnen →
        </motion.button>
      </div>
    </motion.div>
  );
}

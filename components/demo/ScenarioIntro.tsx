"use client";

import { motion } from "framer-motion";
import { aktiveAnfrage } from "@/data/anfragen";
import { MapPin, Users, Calendar, Wrench, Info, ArrowRight } from "lucide-react";

export function ScenarioIntro({ onDone }: { onDone: () => void }) {
  const facts = [
    {
      icon: MapPin,
      label: "Einsatzort",
      value: aktiveAnfrage.baustelleAdresse,
    },
    {
      icon: Calendar,
      label: "Zeitraum",
      value: `${aktiveAnfrage.zeitraum.von} – ${aktiveAnfrage.zeitraum.bis} · ${aktiveAnfrage.zeitraum.naechte} Nächte`,
    },
    {
      icon: Users,
      label: "Team",
      value: `${aktiveAnfrage.teamGroesse} Monteure · PL Thomas Koch`,
    },
    {
      icon: Wrench,
      label: "Equipment",
      value: aktiveAnfrage.equipment.join(", "),
    },
  ];

  const assumptions = [
    "Der Projektleiter hat die Anfrage gerade in seiner Inbox.",
    "Stammdaten (Monteure, Fleet, Betriebsordnung) sind bereits angebunden.",
    "Hotels & Tarife werden live recherchiert — keine vorbefüllten Demo-Daten.",
    "Jede Buchung bleibt freigabepflichtig — der Agent entscheidet nichts allein.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/30 py-16 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-4"
        >
          Szenario · Live-Demo
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[36px] md:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-[var(--foreground)] max-w-3xl"
        >
          Werksumzug nach Hannover — Presse H-2, KUKA-Anlage.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-[16px] text-[var(--muted-foreground)] leading-[1.6] max-w-2xl"
        >
          Projektleiter Thomas Koch muss einen 4-Mann-Einsatz koordinieren: Team
          disponieren, Hotel buchen, Fahrzeuge reservieren, Betriebsordnung
          prüfen. Normalerweise 45 Minuten Arbeit über sieben Tools. Heute:
          einmal freigeben.
        </motion.p>

        {/* Fakten-Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-10 grid sm:grid-cols-2 gap-3"
        >
          {facts.map((f) => (
            <div key={f.label} className="hairline border bg-white p-5 flex gap-3 items-start">
              <div className="w-9 h-9 border border-[var(--border)] flex items-center justify-center shrink-0">
                <f.icon size={14} className="text-[var(--scholpp-red)]" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-1">
                  {f.label}
                </div>
                <div className="text-[14px] text-[var(--foreground)] leading-[1.45]">
                  {f.value}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Annahmen */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 hairline border bg-white p-6"
        >
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] font-semibold mb-4">
            <Info size={12} />
            Annahmen für die Demo
          </div>
          <ul className="space-y-2.5">
            {assumptions.map((a, i) => (
              <li key={i} className="flex gap-3 items-start text-[14px] text-[var(--foreground)] leading-[1.55]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--scholpp-red)] shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex items-center gap-4"
        >
          <button
            onClick={onDone}
            className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-6 h-12 text-[14px] font-semibold transition-colors"
          >
            Inbox öffnen
            <ArrowRight size={16} />
          </button>
          <div className="text-[12px] text-[var(--muted-foreground)]">
            Anfrage-ID {aktiveAnfrage.id} · ~3 Minuten
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

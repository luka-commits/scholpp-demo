"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { impactZahlen } from "@/data/kpis";
import { formatEur } from "@/lib/utils";
import { ArrowRight, ChevronDown, RotateCcw, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { SavingsAnimation } from "./SavingsAnimation";

export function ImpactScreen({ onReset }: { onReset: () => void }) {
  const [showCalc, setShowCalc] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/30 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero — Endframe Bild des zufriedenen Projektleiters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 overflow-hidden border border-[var(--border)] bg-white"
        >
          <Image
            src="/hero-endframe.jpg"
            alt="Projektleiter nach Freigabe — Einsatz-Reise geplant"
            width={1920}
            height={1080}
            className="w-full h-auto block"
            priority
          />
        </motion.div>

        {/* 45 min → 2 min */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-5">
            Ergebnis
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-[64px] font-bold tracking-[-0.03em] leading-none text-[var(--muted-foreground)] line-through decoration-2">
              45 min
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="origin-left"
            >
              <ArrowRight size={40} className="text-[var(--scholpp-red)]" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75 }}
              className="text-[80px] font-bold tracking-[-0.03em] leading-none text-[var(--foreground)]"
            >
              2 min
            </motion.span>
          </div>
          <p className="mt-5 text-[15px] text-[var(--muted-foreground)] max-w-xl mx-auto">
            Vom 45-Minuten-Prozess zum 2-Minuten-Freigabe-Klick — pro Buchung,
            pro Projektleiter.
          </p>
        </motion.div>

        {/* Middle — Hochrechnung + Animation */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="hairline border bg-white p-8"
          >
            <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-3">
              Hochrechnung SCHOLPP-weit
            </div>
            <div className="text-[56px] font-bold tracking-[-0.03em] leading-none text-[var(--scholpp-red)]">
              {formatEur(impactZahlen.geldGespartProJahrEur)}
            </div>
            <div className="text-[14px] text-[var(--muted-foreground)] mt-2">
              direkte Ersparnis pro Jahr
            </div>
            <button
              onClick={() => setShowCalc((v) => !v)}
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-[var(--foreground)] font-semibold hover:text-[var(--scholpp-red)] transition-colors"
            >
              Wie berechnet?
              <ChevronDown
                size={14}
                className={`transition-transform ${showCalc ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {showCalc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-[var(--border)] text-[12px] text-[var(--muted-foreground)] space-y-2 font-mono leading-relaxed">
                    <div className="flex justify-between">
                      <span>Einsätze/Jahr (Field Service)</span>
                      <span className="text-[var(--foreground)]">500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ø Ersparnis Anreise (Hotel+Fahrzeug)</span>
                      <span className="text-[var(--foreground)]">170 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ø PL-Zeit gespart (Team+Equipment+Compliance)</span>
                      <span className="text-[var(--foreground)]">110 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance-Gewinn (vermiedene Fehlbuchungen)</span>
                      <span className="text-[var(--foreground)]">100 %</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[var(--border)] font-sans text-[13px]">
                      <span className="font-semibold">Summe direkte Kosten</span>
                      <span className="font-bold">140.000 € / Jahr</span>
                    </div>
                    <div className="text-[11px] pt-2">
                      Zusätzlich {impactZahlen.stundenGespartProJahr} Stunden
                      Projektleiter-Zeit (ohne zusätzlichen Headcount).
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SavingsAnimation target={impactZahlen.geldGespartProJahrEur} />
          </motion.div>
        </div>

        {/* Bottom — CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="hairline border bg-[var(--foreground)] text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between"
        >
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold mb-3">
              Nächster Schritt
            </div>
            <h3 className="text-[26px] leading-[1.15] tracking-[-0.01em] font-semibold">
              Pilot starten — 4 Wochen, Festpreis.
            </h3>
            <p className="mt-3 text-[14px] text-white/70 leading-[1.6]">
              Wir installieren den Agent für 3 eurer Projektleiter. Go-Live in 4
              Wochen, danach Entscheidung über Rollout.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <a
              href="mailto:philippe@meisterwerk.ai?subject=SCHOLPP%20Pilot%20Einsatz-Koordinator&body=Hallo%20Philippe%2C%0A%0Awir%20m%C3%B6chten%20den%20Pilot%20starten.%20Termin%3F"
              className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-6 h-12 font-semibold text-[14px]"
            >
              <Calendar size={14} />
              Pilot-Termin vereinbaren
            </a>
            <a
              href="mailto:philippe@meisterwerk.ai"
              className="inline-flex items-center gap-2 text-[13px] text-white/70 hover:text-white justify-center"
            >
              <Mail size={12} />
              philippe@meisterwerk.ai
            </a>
          </div>
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

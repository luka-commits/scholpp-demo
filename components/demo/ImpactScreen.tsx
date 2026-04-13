"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcw, Mail, Calendar, Search, Scale, FileCheck2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function ImpactScreen({ onReset }: { onReset: () => void }) {
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

        {/* Was der Agent macht */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-3">
            Was der Agent übernimmt
          </div>
          <h2 className="text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em] font-semibold text-[var(--foreground)] max-w-3xl">
            Recherche, Vergleich und Compliance-Check — der Projektleiter entscheidet.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Search,
              title: "Recherche parallel",
              body: "Hotels, Fahrzeuge, Zertifikate und Betriebsordnung werden intern und extern gleichzeitig geprüft.",
            },
            {
              icon: Scale,
              title: "Vergleich mit Begründung",
              body: "Optionen nach Preis, Distanz und Compliance bewertet — jede Empfehlung nachvollziehbar.",
            },
            {
              icon: FileCheck2,
              title: "Freigabe-Vorschlag",
              body: "Der Projektleiter bestätigt per Klick. Jeder Schritt und jede Quelle im Audit-Log.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="hairline border bg-white p-6"
            >
              <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center mb-4">
                <item.icon size={16} className="text-[var(--scholpp-red)]" />
              </div>
              <div className="text-[15px] font-semibold text-[var(--foreground)] mb-2">
                {item.title}
              </div>
              <div className="text-[13px] text-[var(--muted-foreground)] leading-[1.6]">
                {item.body}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="hairline border bg-white p-8 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-[var(--scholpp-red)]" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[var(--foreground)] mb-2">
                Mensch im Zentrum
              </div>
              <div className="text-[14px] text-[var(--muted-foreground)] leading-[1.6] max-w-2xl">
                Der Agent bereitet vor, der Projektleiter entscheidet. Keine
                Blackbox — jede Empfehlung ist begründet, jede Quelle
                nachvollziehbar. SCHOLPPs Betriebsordnung bleibt der Rahmen,
                nicht eine Option.
              </div>
            </div>
          </div>
        </motion.div>

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

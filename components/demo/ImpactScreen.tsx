"use client";

import { motion } from "framer-motion";
import { impactZahlen } from "@/data/kpis";
import { formatEur } from "@/lib/utils";
import { Clock, TrendingUp, ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

export function ImpactScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/40 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-4">
            Ergebnis dieser Buchung
          </div>
          <h2 className="text-[36px] leading-[1.1] tracking-[-0.02em] font-semibold">
            Vom 45-Minuten-Prozess zum 2-Minuten-Freigabe-Klick.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--border)] hairline border mb-10">
          <Block
            icon={Clock}
            delay={0.1}
            label="Zeit pro Buchung"
            vorher={`${impactZahlen.zeitVorherMin} min`}
            nachher={`${impactZahlen.zeitNachherMin} min`}
            delta={`${impactZahlen.zeitErsparnisProzent} %`}
            deltaLabel="weniger Zeitaufwand"
          />
          <Block
            icon={TrendingUp}
            delay={0.25}
            label="Geld pro Buchung"
            vorher={formatEur(180)}
            nachher={formatEur(10)}
            delta={formatEur(impactZahlen.geldErsparnisProBuchungEur)}
            deltaLabel="Kostenersparnis"
          />
          <Block
            icon={ShieldCheck}
            delay={0.4}
            label="Compliance"
            vorher="≈ 82 %"
            nachher={`${impactZahlen.complianceProzent} %`}
            delta="+18 pp"
            deltaLabel="Richtlinien-Konformität"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="hairline border bg-[var(--foreground)] text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold mb-3">
              Hochrechnung SCHOLPP-weit
            </div>
            <div className="text-[26px] leading-[1.15] tracking-[-0.01em] font-semibold">
              Bei {impactZahlen.buchungenProJahr} Buchungen pro Jahr:
              <br />
              <span className="text-[var(--scholpp-red)]">
                {impactZahlen.stundenGespartProJahr} h
              </span>{" "}
              Zeit ·{" "}
              <span className="text-[var(--scholpp-red)]">
                {formatEur(impactZahlen.geldGespartProJahrEur)}
              </span>{" "}
              direkte Ersparnis
            </div>
            <div className="mt-3 text-[13px] text-white/60">
              Ohne zusätzliche Headcount-Kosten. Im gleichen Framework folgen Phase-2-Usecases.
            </div>
          </div>
          <div className="flex flex-col gap-3 md:items-end w-full md:w-auto">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 bg-white text-[var(--foreground)] px-6 h-12 font-semibold text-[14px] hover:bg-white/90"
            >
              <RotateCcw size={14} />
              Demo zurücksetzen
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] text-white/70 hover:text-white"
            >
              Zurück zur Übersicht
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Block({
  icon: Icon,
  label,
  vorher,
  nachher,
  delta,
  deltaLabel,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  vorher: string;
  nachher: string;
  delta: string;
  deltaLabel: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6"
    >
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-5">
        <Icon size={12} />
        {label}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] mb-1">
            Vorher
          </div>
          <div className="text-[22px] font-semibold line-through text-[var(--muted-foreground)]">
            {vorher}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--scholpp-red)] mb-1">
            Mit Agent
          </div>
          <div className="text-[22px] font-bold text-[var(--foreground)]">
            {nachher}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-[var(--border)]">
        <div className="text-[28px] font-bold tracking-[-0.02em] text-[var(--success)] leading-none">
          {delta}
        </div>
        <div className="text-[12px] text-[var(--muted-foreground)] mt-1">
          {deltaLabel}
        </div>
      </div>
    </motion.div>
  );
}

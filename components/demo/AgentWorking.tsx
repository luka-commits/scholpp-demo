"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { reasoningSteps, quellenMeta } from "@/data/reasoning-steps";
import { sourceCards } from "@/data/sourceCards";
import { SourceCard, type SourceStatus } from "./SourceCard";

const TOTAL_DURATION = 7200; // ms — muss ≥ max(card.delay + card.dauer) sein

export function AgentWorking({ onDone }: { onDone: () => void }) {
  const [visibleIdx, setVisibleIdx] = useState(0);
  const [completedIdx, setCompletedIdx] = useState(-1);
  const [elapsed, setElapsed] = useState(0);

  // Reasoning log
  useEffect(() => {
    let canceled = false;
    let cumulative = 300;

    reasoningSteps.forEach((step, i) => {
      setTimeout(() => {
        if (canceled) return;
        setVisibleIdx(i + 1);
      }, cumulative);
      cumulative += step.dauer;
      setTimeout(() => {
        if (canceled) return;
        setCompletedIdx(i);
      }, cumulative);
    });

    setTimeout(() => {
      if (!canceled) onDone();
    }, TOTAL_DURATION + 900);

    return () => {
      canceled = true;
    };
  }, [onDone]);

  // Elapsed ticker for source-card status
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      setElapsed(t - start);
      if (t - start < TOTAL_DURATION + 500) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const getStatus = (delay: number, dauer: number): SourceStatus => {
    if (elapsed < delay) return "wartend";
    if (elapsed < delay + dauer) return "scanning";
    return "fertig";
  };

  const getVisibleSnippets = (delay: number, dauer: number, total: number) => {
    if (elapsed < delay) return 0;
    const p = Math.min(1, (elapsed - delay) / dauer);
    return Math.min(total, Math.ceil(p * total));
  };

  const aktive = sourceCards.filter((c) => !c.inaktiv);
  const scannedCount = aktive.filter(
    (c) => elapsed >= c.delay + c.dauer
  ).length;
  const activeCount = aktive.filter(
    (c) => elapsed >= c.delay && elapsed < c.delay + c.dauer
  ).length;
  const internCount = aktive.filter((c) => c.typ === "intern").length;
  const externCount = aktive.filter((c) => c.typ === "extern").length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/40 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold">
            <Loader2 size={12} className="animate-spin" />
            Agent recherchiert · {aktive.length} Quellen parallel
          </div>
          <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.01em]">
            Research-Cockpit · transparent & nachvollziehbar
          </h2>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4">
          {/* Left: Reasoning log */}
          <div className="hairline border bg-[#0f0f10] text-white font-mono text-[12px] p-5 min-h-[440px]">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10 text-[11px] text-white/60">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              <span className="ml-2">scholpp-agent · reasoning.log</span>
            </div>
            <ul className="space-y-2.5">
              <AnimatePresence>
                {reasoningSteps.slice(0, visibleIdx).map((step, i) => {
                  const q = step.quelle ? quellenMeta[step.quelle] : null;
                  const done = i <= completedIdx;
                  return (
                    <motion.li
                      key={step.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="mt-[2px] w-4 h-4 flex items-center justify-center shrink-0">
                        {done ? (
                          <Check size={13} className="text-[#28c840]" />
                        ) : (
                          <Loader2 size={11} className="animate-spin text-white/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-white/50 text-[10px]">
                            [{String(i + 1).padStart(2, "0")}]
                          </span>
                          <span className="text-white">{step.label}</span>
                          {q && (
                            <span
                              className="text-[9px] px-1.5 py-0.5 uppercase tracking-wide"
                              style={{ backgroundColor: q.farbe, color: "white" }}
                            >
                              {q.label}
                            </span>
                          )}
                        </div>
                        {step.detail && (
                          <div className="text-white/50 text-[11px] mt-0.5">
                            {step.detail}
                          </div>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>

          {/* Right: Source cards grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                Quellen-Scan
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={11} className="text-[var(--scholpp-red)]" />
                  {internCount} intern
                </span>
                <span>· {externCount} extern · 1 optional</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sourceCards.map((c) => (
                <SourceCard
                  key={c.id}
                  card={c}
                  status={getStatus(c.delay, c.dauer)}
                  visibleSnippets={getVisibleSnippets(
                    c.delay,
                    c.dauer,
                    c.snippets.length
                  )}
                />
              ))}
            </div>

            {/* Counter bar */}
            <div className="hairline border bg-white mt-3 px-4 py-2.5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-4 text-[var(--muted-foreground)]">
                <span>
                  <b className="text-[var(--foreground)]">{scannedCount}</b>/
                  {aktive.length} Quellen gescannt
                </span>
                {activeCount > 0 && (
                  <span className="text-[var(--scholpp-red)]">
                    {activeCount} aktiv…
                  </span>
                )}
              </div>
              <div className="font-mono text-[var(--muted-foreground)]">
                5 Monteure · 7 Hotel-Portale · 6 Zertifikate · 11 Richtlinien
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-[var(--muted-foreground)] mt-4">
          Jeder Schritt inkl. Quelle ist im Audit-Log gespeichert.
        </div>
      </div>
    </div>
  );
}

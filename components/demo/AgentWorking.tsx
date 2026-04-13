"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { reasoningSteps, quellenMeta } from "@/data/reasoning-steps";

export function AgentWorking({ onDone }: { onDone: () => void }) {
  const [visibleIdx, setVisibleIdx] = useState(0);
  const [completedIdx, setCompletedIdx] = useState(-1);

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
    }, cumulative + 700);

    return () => {
      canceled = true;
    };
  }, [onDone]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/40 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--scholpp-red)] font-semibold">
            <Loader2 size={12} className="animate-spin" />
            Agent arbeitet
          </div>
          <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.01em]">
            Reasoning-Log · transparent & nachvollziehbar
          </h2>
        </div>

        <div className="hairline border bg-[#0f0f10] text-white font-mono text-[13px] p-6 min-h-[420px]">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/10 text-[11px] text-white/60">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-2">scholpp-agent · reasoning.log</span>
          </div>
          <ul className="space-y-3">
            <AnimatePresence>
              {reasoningSteps.slice(0, visibleIdx).map((step, i) => {
                const q = step.quelle ? quellenMeta[step.quelle] : null;
                const done = i <= completedIdx;
                return (
                  <motion.li
                    key={step.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-[2px] w-4 h-4 flex items-center justify-center">
                      {done ? (
                        <Check size={14} className="text-[#28c840]" />
                      ) : (
                        <Loader2 size={12} className="animate-spin text-white/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-white/50 text-[11px]">
                          [{String(i + 1).padStart(2, "0")}]
                        </span>
                        <span className="text-white">{step.label}</span>
                        {q && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 uppercase tracking-wide"
                            style={{ backgroundColor: q.farbe, color: "white" }}
                          >
                            {q.label}
                          </span>
                        )}
                      </div>
                      {step.detail && (
                        <div className="text-white/50 text-[12px] mt-0.5">
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
        <div className="text-center text-[12px] text-[var(--muted-foreground)] mt-4">
          Jeder Schritt inkl. Quelle ist im Audit-Log gespeichert.
        </div>
      </div>
    </div>
  );
}

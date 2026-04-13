"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Lock, Globe } from "lucide-react";
import type { SourceCardDef } from "@/data/sourceCards";

export type SourceStatus = "wartend" | "scanning" | "fertig";

export function SourceCard({
  card,
  status,
  visibleSnippets,
}: {
  card: SourceCardDef;
  status: SourceStatus;
  visibleSnippets: number;
}) {
  const isIntern = card.typ === "intern";
  const isInaktiv = card.inaktiv === true;
  return (
    <div
      className={`hairline border bg-white p-3 relative overflow-hidden transition-colors ${
        status === "scanning" ? "border-[var(--scholpp-red)]" : ""
      } ${isInaktiv ? "opacity-50" : ""}`}
    >
      {/* Scanning sweep */}
      {status === "scanning" && (
        <motion.div
          className="absolute inset-x-0 top-0 h-[2px] bg-[var(--scholpp-red)]"
          initial={{ y: 0, opacity: 0.6 }}
          animate={{ y: 90, opacity: 0.9 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isIntern ? (
            <Lock size={11} className="text-[var(--scholpp-red)] shrink-0" />
          ) : (
            <Globe size={11} className="text-[var(--muted-foreground)] shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-[12px] font-semibold truncate">{card.name}</div>
            <div className="font-mono text-[10px] text-[var(--muted-foreground)] truncate">
              {card.domain}
            </div>
          </div>
        </div>
        <StatusDot status={status} />
      </div>

      <div className="min-h-[54px] text-[11px] text-[var(--muted-foreground)] leading-relaxed">
        <AnimatePresence initial={false}>
          {card.snippets.slice(0, visibleSnippets).map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono truncate"
            >
              · {s}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isInaktiv && (
        <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] italic">
          {card.ergebnis}
        </div>
      )}
      {!isInaktiv && status === "fertig" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 pt-2 border-t border-[var(--border)] flex items-center gap-1.5 text-[11px] font-semibold text-[var(--success)]"
        >
          <Check size={11} />
          {card.ergebnis}
        </motion.div>
      )}

      {isIntern && (
        <div className="absolute top-1 right-1 text-[8px] uppercase tracking-wide font-mono text-[var(--scholpp-red)]/70 pointer-events-none">
          intern
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: SourceStatus }) {
  if (status === "wartend") {
    return (
      <span className="w-2 h-2 rounded-full bg-[var(--border-strong)] shrink-0" />
    );
  }
  if (status === "scanning") {
    return (
      <Loader2
        size={12}
        className="animate-spin text-[var(--scholpp-red)] shrink-0"
      />
    );
  }
  return <Check size={12} className="text-[var(--success)] shrink-0" />;
}

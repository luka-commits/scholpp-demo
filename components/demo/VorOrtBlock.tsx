"use client";

import { Building2, Check, Info } from "lucide-react";
import { vorOrtChecks } from "@/data/werkschutz";

export function VorOrtBlock() {
  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          <Building2 size={12} />
          Vor-Ort-Setup · Kundenseite vorbereitet
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)]">
          KUKA-Werk Langenhagen · Halle H-2
        </div>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {vorOrtChecks.map((v, i) => (
          <li key={i} className="px-5 py-2.5 flex items-start gap-2.5 text-[12px]">
            <div className="mt-0.5 shrink-0">
              {v.status === "info" ? (
                <Info size={13} className="text-[var(--muted-foreground)]" />
              ) : (
                <Check size={13} className="text-[var(--success)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{v.label}</div>
              <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                {v.detail}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

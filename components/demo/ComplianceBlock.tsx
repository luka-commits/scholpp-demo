"use client";

import { Check, Minus, ShieldCheck } from "lucide-react";
import { complianceChecks } from "@/data/compliance-checks";
import { betriebsordnung } from "@/data/betriebsordnung";

export function ComplianceBlock() {
  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          <ShieldCheck size={12} />
          Reiseregeln & Tarif · alle Checks bestanden
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)]">
          Betriebsordnung {betriebsordnung.version} · Tarif Sächs. Verkehrsgewerbe · DRV
        </div>
      </div>
      <div className="grid md:grid-cols-2">
        <ul className="divide-y divide-[var(--border)] md:border-r md:border-[var(--border)]">
          {complianceChecks.map((c) => (
            <li key={c.id} className="px-5 py-2 flex items-start gap-2.5 text-[12px]">
              <div className="mt-0.5 shrink-0">
                {c.status === "ok" ? (
                  <Check size={13} className="text-[var(--success)]" />
                ) : c.status === "n/a" ? (
                  <Minus size={13} className="text-[var(--muted-foreground)]" />
                ) : (
                  <Check size={13} className="text-[#c4820a]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{c.label}</div>
                <div className={`text-[11px] mt-0.5 ${c.status === "n/a" ? "text-[var(--muted-foreground)] italic" : "text-[var(--muted-foreground)]"}`}>
                  {c.detail}
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--muted-foreground)] shrink-0">
                {c.quelle}
              </div>
            </li>
          ))}
        </ul>
        <ul className="divide-y divide-[var(--border)]">
          {betriebsordnung.regeln.map((r) => (
            <li key={r.id} className="px-5 py-2 flex items-center gap-2.5 text-[12px]">
              <Check size={13} className="text-[var(--success)] shrink-0" />
              <span className="font-mono text-[10px] text-[var(--muted-foreground)] w-8 shrink-0">
                {r.id}
              </span>
              <span className="flex-1">{r.regel}</span>
              <span className="text-[10px] text-[var(--muted-foreground)] font-mono shrink-0">
                {r.kurz}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

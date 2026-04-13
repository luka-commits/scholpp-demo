"use client";

import { Scale } from "lucide-react";
import { useMemo } from "react";
import { aktiveAnfrage } from "@/data/anfragen";
import { ausgewaehlteMonteure } from "@/data/monteure";
import { useRouteOptimization } from "@/lib/use-route-optimization";

function fmtMin(min: number): string {
  if (!isFinite(min)) return "–";
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function NlComparisonBlock() {
  const monteurIds = useMemo(
    () => ausgewaehlteMonteure.map((m) => m.id),
    [],
  );
  const { data, loading, error } = useRouteOptimization(
    aktiveAnfrage.id,
    monteurIds,
  );

  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          <Scale size={12} />
          NL-Vergleich · Total-Cost-Heuristik
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Sprinter + Σ Monteur-Zugang
        </div>
      </div>

      {loading && !data && (
        <div className="px-5 py-4 text-[12px] text-[var(--muted-foreground)]">
          Agent vergleicht Kandidaten-NL…
        </div>
      )}

      {error && !data && (
        <div className="px-5 py-4 text-[12px] text-red-700">
          Fehler beim Laden: {error}
        </div>
      )}

      {data && (
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] border-b border-[var(--border)]">
                <th className="px-5 py-2 font-semibold">Niederlassung</th>
                <th className="px-3 py-2 font-semibold text-right font-mono">
                  t_sprinter
                </th>
                <th className="px-3 py-2 font-semibold text-right font-mono">
                  Σ Monteur-Zugang
                </th>
                <th className="px-3 py-2 font-semibold text-right font-mono">
                  Total
                </th>
                <th className="px-5 py-2 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data.kandidaten.map((k) => (
                <tr
                  key={k.id}
                  className={
                    k.gewaehlt ? "bg-amber-50/60" : "hover:bg-[var(--muted)]/30"
                  }
                >
                  <td className="px-5 py-2.5 font-medium">{k.stadt}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[var(--muted-foreground)]">
                    {fmtMin(k.tSprinterMin)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[var(--muted-foreground)]">
                    {fmtMin(k.summeMonteurZugangMin)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold">
                    {fmtMin(k.totalCostMin)}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    {k.gewaehlt ? (
                      <span className="inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 font-semibold bg-[#f5c242] text-[#3a2700]">
                        gewählt
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <div className="px-5 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--muted-foreground)] italic leading-relaxed">
          {data.startNl.begruendung}
        </div>
      )}
    </div>
  );
}

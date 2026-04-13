"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";
import { aktiveAnfrage } from "@/data/anfragen";
import { ausgewaehlteMonteure } from "@/data/monteure";
import { ANREISE_LABEL, type AnreiseStrategie } from "@/lib/route-optimizer";
import { useRouteOptimization } from "@/lib/use-route-optimization";

const STRATEGIE_FARBE: Record<AnreiseStrategie, string> = {
  sprinter_fahrer: "bg-[var(--scholpp-red)] text-white",
  pickup_on_route: "bg-[#f5c242] text-[#3a2700]",
  zum_hub_mitfahren: "bg-[#f5c242] text-[#3a2700]",
  direkt: "bg-[#5a5a5a] text-white",
  bahn_direkt: "bg-[#1e6fff] text-white",
};

function fmtMin(min: number): string {
  if (!isFinite(min)) return "–";
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function StrategyBlock() {
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
          <Users size={12} />
          Anreise pro Monteur · Regel-Engine
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Quelle: Routes Matrix · live
        </div>
      </div>

      {loading && !data && (
        <div className="px-5 py-4 text-[12px] text-[var(--muted-foreground)]">
          Agent berechnet Anreise-Strategien…
        </div>
      )}

      {error && !data && (
        <div className="px-5 py-4 text-[12px] text-red-700">
          Fehler beim Laden: {error}
        </div>
      )}

      {data && (
        <ul className="divide-y divide-[var(--border)]">
          {data.strategien.map((s) => {
            const m = ausgewaehlteMonteure.find((mm) => mm.id === s.monteurId);
            if (!m) return null;
            return (
              <li
                key={s.monteurId}
                className="px-5 py-3 grid grid-cols-[40px_1fr_auto] gap-3 items-start"
              >
                <span className="w-8 h-8 rounded-full bg-[var(--scholpp-red)] text-white font-semibold text-[11px] flex items-center justify-center">
                  {m.kuerzel}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium leading-tight">
                    {m.name}
                    <span className="text-[var(--muted-foreground)] font-normal ml-1.5">
                      · {m.heimatort}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                    {s.begruendung}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--muted-foreground)] mt-1">
                    direkt {fmtMin(s.metriken.tDirektMin)} · zum Hub{" "}
                    {fmtMin(s.metriken.tHubMin)} · Korridor-Umweg{" "}
                    {fmtMin(s.metriken.korridorUmwegMin)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] uppercase tracking-wide px-2 py-0.5 font-semibold ${STRATEGIE_FARBE[s.strategie]}`}
                  >
                    {ANREISE_LABEL[s.strategie]}
                  </span>
                  <div className="text-[11px] font-mono mt-1">
                    {fmtMin(s.fahrzeitMin)}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {data && (
        <div className="px-5 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--muted-foreground)] italic">
          Sprinter-Start: <strong>{data.startNl.stadt}</strong> ·{" "}
          {data.startNl.begruendung}
        </div>
      )}
    </div>
  );
}

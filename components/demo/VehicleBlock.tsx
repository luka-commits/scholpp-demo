import { fahrzeugOptionen } from "@/data/fahrzeuge";
import { formatEur } from "@/lib/utils";
import { Check, Truck } from "lucide-react";

export function VehicleBlock() {
  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          <Truck size={12} />
          Fahrzeug-Optionen
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Quellen: SCHOLPP Fleet · ADAC
        </div>
      </div>
      <div className="grid md:grid-cols-3 divide-x divide-[var(--border)]">
        {fahrzeugOptionen.map((f) => (
          <div
            key={f.id}
            className={`p-5 relative ${
              f.empfohlen ? "bg-[var(--scholpp-red)]/[0.04]" : ""
            }`}
          >
            {f.empfohlen && (
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--scholpp-red)]" />
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[var(--muted-foreground)]">
                {f.name}
              </div>
              {f.empfohlen && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-[var(--scholpp-red)] text-white px-1.5 py-0.5 font-semibold uppercase tracking-wide">
                  <Check size={10} />
                  Empfehlung
                </span>
              )}
            </div>
            <div className="text-[15px] font-semibold tracking-[-0.01em] mb-3">
              {f.kurz}
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[28px] font-bold tracking-[-0.02em]">
                {formatEur(f.gesamtkosten)}
              </span>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                gesamt
              </span>
            </div>
            <ul className="space-y-1.5 text-[12px] text-[var(--muted-foreground)] mb-3">
              {f.fahrzeuge.map((v, i) => (
                <li key={i}>
                  {v.anzahl}× {v.typ} — {formatEur(v.kosten)}
                </li>
              ))}
            </ul>
            <div className="text-[12px] text-[var(--muted-foreground)] space-y-1 border-t border-[var(--border)] pt-3">
              <div>Fahrzeit: {f.fahrzeit}</div>
              <div>CO₂: {f.co2Kg} kg</div>
            </div>
            {f.begruendung && (
              <div
                className={`text-[12px] mt-3 leading-snug ${
                  f.empfohlen ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                }`}
              >
                {f.begruendung}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

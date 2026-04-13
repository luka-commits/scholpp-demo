"use client";

import { AlertTriangle, Check, Wrench } from "lucide-react";
import { equipmentInventory, equipmentSummary } from "@/data/equipment-inventory";

export function EquipmentBlock() {
  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          <Wrench size={12} />
          Equipment · {equipmentInventory.length} Items disponiert
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Gesamt {equipmentSummary.gesamtGewichtKg} kg · Pickup {equipmentSummary.pickupDepot}
        </div>
      </div>
      <ul className="divide-y divide-[var(--border)]">
        {equipmentInventory.map((e) => (
          <li key={e.id} className="px-5 py-2.5 flex items-center gap-3">
            <div className="shrink-0">
              {e.status === "verfuegbar" ? (
                <Check size={14} className="text-[var(--success)]" />
              ) : (
                <AlertTriangle size={14} className="text-[#c4820a]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[13px] font-medium">{e.name}</span>
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                  {e.gewichtKg} kg · Prüfplakette {e.pruefplaketteGueltig}
                </span>
              </div>
              {e.status === "konflikt" && (
                <div className="text-[11px] text-[#c4820a] mt-0.5">
                  Konflikt: {e.konfliktDetail}
                </div>
              )}
              {e.ersatzVorschlag && (
                <div className="text-[11px] text-[var(--success)] mt-0.5">
                  → {e.ersatzVorschlag}
                </div>
              )}
            </div>
            <div className="text-[10px] font-mono text-[var(--muted-foreground)] shrink-0">
              {e.standort}
            </div>
          </li>
        ))}
      </ul>
      <div className="px-5 py-2.5 border-t border-[var(--border)] bg-[var(--muted)]/30 text-[11px] text-[var(--muted-foreground)]">
        Transport-Empfehlung: <span className="text-[var(--foreground)] font-medium">{equipmentSummary.transportEmpfehlung}</span>
      </div>
    </div>
  );
}

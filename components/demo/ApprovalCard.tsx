"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Edit3,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { rankedHotels } from "@/data/scoring";
import { hotels } from "@/data/hotels";
import { betriebsordnung } from "@/data/betriebsordnung";
import { scoringKriterien } from "@/data/scoring";
import { reasoningSteps, quellenMeta } from "@/data/reasoning-steps";
import { formatEur } from "@/lib/utils";
import { aktiveAnfrage } from "@/data/anfragen";
import { RouteMap } from "./RouteMap";
import { VehicleBlock } from "./VehicleBlock";
import { KPISidebar } from "./KPISidebar";
import { empfohleneFahrzeugOption, ersparnisFahrzeug } from "@/data/fahrzeuge";
import { NewRequestToast } from "./NewRequestToast";

const quelleToSourceMap: Record<string, string> = {
  roomix: "Roomix",
  booking: "booking.com",
  hrs: "hrs.de",
  direct: "Direkt",
};

export function ApprovalCard({ onApprove }: { onApprove: () => void }) {
  const [showAudit, setShowAudit] = useState(false);
  const [showGefiltert, setShowGefiltert] = useState(false);

  const top = rankedHotels[0];
  const gefiltert = hotels.filter((h) => !h.erfuelltRichtlinie);
  const gesamtErsparnis =
    ersparnisFahrzeug + (110 - top.hotel.preisProNacht) * 4 * aktiveAnfrage.teamGroesse;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--muted)]/40">
      <NewRequestToast />
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-[1fr_300px] gap-6">
        {/* Main */}
        <div className="space-y-6 min-w-0">
          {/* Header */}
          <div className="hairline border bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-mono text-[11px] text-[var(--muted-foreground)] mb-1">
                  {aktiveAnfrage.id} · Vorschlag erstellt um 08:43:12
                </div>
                <h1 className="text-[26px] font-semibold tracking-[-0.01em] leading-tight">
                  Vorschlag: Hannover-Einsatz 13.–17.04.
                </h1>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-1">
                  Geschätzte Ersparnis
                </div>
                <div className="text-[24px] font-bold tracking-[-0.02em] text-[var(--success)]">
                  {formatEur(gesamtErsparnis)}
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  vs. Status-Quo-Buchung
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[13px] text-[var(--muted-foreground)]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--success)]" />
                100 % richtlinienkonform
              </span>
              <span>14 Hotels geprüft · 9 gefiltert</span>
              <span>3 Fahrzeug-Szenarien</span>
              <span>9 Reasoning-Schritte</span>
            </div>
          </div>

          {/* Hotel comparison */}
          <div className="hairline border bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                Hotel-Vergleich · Top 4 (richtlinienkonform)
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-[var(--muted)]/50">
                  <tr className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)] text-left">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Hotel</th>
                    <th className="px-4 py-3 font-semibold text-right">Preis/Nacht</th>
                    <th className="px-4 py-3 font-semibold text-right">Distanz</th>
                    <th className="px-4 py-3 font-semibold text-right">Bewertung</th>
                    <th className="px-4 py-3 font-semibold">Quelle</th>
                    <th className="px-4 py-3 font-semibold text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedHotels.map((r, i) => {
                    const isTop = i === 0;
                    return (
                      <tr
                        key={r.hotel.id}
                        className={`border-t border-[var(--border)] ${
                          isTop ? "bg-[var(--scholpp-red)]/[0.04]" : ""
                        }`}
                      >
                        <td className="px-4 py-3 relative">
                          {isTop && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--scholpp-red)]" />
                          )}
                          <span className="font-mono text-[12px] font-semibold">
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{r.hotel.name}</div>
                          <div className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1.5 mt-0.5">
                            <span className="flex items-center">
                              {Array.from({ length: r.hotel.sterne }).map((_, s) => (
                                <Star
                                  key={s}
                                  size={10}
                                  className="fill-[#f5c242] text-[#f5c242]"
                                />
                              ))}
                            </span>
                            · {r.hotel.stadt}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-semibold">
                            {formatEur(r.hotel.preisProNacht)}
                          </div>
                          {r.hotel.alternativeQuellen.length > 0 && (
                            <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                              alt. {formatEur(
                                Math.min(
                                  ...r.hotel.alternativeQuellen.map((a) => a.preis)
                                )
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-[12px]">
                          {r.hotel.entfernungKm} km
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold">
                            {r.hotel.bewertungSchnitt}
                          </span>
                          <span className="text-[10px] text-[var(--muted-foreground)] ml-1">
                            ({r.hotel.bewertungAnzahl})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-[10px] px-1.5 py-0.5 uppercase tracking-wide text-white font-semibold"
                            style={{
                              backgroundColor:
                                r.hotel.quelle === "roomix"
                                  ? "#e00028"
                                  : r.hotel.quelle === "booking"
                                  ? "#1d4ed8"
                                  : r.hotel.quelle === "hrs"
                                  ? "#ea580c"
                                  : "#646464",
                            }}
                          >
                            {quelleToSourceMap[r.hotel.quelle] || r.hotel.quelle}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-mono text-[14px] font-bold ${
                              isTop ? "text-[var(--scholpp-red)]" : ""
                            }`}
                          >
                            {r.score.gesamt}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Filtered expandable */}
            <button
              onClick={() => setShowGefiltert((v) => !v)}
              className="w-full px-5 py-3 border-t border-[var(--border)] flex items-center justify-between text-[12px] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/40"
            >
              <span>
                {gefiltert.length} weitere Hotels durch Richtlinie ausgeschlossen
              </span>
              {showGefiltert ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showGefiltert && (
              <div className="border-t border-[var(--border)] bg-[var(--muted)]/30">
                <ul className="divide-y divide-[var(--border)]">
                  {gefiltert.map((h) => (
                    <li
                      key={h.id}
                      className="px-5 py-2.5 flex items-center justify-between text-[12px]"
                    >
                      <div>
                        <span className="font-medium">{h.name}</span>
                        <span className="text-[var(--muted-foreground)] ml-2">
                          {formatEur(h.preisProNacht)} · {h.entfernungKm} km · {h.sterne}★
                        </span>
                      </div>
                      <span className="text-[var(--scholpp-red)] text-[11px]">
                        {h.gefilterterGrund}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Warum #1 + Route */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 hairline border bg-white">
              <div className="px-5 py-3 border-b border-[var(--border)] text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                Warum Empfehlung #1?
              </div>
              <div className="p-5">
                <div className="text-[14px] font-semibold mb-1">
                  {top.hotel.name}
                </div>
                <div className="text-[12px] text-[var(--muted-foreground)] mb-4">
                  Score {top.score.gesamt} / 10
                </div>
                <ul className="space-y-3">
                  {scoringKriterien.map((k) => {
                    const score = top.score.breakdown[k.key];
                    const pct = (score / 10) * 100;
                    return (
                      <li key={k.key}>
                        <div className="flex items-center justify-between text-[12px] mb-1">
                          <span>
                            {k.label}{" "}
                            <span className="text-[var(--muted-foreground)]">
                              ({(k.gewicht * 100).toFixed(0)} %)
                            </span>
                          </span>
                          <span className="font-mono font-semibold">
                            {score}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[var(--muted)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--scholpp-red)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {top.hotel.kommentar && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)] text-[12px] text-[var(--muted-foreground)] leading-relaxed">
                    {top.hotel.kommentar}
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-3">
              <RouteMap />
            </div>
          </div>

          {/* Richtlinien */}
          <div className="hairline border bg-white">
            <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                <ShieldCheck size={12} />
                Betriebsordnung {betriebsordnung.version} · angewandte Regeln
              </div>
              <div className="text-[11px] text-[var(--muted-foreground)]">
                gültig seit {betriebsordnung.gueltigSeit}
              </div>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {betriebsordnung.regeln.map((r) => (
                <li key={r.id} className="px-5 py-2.5 flex items-center gap-3 text-[13px]">
                  <Check size={14} className="text-[var(--success)] shrink-0" />
                  <span className="font-mono text-[11px] text-[var(--muted-foreground)] w-8">
                    {r.id}
                  </span>
                  <span className="flex-1">{r.regel}</span>
                  <span className="text-[11px] text-[var(--muted-foreground)] font-mono">
                    {r.kurz}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle */}
          <VehicleBlock />

          {/* Audit log */}
          <div className="hairline border bg-white">
            <button
              onClick={() => setShowAudit((v) => !v)}
              className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-[var(--muted)]/40"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
                <FileText size={12} />
                Audit-Log · {reasoningSteps.length} Schritte, 6 Quellen
              </div>
              {showAudit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showAudit && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-[var(--border)]"
                >
                  <ul className="divide-y divide-[var(--border)]">
                    {reasoningSteps.map((s, i) => {
                      const q = s.quelle ? quellenMeta[s.quelle] : null;
                      return (
                        <li
                          key={s.id}
                          className="px-5 py-2.5 flex items-start gap-3 text-[12px]"
                        >
                          <span className="font-mono text-[11px] text-[var(--muted-foreground)] w-6">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium">{s.label}</div>
                            {s.detail && (
                              <div className="text-[var(--muted-foreground)] mt-0.5">
                                {s.detail}
                              </div>
                            )}
                          </div>
                          {q && (
                            <span
                              className="text-[9px] px-1.5 py-0.5 uppercase tracking-wide text-white font-semibold shrink-0"
                              style={{ backgroundColor: q.farbe }}
                            >
                              {q.label}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="hairline border bg-white sticky bottom-0 p-4 flex items-center justify-between z-20">
            <div className="text-[12px] text-[var(--muted-foreground)]">
              Human-in-the-Loop · Projektleiter behält Entscheidung
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 h-11 px-5 border border-[var(--border-strong)] text-[13px] font-semibold hover:bg-[var(--muted)]">
                <X size={14} />
                Ablehnen
              </button>
              <button className="inline-flex items-center gap-2 h-11 px-5 border border-[var(--border-strong)] text-[13px] font-semibold hover:bg-[var(--muted)]">
                <Edit3 size={14} />
                Anpassen
              </button>
              <button
                onClick={onApprove}
                className="inline-flex items-center gap-2 h-11 px-6 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white text-[13px] font-semibold"
              >
                <Check size={14} />
                Buchen & Freigeben
              </button>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="hidden md:block">
          <KPISidebar />
          <div className="mt-4 hairline border bg-white p-4">
            <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-2">
              Empfehlungs-Summary
            </div>
            <ul className="space-y-2 text-[12px]">
              <li className="flex justify-between gap-2">
                <span className="text-[var(--muted-foreground)]">Hotel</span>
                <span className="font-medium text-right">{top.hotel.name.slice(0, 24)}…</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Nächte × Zi.</span>
                <span className="font-medium">{aktiveAnfrage.zeitraum.naechte} × 4</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Hotelkosten</span>
                <span className="font-medium">
                  {formatEur(top.hotel.preisProNacht * aktiveAnfrage.zeitraum.naechte * 4)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Fahrzeug</span>
                <span className="font-medium">{empfohleneFahrzeugOption.kurz}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Fahrtkosten</span>
                <span className="font-medium">{formatEur(empfohleneFahrzeugOption.gesamtkosten)}</span>
              </li>
              <li className="flex justify-between pt-2 mt-1 border-t border-[var(--border)]">
                <span className="font-semibold">Gesamt</span>
                <span className="font-bold">
                  {formatEur(
                    top.hotel.preisProNacht * aktiveAnfrage.zeitraum.naechte * 4 +
                      empfohleneFahrzeugOption.gesamtkosten
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

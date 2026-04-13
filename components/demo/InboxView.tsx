"use client";

import { anfragen, aktiveAnfrage } from "@/data/anfragen";
import { ArrowRight, Calendar, MapPin, Package, Users, AlertCircle } from "lucide-react";

export function InboxView({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid grid-cols-[320px_1fr] min-h-[calc(100vh-64px)] bg-white">
      {/* Inbox Sidebar */}
      <aside className="border-r border-[var(--border)] bg-[var(--muted)]/40">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
            Inbox
          </div>
          <div className="mt-1 text-[18px] font-semibold">{anfragen.length} Anfragen</div>
        </div>
        <ul>
          {anfragen.map((a) => {
            const isActive = a.id === aktiveAnfrage.id;
            return (
              <li
                key={a.id}
                className={`px-5 py-4 border-b border-[var(--border)] cursor-pointer ${
                  isActive
                    ? "bg-white border-l-2 border-l-[var(--scholpp-red)]"
                    : "hover:bg-white/70 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                    {a.id}
                  </span>
                  {a.prioritaet === "hoch" && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[var(--scholpp-red)] font-semibold uppercase tracking-wide">
                      <AlertCircle size={10} />
                      Hoch
                    </span>
                  )}
                </div>
                <div className="text-[13px] font-semibold leading-snug mb-1">
                  {a.projekt}
                </div>
                <div className="text-[12px] text-[var(--muted-foreground)]">
                  {a.projektleiter} · {a.ort}
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
                  {a.eingegangenAm}
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Request Detail */}
      <section className="overflow-auto">
        <div className="max-w-3xl mx-auto px-10 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-mono text-[11px] text-[var(--muted-foreground)] mb-1">
                {aktiveAnfrage.id} · Eingegangen {aktiveAnfrage.eingegangenAm}
              </div>
              <h1 className="text-[28px] font-semibold tracking-[-0.01em] leading-tight">
                {aktiveAnfrage.projekt}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[var(--scholpp-red)] text-white flex items-center justify-center text-[12px] font-bold">
                {aktiveAnfrage.projektleiterKuerzel}
              </div>
              <div className="text-[13px]">
                <div className="font-medium">{aktiveAnfrage.projektleiter}</div>
                <div className="text-[var(--muted-foreground)] text-[11px]">Projektleiter</div>
              </div>
            </div>
          </div>

          <div className="hairline border bg-white">
            <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
              <Field
                icon={MapPin}
                label="Baustelle"
                value={aktiveAnfrage.baustelleAdresse}
              />
              <Field
                icon={Calendar}
                label="Zeitraum"
                value={`${aktiveAnfrage.zeitraum.von} – ${aktiveAnfrage.zeitraum.bis} (${aktiveAnfrage.zeitraum.naechte} Nächte)`}
              />
            </div>
            <div className="grid grid-cols-2 divide-x divide-[var(--border)] border-t border-[var(--border)]">
              <Field
                icon={Users}
                label="Team-Größe"
                value={`${aktiveAnfrage.teamGroesse} Monteure`}
              />
              <Field
                icon={Package}
                label="Equipment"
                value={aktiveAnfrage.equipment.join(" · ")}
              />
            </div>
            {aktiveAnfrage.sonderwuensche && (
              <div className="border-t border-[var(--border)] p-6">
                <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-2">
                  Sonderwünsche
                </div>
                <div className="text-[14px] text-[var(--foreground)] leading-relaxed">
                  {aktiveAnfrage.sonderwuensche}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="text-[13px] text-[var(--muted-foreground)]">
              Strukturierte Eingabe via Projektleiter-Formular · bereit für Agent-Verarbeitung
            </div>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-6 h-12 font-semibold text-[14px] transition-colors"
            >
              Agent starten
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-2">
        <Icon size={12} />
        {label}
      </div>
      <div className="text-[14px] leading-relaxed">{value}</div>
    </div>
  );
}

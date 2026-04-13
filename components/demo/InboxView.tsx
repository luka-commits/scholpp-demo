"use client";

import { useState } from "react";
import { anfragen, aktiveAnfrage } from "@/data/anfragen";
import {
  ArrowRight,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
  Package,
  Hotel,
  Truck,
  Sparkles,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const equipmentOptionen = [
  "Schwerlastgeschirr 2t",
  "Hydraulikwerkzeug-Set",
  "Laser-Nivelliergerät",
  "Kran-Ausrüstung",
  "Präzisionswerkzeug",
  "Standard-Werkzeug",
];

const qualifikationOptionen = [
  "Kran-Schein",
  "Schweißer-Zert",
  "Hydraulik",
  "Höhenzugang",
  "Elektrofachkraft",
  "Stapler",
];

export function InboxView({ onStart }: { onStart: () => void }) {
  const [adresse, setAdresse] = useState(aktiveAnfrage.baustelleAdresse);
  const [von, setVon] = useState("2026-04-13");
  const [bis, setBis] = useState("2026-04-17");
  const [teamGroesse, setTeamGroesse] = useState(aktiveAnfrage.teamGroesse);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    aktiveAnfrage.equipment
  );
  const [budget, setBudget] = useState(120);
  const [maxDistanz, setMaxDistanz] = useState(15);
  const [sammelzimmer, setSammelzimmer] = useState(false);
  const [fruehstueck, setFruehstueck] = useState(true);
  const [anfahrt, setAnfahrt] = useState<"transporter" | "ice" | "gemischt">(
    "transporter"
  );
  const [selectedQualifikationen, setSelectedQualifikationen] = useState<string[]>([
    "Kran-Schein",
    "Hydraulik",
    "Schweißer-Zert",
  ]);
  const [showFuture, setShowFuture] = useState(false);

  const transportBedarf = selectedEquipment.some((e) =>
    /2t|Kran/i.test(e)
  )
    ? "2t → Sprinter empfohlen"
    : selectedEquipment.length > 2
    ? "~500 kg → Caddy ausreichend"
    : "minimal → PKW möglich";

  return (
    <div className="grid grid-cols-[320px_1fr] min-h-[calc(100vh-64px)] bg-white">
      {/* Sidebar */}
      <aside className="border-r border-[var(--border)] bg-[var(--muted)]/40">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
            Inbox
          </div>
          <div className="mt-1 text-[18px] font-semibold">
            {anfragen.length} Anfragen
          </div>
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

      {/* Form */}
      <section className="overflow-auto">
        <div className="max-w-4xl mx-auto px-10 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="font-mono text-[11px] text-[var(--muted-foreground)] mb-1">
                {aktiveAnfrage.id} · Eingegangen {aktiveAnfrage.eingegangenAm}
              </div>
              <h1 className="text-[26px] font-semibold tracking-[-0.01em] leading-tight">
                Einsatz-Briefing · {aktiveAnfrage.projekt}
              </h1>
              <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
                MVP-Felder für den Pilot. Ausbau-Felder darunter als Zukunftsmusik.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[var(--scholpp-red)] text-white flex items-center justify-center text-[12px] font-bold">
                {aktiveAnfrage.projektleiterKuerzel}
              </div>
              <div className="text-[13px]">
                <div className="font-medium">{aktiveAnfrage.projektleiter}</div>
                <div className="text-[var(--muted-foreground)] text-[11px]">
                  Projektleiter
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-3">
            Kern · MVP-Pilot
          </div>
          <div className="space-y-6">
            {/* Gruppe 1: Projekt-Stamm */}
            <FormGroup
              icon={MapPin}
              nummer="01"
              totalCount="03"
              titel="Projekt-Stamm"
              sub="Baustelle, Zeitraum, Team"
            >
              <Field label="Baustellen-Adresse">
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full h-10 px-3 border border-[var(--border-strong)] bg-white text-[13px] focus:border-[var(--scholpp-red)] outline-none"
                />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Anreise" icon={Calendar}>
                  <input
                    type="date"
                    value={von}
                    onChange={(e) => setVon(e.target.value)}
                    className="w-full h-10 px-3 border border-[var(--border-strong)] bg-white text-[13px] focus:border-[var(--scholpp-red)] outline-none"
                  />
                </Field>
                <Field label="Abreise" icon={Calendar}>
                  <input
                    type="date"
                    value={bis}
                    onChange={(e) => setBis(e.target.value)}
                    className="w-full h-10 px-3 border border-[var(--border-strong)] bg-white text-[13px] focus:border-[var(--scholpp-red)] outline-none"
                  />
                </Field>
                <Field label="Team-Größe" icon={Users}>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={teamGroesse}
                    onChange={(e) => setTeamGroesse(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-[var(--border-strong)] bg-white text-[13px] focus:border-[var(--scholpp-red)] outline-none"
                  />
                </Field>
              </div>
            </FormGroup>

            {/* Gruppe 4: Hotel-Präferenzen (MVP 02) */}
            <FormGroup
              icon={Hotel}
              nummer="02"
              totalCount="03"
              titel="Hotel-Präferenzen"
              sub="Default = Betriebsordnung (120 €, 15 km). Überschreibbar pro Fall."
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between text-[12px] font-semibold mb-2">
                    <span>Budget-Override</span>
                    <span className="font-mono text-[var(--scholpp-red)]">{budget} €</span>
                  </div>
                  <input type="range" min={60} max={180} step={5} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-[var(--scholpp-red)]" />
                  <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono mt-0.5">
                    <span>60 €</span><span>Richtlinie 120 €</span><span>180 €</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[12px] font-semibold mb-2">
                    <span>Max. Distanz zur Baustelle</span>
                    <span className="font-mono text-[var(--scholpp-red)]">{maxDistanz} km</span>
                  </div>
                  <input type="range" min={5} max={30} step={1} value={maxDistanz} onChange={(e) => setMaxDistanz(Number(e.target.value))} className="w-full accent-[var(--scholpp-red)]" />
                  <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] font-mono mt-0.5">
                    <span>5 km</span><span>Richtlinie 15 km</span><span>30 km</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 mt-5">
                <Toggle value={sammelzimmer} onChange={setSammelzimmer} label="Monteure gemeinsame Unterkunft" />
                <Toggle value={fruehstueck} onChange={setFruehstueck} label="Frühstück inkludiert" />
              </div>
            </FormGroup>

            {/* Gruppe 5: Anfahrt-Strategie (MVP 03) */}
            <FormGroup
              icon={Truck}
              nummer="03"
              totalCount="03"
              titel="Anfahrt-Strategie"
              sub="Agent vergleicht trotzdem alle drei — Präferenz wird gewichtet"
            >
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "transporter", label: "Transporter-Pool", sub: "Werkzeug + Team in einem Fahrzeug" },
                  { id: "ice", label: "ICE-Alternative", sub: "Team per Zug + separater Transporter" },
                  { id: "gemischt", label: "Gemischt", sub: "Agent entscheidet pro Einsatz" },
                ] as const).map((opt) => {
                  const active = anfahrt === opt.id;
                  return (
                    <button key={opt.id} type="button" onClick={() => setAnfahrt(opt.id)} className={`text-left px-4 py-3 border transition-colors ${active ? "bg-[var(--scholpp-red)]/[0.05] border-[var(--scholpp-red)]" : "bg-white border-[var(--border-strong)] hover:border-[var(--scholpp-red)]"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full border-2 ${active ? "border-[var(--scholpp-red)] bg-[var(--scholpp-red)]" : "border-[var(--border-strong)]"}`} />
                        <span className="text-[13px] font-semibold">{opt.label}</span>
                      </div>
                      <div className="text-[11px] text-[var(--muted-foreground)] leading-snug pl-5">{opt.sub}</div>
                    </button>
                  );
                })}
              </div>
            </FormGroup>

            {aktiveAnfrage.sonderwuensche && (
              <div className="hairline border bg-[var(--muted)]/40 p-4">
                <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-1">
                  Sonderwünsche (Freitext)
                </div>
                <div className="text-[13px] leading-relaxed">
                  {aktiveAnfrage.sonderwuensche}
                </div>
              </div>
            )}
          </div>

          {/* Zukunftsmusik-Sektion */}
          <div className="mt-8">
            <button
              onClick={() => setShowFuture((v) => !v)}
              className="w-full hairline border bg-white px-5 py-4 flex items-center justify-between hover:bg-[var(--muted)]/30 text-left"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] font-semibold mb-1">
                  Ausbau-Stufe · Zukunftsmusik
                </div>
                <div className="text-[15px] font-semibold tracking-[-0.01em]">
                  Weitere Felder nach MVP-Pilot
                </div>
                <div className="text-[12px] text-[var(--muted-foreground)] mt-1">
                  Qualifikations-Matching · Equipment-Dispo — für den Ausbau, nicht für Pilot-Start
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform text-[var(--muted-foreground)] shrink-0 ml-4 ${showFuture ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {showFuture && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 space-y-6">
                    <FormGroup
                      icon={Wrench}
                      nummer="A"
                      totalCount="—"
                      titel="Einsatz-Anforderung · Qualifikationen"
                      sub="Ausbau: Agent validiert Monteur-Zertifikate gegen Anforderung"
                    >
              <div className="flex flex-wrap gap-2">
                {qualifikationOptionen.map((q) => {
                  const active = selectedQualifikationen.includes(q);
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() =>
                        setSelectedQualifikationen((curr) =>
                          active
                            ? curr.filter((e) => e !== q)
                            : [...curr, q]
                        )
                      }
                      className={`px-3 h-9 text-[12px] font-medium border transition-colors ${
                        active
                          ? "bg-[var(--scholpp-red)] border-[var(--scholpp-red)] text-white"
                          : "bg-white border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--scholpp-red)]"
                      }`}
                    >
                      {active && "✓ "}
                      {q}
                    </button>
                  );
                })}
              </div>
              <div className="inline-flex items-center gap-2 mt-3 text-[12px] text-[var(--muted-foreground)] bg-[var(--muted)]/50 px-3 py-1.5 border border-[var(--border)]">
                <Sparkles size={12} className="text-[var(--scholpp-red)]" />
                Agent sucht: <span className="font-semibold text-[var(--foreground)]">{teamGroesse} Monteure mit Abdeckung aller {selectedQualifikationen.length} Qualifikationen</span>
              </div>
            </FormGroup>

            {/* Gruppe B: Equipment */}
            <FormGroup
              icon={Package}
              nummer="B"
              totalCount="—"
              titel="Equipment-Disposition"
              sub="Ausbau: Agent prüft Geschirr, Werkzeuge, Prüfplaketten"
            >
              <div className="flex flex-wrap gap-2">
                {equipmentOptionen.map((opt) => {
                  const active = selectedEquipment.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelectedEquipment((curr) =>
                          active
                            ? curr.filter((e) => e !== opt)
                            : [...curr, opt]
                        )
                      }
                      className={`px-3 h-9 text-[12px] font-medium border transition-colors ${
                        active
                          ? "bg-[var(--scholpp-red)] border-[var(--scholpp-red)] text-white"
                          : "bg-white border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--scholpp-red)]"
                      }`}
                    >
                      {active && "✓ "}
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div className="inline-flex items-center gap-2 mt-3 text-[12px] text-[var(--muted-foreground)] bg-[var(--muted)]/50 px-3 py-1.5 border border-[var(--border)]">
                <Sparkles size={12} className="text-[var(--scholpp-red)]" />
                Auto-abgeleitet: <span className="font-semibold text-[var(--foreground)]">Transport-Bedarf {transportBedarf}</span>
              </div>
            </FormGroup>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between sticky bottom-0 bg-white py-4 border-t border-[var(--border)]">
            <div className="text-[12px] text-[var(--muted-foreground)]">
              Formular lebt im Projektleiter-Portal · direkt eingebettet
            </div>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-7 h-12 font-semibold text-[14px] transition-colors"
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

function FormGroup({
  icon: Icon,
  nummer,
  totalCount,
  titel,
  sub,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  nummer: string;
  totalCount?: string;
  titel: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hairline border bg-white p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--border)]">
        <div className="w-9 h-9 flex items-center justify-center bg-[var(--foreground)] text-white">
          <Icon size={16} />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
              {nummer}{totalCount ? ` / ${totalCount}` : ""}
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">
              {titel}
            </span>
          </div>
          <div className="text-[11px] text-[var(--muted-foreground)]">{sub}</div>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)] font-semibold mb-1.5">
        {Icon && <Icon size={11} />}
        {label}
      </div>
      {children}
    </label>
  );
}

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="inline-flex items-center gap-2.5 text-[12px] font-medium"
    >
      <span
        className={`relative w-9 h-5 transition-colors ${
          value ? "bg-[var(--scholpp-red)]" : "bg-[var(--border-strong)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform ${
            value ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

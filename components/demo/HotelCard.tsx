"use client";

import { Star, ExternalLink, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Hotel } from "@/data/hotels";
import type { HotelScore } from "@/data/scoring";
import { scoringKriterien } from "@/data/scoring";
import { formatEur } from "@/lib/utils";

const quelleToHref: Record<string, string> = {
  roomix: "roomix.scholpp.intern/hotels/",
  booking: "booking.com/hotel/de/",
  hrs: "hrs.de/hotel/",
  direct: "hotel-direct.de/",
};

const quelleFarbe: Record<string, string> = {
  roomix: "#e00028",
  booking: "#1d4ed8",
  hrs: "#ea580c",
  direct: "#646464",
};

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function HotelCard({
  hotel,
  score,
  rank,
  isTop,
}: {
  hotel: Hotel;
  score: HotelScore;
  rank: number;
  isTop: boolean;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const sources = [
    { quelle: hotel.quelle, preis: hotel.preisProNacht, primary: true },
    ...hotel.alternativeQuellen.map((a) => ({ ...a, primary: false })),
  ];

  return (
    <div
      className={`hairline border bg-white p-5 relative flex flex-col ${
        isTop ? "border-[var(--scholpp-red)] shadow-[0_0_0_1px_var(--scholpp-red)]" : ""
      }`}
    >
      {isTop && (
        <div className="absolute -top-3 left-4 bg-[var(--scholpp-red)] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 flex items-center gap-1">
          <Check size={10} />
          Empfehlung
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <div className="font-mono text-[11px] text-[var(--muted-foreground)]">
          #{rank}
        </div>
        <div
          className={`font-mono text-[16px] font-bold ${
            isTop ? "text-[var(--scholpp-red)]" : ""
          }`}
        >
          {score.gesamt}
          <span className="text-[10px] text-[var(--muted-foreground)]">/10</span>
        </div>
      </div>
      <div className="text-[15px] font-semibold leading-snug tracking-[-0.01em] mb-1 min-h-[44px]">
        {hotel.name}
      </div>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: hotel.sterne }).map((_, i) => (
          <Star key={i} size={11} className="fill-[#f5c242] text-[#f5c242]" />
        ))}
        <span className="text-[11px] text-[var(--muted-foreground)] ml-1">
          · {hotel.stadt}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-[var(--border)]">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
            Preis
          </div>
          <div className="text-[18px] font-bold tracking-[-0.01em]">
            {formatEur(hotel.preisProNacht)}
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]">/Nacht</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
            Distanz
          </div>
          <div className="text-[18px] font-bold tracking-[-0.01em]">
            {hotel.entfernungKm}
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]">km</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
            Bewertung
          </div>
          <div className="text-[18px] font-bold tracking-[-0.01em]">
            {hotel.bewertungSchnitt}
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)]">
            ({hotel.bewertungAnzahl})
          </div>
        </div>
      </div>

      {/* Quellen */}
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)] mb-2 font-semibold">
          Verfügbar via
        </div>
        <ul className="space-y-1.5">
          {sources.map((s, i) => (
            <li key={i}>
              <a
                href={`https://${quelleToHref[s.quelle]}${slug(hotel.name)}`}
                onClick={(e) => e.preventDefault()}
                title="Öffnet im echten System im neuen Tab"
                className="inline-flex items-center gap-1.5 text-[11px] hover:underline group w-full"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: quelleFarbe[s.quelle] }}
                />
                <span className="font-mono text-[var(--muted-foreground)] truncate flex-1">
                  {quelleToHref[s.quelle]}
                  {slug(hotel.name)}
                </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {formatEur(s.preis)}
                </span>
                <ExternalLink
                  size={9}
                  className="text-[var(--muted-foreground)] group-hover:text-[var(--scholpp-red)] shrink-0"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {hotel.kommentar && (
        <div className="text-[11px] text-[var(--muted-foreground)] leading-relaxed mb-3">
          {hotel.kommentar}
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={() => setShowBreakdown((v) => !v)}
          className="w-full inline-flex items-center justify-between text-[12px] font-semibold text-[var(--foreground)] hover:text-[var(--scholpp-red)] border-t border-[var(--border)] pt-3"
        >
          <span>Warum Score {score.gesamt}?</span>
          <ChevronDown
            size={14}
            className={`transition-transform ${showBreakdown ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {showBreakdown && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2 mt-3 text-[11px]"
            >
              {scoringKriterien.map((k) => {
                const val = score.breakdown[k.key];
                return (
                  <li key={k.key}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[var(--muted-foreground)]">
                        {k.label} ({(k.gewicht * 100).toFixed(0)}%)
                      </span>
                      <span className="font-mono font-semibold">{val}</span>
                    </div>
                    <div className="h-1 bg-[var(--muted)]">
                      <div
                        className={isTop ? "bg-[var(--scholpp-red)] h-full" : "bg-[var(--foreground)] h-full"}
                        style={{ width: `${(val / 10) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

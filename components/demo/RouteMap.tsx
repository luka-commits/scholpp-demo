"use client";

import { rankedHotels } from "@/data/scoring";

// Stylized SVG route map — Baustelle + Top-3 Hotels
export function RouteMap() {
  const baustelle = { x: 620, y: 230, label: "Baustelle", sub: "Langenhagen" };
  const hotels = rankedHotels.slice(0, 3).map((h, i) => {
    // Arrange hotels at varied distances visually
    const positions = [
      { x: 500, y: 180 }, // closest (top-left of baustelle)
      { x: 380, y: 300 }, // medium
      { x: 250, y: 150 }, // further
    ];
    return { ...positions[i], name: h.hotel.name, km: h.hotel.entfernungKm, rank: i + 1 };
  });

  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          Routen-Übersicht
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Quelle: Google Maps
        </div>
      </div>
      <div className="relative bg-[#f5f6f7] overflow-hidden">
        <svg viewBox="0 0 750 420" className="w-full h-auto block">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="gridBig"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 120 0 L 0 0 0 120"
                fill="none"
                stroke="#d4d4d4"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="750" height="420" fill="url(#grid)" />
          <rect width="750" height="420" fill="url(#gridBig)" />

          {/* Water / Maschsee */}
          <ellipse cx="180" cy="360" rx="90" ry="35" fill="#cfe2ea" />
          <text x="180" y="395" textAnchor="middle" fontSize="10" fill="#5a7a86">
            Maschsee
          </text>

          {/* Highway A2 */}
          <line
            x1="0"
            y1="80"
            x2="750"
            y2="110"
            stroke="#f5c242"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="40" y="75" fontSize="10" fill="#8a6a10" fontWeight="600">
            A2
          </text>

          {/* City label */}
          <text
            x="280"
            y="270"
            fontSize="11"
            fill="#8a8a8a"
            fontWeight="600"
            letterSpacing="2"
          >
            HANNOVER
          </text>
          <text
            x="550"
            y="140"
            fontSize="11"
            fill="#8a8a8a"
            fontWeight="600"
            letterSpacing="2"
          >
            LANGENHAGEN
          </text>

          {/* Routes from hotels to baustelle */}
          {hotels.map((h, i) => (
            <g key={i}>
              <line
                x1={h.x}
                y1={h.y}
                x2={baustelle.x}
                y2={baustelle.y}
                stroke={i === 0 ? "#e00028" : "#a0a0a0"}
                strokeWidth={i === 0 ? 2.5 : 1.5}
                strokeDasharray={i === 0 ? "none" : "4 4"}
              />
              <text
                x={(h.x + baustelle.x) / 2}
                y={(h.y + baustelle.y) / 2 - 6}
                fontSize="10"
                fill={i === 0 ? "#e00028" : "#646464"}
                fontWeight="600"
                textAnchor="middle"
              >
                {h.km} km
              </text>
            </g>
          ))}

          {/* Baustelle marker */}
          <g>
            <circle
              cx={baustelle.x}
              cy={baustelle.y}
              r="12"
              fill="#111111"
              stroke="white"
              strokeWidth="3"
            />
            <text
              x={baustelle.x}
              y={baustelle.y + 4}
              textAnchor="middle"
              fontSize="11"
              fill="white"
              fontWeight="700"
            >
              B
            </text>
            <text
              x={baustelle.x + 18}
              y={baustelle.y + 2}
              fontSize="11"
              fontWeight="700"
              fill="#111111"
            >
              Baustelle
            </text>
            <text
              x={baustelle.x + 18}
              y={baustelle.y + 16}
              fontSize="10"
              fill="#646464"
            >
              Münchner Str. 45
            </text>
          </g>

          {/* Hotel markers */}
          {hotels.map((h, i) => (
            <g key={`m-${i}`}>
              <circle
                cx={h.x}
                cy={h.y}
                r={i === 0 ? 11 : 9}
                fill={i === 0 ? "#e00028" : "white"}
                stroke={i === 0 ? "white" : "#a0a0a0"}
                strokeWidth={i === 0 ? 3 : 1.5}
              />
              <text
                x={h.x}
                y={h.y + 4}
                textAnchor="middle"
                fontSize="11"
                fill={i === 0 ? "white" : "#111111"}
                fontWeight="700"
              >
                {h.rank}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="px-5 py-3 border-t border-[var(--border)] flex items-center gap-5 text-[11px] text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--scholpp-red)]" />
          Empfehlung #1
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white border border-[var(--border-strong)]" />
          Alternativen
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-black" />
          Baustelle
        </div>
      </div>
    </div>
  );
}

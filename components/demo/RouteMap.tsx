"use client";

import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";
import { aktiveAnfrage } from "@/data/anfragen";
import { ausgewaehlteMonteure } from "@/data/monteure";

// Treffpunkt für Pooling — Frankfurt Hbf (zentral, an A5/A7)
const meetPoint = { lat: 50.107, lng: 8.663 };
const meetPointLabel = "Frankfurt Hbf · Treffpunkt";

const mapStyles: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f5c242" }],
  },
  { elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },
];

export function RouteMap() {
  const { isLoaded } = useJsApiLoader({
    id: "scholpp-gmaps",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const baustelle = aktiveAnfrage.baustelleKoordinaten;

  const center = useMemo(() => {
    const all = [
      baustelle,
      meetPoint,
      ...ausgewaehlteMonteure.map((m) => m.heimatKoordinaten),
    ];
    const lat = all.reduce((s, p) => s + p.lat, 0) / all.length;
    const lng = all.reduce((s, p) => s + p.lng, 0) / all.length;
    return { lat, lng };
  }, [baustelle]);

  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          Anreise-Pooling · 3 Heimatorte → 1 Baustelle
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Heimat-Adressen aus Personal-DB
        </div>
      </div>
      <div className="px-5 py-3 bg-[var(--scholpp-red)]/[0.04] border-b border-[var(--border)] flex items-baseline gap-4 flex-wrap text-[12px]">
        <span>
          <span className="font-semibold">Status Quo:</span> jeder fährt allein von
          zu Hause — 3× Privat-PKW nach Hannover
        </span>
        <span className="text-[var(--scholpp-red)]">→</span>
        <span>
          <span className="font-semibold">Vorschlag:</span> Treffpunkt Frankfurt
          Hbf · 1× Sprinter gemeinsam weiter
        </span>
      </div>
      <div className="relative h-[380px] bg-[#e9ecef]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={6}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              styles: mapStyles,
              gestureHandling: "cooperative",
              backgroundColor: "#e9ecef",
            }}
          >
            {/* Heimatorte */}
            {ausgewaehlteMonteure.map((m) => (
              <Marker
                key={m.id}
                position={m.heimatKoordinaten}
                label={{
                  text: m.kuerzel,
                  color: "white",
                  fontWeight: "700",
                  fontSize: "11px",
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: "#e00028",
                  fillOpacity: 1,
                  strokeColor: "white",
                  strokeWeight: 2,
                }}
                title={`${m.name} — ${m.heimatort}`}
              />
            ))}

            {/* Treffpunkt */}
            <Marker
              position={meetPoint}
              label={{
                text: "T",
                color: "white",
                fontWeight: "700",
                fontSize: "12px",
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 13,
                fillColor: "#f5c242",
                fillOpacity: 1,
                strokeColor: "#8a5a00",
                strokeWeight: 2,
              }}
              title={meetPointLabel}
            />

            {/* Baustelle */}
            <Marker
              position={baustelle}
              label={{
                text: "B",
                color: "white",
                fontWeight: "700",
                fontSize: "13px",
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: "#111111",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 3,
              }}
              title={`Baustelle — ${aktiveAnfrage.baustelleAdresse}`}
            />

            {/* Heimat → Treffpunkt (Einzelfahrten, gestrichelt) */}
            {ausgewaehlteMonteure.map((m) => (
              <Polyline
                key={m.id + "-meet"}
                path={[m.heimatKoordinaten, meetPoint]}
                options={{
                  strokeColor: "#a0a0a0",
                  strokeOpacity: 0,
                  strokeWeight: 1.5,
                  geodesic: true,
                  icons: [
                    {
                      icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
                      offset: "0",
                      repeat: "10px",
                    },
                  ],
                }}
              />
            ))}

            {/* Treffpunkt → Baustelle (Sprinter, rot durchgezogen) */}
            <Polyline
              path={[meetPoint, baustelle]}
              options={{
                strokeColor: "#e00028",
                strokeOpacity: 0.9,
                strokeWeight: 4,
                geodesic: true,
              }}
            />
          </GoogleMap>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[12px] text-[var(--muted-foreground)]">
            Karte wird geladen…
          </div>
        )}
      </div>
      <div className="px-5 py-3 border-t border-[var(--border)] grid grid-cols-3 gap-3 text-[11px]">
        {ausgewaehlteMonteure.map((m) => (
          <div key={m.id} className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[var(--scholpp-red)] text-white font-semibold text-[10px] flex items-center justify-center shrink-0">
              {m.kuerzel}
            </span>
            <div>
              <div className="font-medium">{m.heimatort}</div>
              <div className="text-[var(--muted-foreground)] text-[10px]">
                {m.name.split(" ")[0]} {m.name.split(" ").slice(-1)[0]}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-[var(--border)] flex items-center gap-5 text-[11px] text-[var(--muted-foreground)] flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--scholpp-red)]" />
          Heimatort (Monteur)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f5c242] border border-[#8a5a00]" />
          Treffpunkt Frankfurt Hbf
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-black" />
          Baustelle Hannover
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-[var(--scholpp-red)]" />
          Sprinter-Pooling
        </div>
      </div>
    </div>
  );
}

"use client";

import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";
import { aktiveAnfrage } from "@/data/anfragen";
import { ausgewaehlteMonteure } from "@/data/monteure";

// SCHOLPP Niederlassung Böblingen (HQ) — Treffpunkt für Pooling
const niederlassung = { lat: 48.683, lng: 9.012 };
const niederlassungLabel = "SCHOLPP Niederlassung Böblingen";

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

  // Center zwischen Niederlassung (Süden) und Baustelle (Norden)
  const center = useMemo(() => {
    return {
      lat: (niederlassung.lat + baustelle.lat) / 2,
      lng: (niederlassung.lng + baustelle.lng) / 2,
    };
  }, [baustelle]);

  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          Anreise-Plan · Team aus Niederlassung Böblingen → Hannover
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Heimat-Koordinaten aus Personal-DB
        </div>
      </div>
      <div className="px-5 py-3 bg-[var(--scholpp-red)]/[0.04] border-b border-[var(--border)] text-[12px] leading-relaxed">
        Alle 3 Monteure wohnen im Raum Stuttgart (≤ 15 km zur Niederlassung).
        Treffpunkt <span className="font-semibold">Niederlassung Böblingen</span> —
        von dort gemeinsam mit <span className="font-semibold">1 Sprinter</span> +
        Werkzeug nach Hannover.
      </div>
      <div className="relative h-[400px] bg-[#e9ecef]">
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
            {/* Heimatorte (klein, grau-rot) */}
            {ausgewaehlteMonteure.map((m) => (
              <Marker
                key={m.id}
                position={m.heimatKoordinaten}
                label={{
                  text: m.kuerzel,
                  color: "white",
                  fontWeight: "700",
                  fontSize: "9px",
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#e00028",
                  fillOpacity: 0.85,
                  strokeColor: "white",
                  strokeWeight: 1.5,
                }}
                title={`${m.name} — ${m.heimatort}`}
                zIndex={2}
              />
            ))}

            {/* Niederlassung — Treffpunkt (groß, auffällig) */}
            <Marker
              position={niederlassung}
              label={{
                text: "N",
                color: "white",
                fontWeight: "700",
                fontSize: "13px",
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: "#f5c242",
                fillOpacity: 1,
                strokeColor: "#8a5a00",
                strokeWeight: 3,
              }}
              title={niederlassungLabel}
              zIndex={3}
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
              zIndex={3}
            />

            {/* Heimat → Niederlassung (kurz, gestrichelt, dezent) */}
            {ausgewaehlteMonteure.map((m) => (
              <Polyline
                key={m.id + "-pickup"}
                path={[m.heimatKoordinaten, niederlassung]}
                options={{
                  strokeColor: "#a0a0a0",
                  strokeOpacity: 0,
                  strokeWeight: 1,
                  geodesic: true,
                  icons: [
                    {
                      icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 2 },
                      offset: "0",
                      repeat: "8px",
                    },
                  ],
                }}
              />
            ))}

            {/* Niederlassung → Baustelle (Sprinter, rot durchgezogen, dominant) */}
            <Polyline
              path={[niederlassung, baustelle]}
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

      {/* Monteur-Cluster-Liste */}
      <div className="px-5 py-3 border-t border-[var(--border)] grid grid-cols-3 gap-3 text-[11px]">
        {ausgewaehlteMonteure.map((m) => (
          <div key={m.id} className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[var(--scholpp-red)] text-white font-semibold text-[10px] flex items-center justify-center shrink-0">
              {m.kuerzel}
            </span>
            <div>
              <div className="font-medium">{m.heimatort}</div>
              <div className="text-[var(--muted-foreground)] text-[10px]">
                {m.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legende */}
      <div className="px-5 py-3 border-t border-[var(--border)] flex items-center gap-5 text-[11px] text-[var(--muted-foreground)] flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--scholpp-red)]" />
          Heimat Monteur
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f5c242] border border-[#8a5a00]" />
          Niederlassung Böblingen (Treffpunkt)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-black" />
          Baustelle Hannover
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-[var(--scholpp-red)]" />
          Sprinter-Route
        </div>
      </div>

      {/* Footer-Hinweis */}
      <div className="px-5 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--muted-foreground)] italic leading-relaxed">
        Bei verteilten Teams (&gt;100 km Spread) würde der Agent Pickup-on-Route
        oder direkte Bahnfahrt für einzelne Monteure vorschlagen — hier nicht nötig.
      </div>
    </div>
  );
}

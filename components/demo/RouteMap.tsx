"use client";

import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";
import { rankedHotels } from "@/data/scoring";
import { aktiveAnfrage } from "@/data/anfragen";

// Approximated hotel coordinates (Hannover / Langenhagen) — good enough for demo
const hotelCoords: Record<string, { lat: number; lng: number }> = {
  h1: { lat: 52.4514, lng: 9.7361 }, // IntercityHotel Langenhagen
  h2: { lat: 52.3744, lng: 9.7386 }, // NH Hannover (Andreaestr)
  h3: { lat: 52.3208, lng: 9.8022 }, // Best Western Kronsberg
  h4: { lat: 52.3606, lng: 9.7422 }, // Courtyard Maschsee
  h5: { lat: 52.4011, lng: 9.6892 }, // B&B Hannover-Nord
  h9: { lat: 52.377, lng: 9.726 }, // H+ Osterstr
  h12: { lat: 52.3893, lng: 9.802 }, // Wyndham Atrium
  h13: { lat: 52.3788, lng: 9.7355 }, // Motel One
};

const mapStyles: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f5c242" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#5a5a5a" }],
  },
];

export function RouteMap() {
  const { isLoaded } = useJsApiLoader({
    id: "scholpp-gmaps",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const baustelle = aktiveAnfrage.baustelleKoordinaten;
  const topThree = useMemo(
    () =>
      rankedHotels.slice(0, 3).map((r, i) => ({
        id: r.hotel.id,
        name: r.hotel.name,
        km: r.hotel.entfernungKm,
        rank: i + 1,
        position: hotelCoords[r.hotel.id] || { lat: 52.4, lng: 9.73 },
      })),
    []
  );

  const center = useMemo(() => {
    const all = [baustelle, ...topThree.map((h) => h.position)];
    const lat = all.reduce((s, p) => s + p.lat, 0) / all.length;
    const lng = all.reduce((s, p) => s + p.lng, 0) / all.length;
    return { lat, lng };
  }, [baustelle, topThree]);

  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          Routen-Übersicht · Hannover/Langenhagen
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Quelle: Google Maps
        </div>
      </div>
      <div className="relative h-[340px] bg-[#e9ecef]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={11}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              styles: mapStyles,
              gestureHandling: "cooperative",
              backgroundColor: "#e9ecef",
            }}
          >
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
            {/* Hotels */}
            {topThree.map((h) => (
              <Marker
                key={h.id}
                position={h.position}
                label={{
                  text: String(h.rank),
                  color: h.rank === 1 ? "white" : "#111111",
                  fontWeight: "700",
                  fontSize: "12px",
                }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: h.rank === 1 ? 13 : 11,
                  fillColor: h.rank === 1 ? "#e00028" : "#ffffff",
                  fillOpacity: 1,
                  strokeColor: h.rank === 1 ? "white" : "#646464",
                  strokeWeight: h.rank === 1 ? 3 : 2,
                }}
                title={`#${h.rank} ${h.name} — ${h.km} km`}
              />
            ))}
            {/* Connection from Top-1 hotel to baustelle */}
            <Polyline
              path={[topThree[0].position, baustelle]}
              options={{
                strokeColor: "#e00028",
                strokeOpacity: 0.9,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
            {topThree.slice(1).map((h) => (
              <Polyline
                key={h.id}
                path={[h.position, baustelle]}
                options={{
                  strokeColor: "#a0a0a0",
                  strokeOpacity: 0.7,
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
          </GoogleMap>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[12px] text-[var(--muted-foreground)]">
            Karte wird geladen…
          </div>
        )}
      </div>
      <div className="px-5 py-3 border-t border-[var(--border)] flex items-center gap-5 text-[11px] text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--scholpp-red)]" />
          Empfehlung #1 · {topThree[0].km} km
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

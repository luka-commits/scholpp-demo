"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useMemo } from "react";
import { aktiveAnfrage } from "@/data/anfragen";
import { ausgewaehlteMonteure } from "@/data/monteure";
import { niederlassungen } from "@/data/niederlassungen";
import { ANREISE_LABEL, type AnreiseStrategie } from "@/lib/route-optimizer";
import { useRouteOptimization } from "@/lib/use-route-optimization";

// Module-level constant — required so useJsApiLoader doesn't warn about
// changing libraries between renders.
const GMAPS_LIBRARIES: ("geometry")[] = ["geometry"];

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

type LatLng = { lat: number; lng: number };

const COLOR_SPRINTER = "#e00028";
const COLOR_DIREKT = "#5a5a5a";
const COLOR_BAHN = "#1e6fff";

export function RouteMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "scholpp-gmaps",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GMAPS_LIBRARIES,
  });

  const baustelle = aktiveAnfrage.baustelleKoordinaten;
  const monteurIds = useMemo(
    () => ausgewaehlteMonteure.map((m) => m.id),
    [],
  );

  const { data, loading, error, usedCache } = useRouteOptimization(
    aktiveAnfrage.id,
    monteurIds,
  );
  const cachedAt = usedCache ? data?.generatedAt ?? null : null;

  const decodedPolylines = useMemo(() => {
    if (!isLoaded || !data || !window.google?.maps?.geometry) return [];
    return data.polylines.map((p) => {
      const path = p.encodedPolyline
        ? google.maps.geometry.encoding.decodePath(p.encodedPolyline)
        : null;
      return { ...p, path };
    });
  }, [isLoaded, data]);

  const center = useMemo(() => {
    if (!data) {
      return {
        lat: (50.0 + baustelle.lat) / 2,
        lng: (8.8 + baustelle.lng) / 2,
      };
    }
    const allPoints: LatLng[] = [
      baustelle,
      data.startNl.koordinaten,
      ...ausgewaehlteMonteure.map((m) => m.heimatKoordinaten),
    ];
    const lat =
      allPoints.reduce((s, p) => s + p.lat, 0) / allPoints.length;
    const lng =
      allPoints.reduce((s, p) => s + p.lng, 0) / allPoints.length;
    return { lat, lng };
  }, [data, baustelle]);

  const startNlId = data?.startNl.id;

  const headerSubtitle = data
    ? `Sprinter-Start: ${data.startNl.stadt} · ${Math.round(data.startNl.fahrzeitMin)} min zur Baustelle`
    : "Agent berechnet Routen…";

  return (
    <div className="hairline border bg-white">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between flex-wrap gap-2">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          Anreise-Plan · {headerSubtitle}
        </div>
        <div className="text-[11px] text-[var(--muted-foreground)] font-mono">
          Fahrzeiten · Google Routes API
        </div>
      </div>

      {usedCache && (
        <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900">
          Cache-Modus · letzter erfolgreicher Live-Call:{" "}
          {cachedAt ? new Date(cachedAt).toLocaleString("de-DE") : "unbekannt"}
        </div>
      )}

      {error && !data && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-200 text-[12px] text-red-900">
          <div className="font-semibold mb-1">Routes-API-Fehler</div>
          <div className="font-mono text-[11px] break-all">{error}</div>
          <div className="mt-2">
            Prüfen: <code>GOOGLE_ROUTES_API_KEY</code> server-side gesetzt &amp;
            Routes API in GCP enabled (Billing aktiv)?
          </div>
        </div>
      )}

      <div className="relative h-[400px] bg-[#e9ecef]">
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center text-[12px] text-red-700 px-4 text-center">
            Karten-Lib konnte nicht geladen werden. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY prüfen.
          </div>
        )}
        {!loadError && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-[12px] text-[var(--muted-foreground)]">
            Karte wird geladen…
          </div>
        )}
        {isLoaded && (
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
            {/* Loading-Overlay innerhalb der Karte */}
            {loading && (
              <div className="absolute top-3 left-3 bg-white/95 border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium z-10">
                Agent berechnet Routen via Google Maps…
              </div>
            )}

            {/* Niederlassungen */}
            {niederlassungen.map((nl) => {
              const isStart = nl.id === startNlId;
              return (
                <Marker
                  key={nl.id}
                  position={nl.koordinaten}
                  label={{
                    text: isStart ? "★" : "N",
                    color: "white",
                    fontWeight: "700",
                    fontSize: isStart ? "14px" : "10px",
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: isStart ? 14 : 7,
                    fillColor: isStart ? "#f5c242" : "#a8a8a8",
                    fillOpacity: isStart ? 1 : 0.7,
                    strokeColor: isStart ? "#8a5a00" : "#666",
                    strokeWeight: isStart ? 3 : 1.5,
                  }}
                  title={`${nl.name}${isStart ? " · Sprinter-Start" : ""}`}
                  zIndex={isStart ? 4 : 1}
                />
              );
            })}

            {/* Heimatorte Monteure */}
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

            {/* Echte Polylines */}
            {decodedPolylines.map((p, i) => {
              if (!p.path || p.path.length === 0) {
                // Bahn / fehlende Polyline → Luftlinie als Hilfslinie
                if (p.kind === "bahn") {
                  // Heimat → Baustelle als Luftlinie
                  const monteur = ausgewaehlteMonteure.find(
                    (m) => m.id === p.monteurIds[0],
                  );
                  if (!monteur) return null;
                  return (
                    <Polyline
                      key={`p-${i}`}
                      path={[monteur.heimatKoordinaten, baustelle]}
                      options={{
                        strokeColor: COLOR_BAHN,
                        strokeOpacity: 0,
                        strokeWeight: 2,
                        geodesic: true,
                        icons: [
                          {
                            icon: {
                              path: "M 0,-1 0,1",
                              strokeOpacity: 1,
                              scale: 2,
                              strokeColor: COLOR_BAHN,
                            },
                            offset: "0",
                            repeat: "10px",
                          },
                        ],
                      }}
                    />
                  );
                }
                return null;
              }

              const color =
                p.kind === "sprinter"
                  ? COLOR_SPRINTER
                  : p.kind === "bahn"
                    ? COLOR_BAHN
                    : COLOR_DIREKT;
              return (
                <Polyline
                  key={`p-${i}`}
                  path={p.path}
                  options={{
                    strokeColor: color,
                    strokeOpacity: 0.9,
                    strokeWeight: p.kind === "sprinter" ? 5 : 3,
                    geodesic: false,
                  }}
                />
              );
            })}
          </GoogleMap>
        )}
      </div>

      {/* Legende */}
      <div className="px-5 py-3 border-t border-[var(--border)] flex items-center gap-5 text-[11px] text-[var(--muted-foreground)] flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#e00028]" />
          Heimat Monteur
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f5c242] border border-[#8a5a00]" />
          Sprinter-Start-NL
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#a8a8a8]" />
          Andere Niederlassung
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-black" />
          Baustelle
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[3px] bg-[#e00028]" />
          Sprinter-Route
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-[#5a5a5a]" />
          Eigen-Anreise
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-[#1e6fff] [background-image:linear-gradient(to_right,#1e6fff_50%,transparent_50%)] [background-size:6px_2px]" />
          Bahn
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--muted-foreground)] italic leading-relaxed">
        {data
          ? `Dispatch-Regel: ${data.startNl.begruendung}. Strategien: ${data.strategien
              .map(
                (s) =>
                  `${ausgewaehlteMonteure.find((m) => m.id === s.monteurId)?.kuerzel ?? s.monteurId}=${ANREISE_LABEL[s.strategie]}`,
              )
              .join(" · ")}`
          : "Fahrzeiten und Polylines werden live über die Google Routes API berechnet."}
      </div>
    </div>
  );
}

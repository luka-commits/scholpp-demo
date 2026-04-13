"use client";

import {
  GoogleMap,
  Marker,
  OverlayView,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Fragment, useEffect, useMemo, useRef } from "react";
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

const STRATEGIE_COLOR: Record<AnreiseStrategie, string> = {
  sprinter_fahrer: "#e00028",
  pickup_on_route: "#f5a623",
  zum_hub_mitfahren: "#f5a623",
  direkt: "#5a5a5a",
  bahn_direkt: "#1e6fff",
};

const STRATEGIE_BADGE: Record<AnreiseStrategie, string> = {
  sprinter_fahrer: "🚐 Sprinter-Fahrer",
  pickup_on_route: "🟡 Pickup",
  zum_hub_mitfahren: "🟡 Zum Hub",
  direkt: "🚗 PKW direkt",
  bahn_direkt: "🚂 Bahn direkt",
};

function fmtMin(min: number): string {
  if (!isFinite(min)) return "–";
  return `${Math.round(min)} min`;
}

function midpointOfPath(path: google.maps.LatLng[] | LatLng[]): LatLng {
  if (!path || path.length === 0) return { lat: 0, lng: 0 };
  const mid = path[Math.floor(path.length / 2)] as
    | google.maps.LatLng
    | LatLng;
  const lat =
    typeof (mid as google.maps.LatLng).lat === "function"
      ? (mid as google.maps.LatLng).lat()
      : (mid as LatLng).lat;
  const lng =
    typeof (mid as google.maps.LatLng).lng === "function"
      ? (mid as google.maps.LatLng).lng()
      : (mid as LatLng).lng;
  return { lat, lng };
}

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

  const monteurStrategieMap = useMemo(() => {
    const m: Record<string, AnreiseStrategie> = {};
    data?.strategien.forEach((s) => {
      m[s.monteurId] = s.strategie;
    });
    return m;
  }, [data]);

  // Auto-fit bounds — alle aktiven Punkte sichtbar, mit Padding
  const mapRef = useRef<google.maps.Map | null>(null);
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !data) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(baustelle);
    bounds.extend(data.startNl.koordinaten);
    ausgewaehlteMonteure.forEach((m) => bounds.extend(m.heimatKoordinaten));
    mapRef.current.fitBounds(bounds, {
      top: 70,
      right: 60,
      bottom: 70,
      left: 60,
    });
  }, [isLoaded, data, baustelle]);

  const headerSubtitle = data
    ? `Sprinter-Start: ${data.startNl.stadt} · ${Math.round(data.startNl.fahrzeitMin)} min zur Baustelle`
    : "Agent berechnet Routen…";

  // Baustellen-Stadt aus Adresse extrahieren ("Münchner Str. 45, 30855 Langenhagen" → "Langenhagen")
  const baustelleStadt = useMemo(() => {
    const parts = aktiveAnfrage.baustelleAdresse.split(",");
    const last = parts[parts.length - 1].trim();
    // PLZ entfernen
    return last.replace(/^\d{5}\s*/, "");
  }, []);

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

      <div className="relative h-[480px] bg-[#e9ecef]">
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
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onUnmount={() => {
              mapRef.current = null;
            }}
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

            {/* Niederlassungen — nur Sprinter-Start prominent, andere kleine graue Punkte */}
            {niederlassungen.map((nl) => {
              const isStart = nl.id === startNlId;
              if (!isStart) {
                return (
                  <Marker
                    key={nl.id}
                    position={nl.koordinaten}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 4,
                      fillColor: "#b8b8b8",
                      fillOpacity: 0.7,
                      strokeColor: "#888",
                      strokeWeight: 1,
                    }}
                    title={nl.name}
                    zIndex={1}
                  />
                );
              }
              return (
                <Fragment key={nl.id}>
                  {/* Goldener Pulse-Ring */}
                  <Marker
                    position={nl.koordinaten}
                    clickable={false}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 28,
                      fillColor: "#f5c242",
                      fillOpacity: 0.2,
                      strokeColor: "#f5c242",
                      strokeOpacity: 0.6,
                      strokeWeight: 2,
                    }}
                    zIndex={3}
                  />
                  <Marker
                    position={nl.koordinaten}
                    label={{
                      text: "★",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "16px",
                    }}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 16,
                      fillColor: "#f5c242",
                      fillOpacity: 1,
                      strokeColor: "#8a5a00",
                      strokeWeight: 3,
                    }}
                    title={`${nl.name} · Sprinter-Start`}
                    zIndex={5}
                  />
                  {/* HTML-Label */}
                  <OverlayView
                    position={nl.koordinaten}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={(w, h) => ({
                      x: -(w / 2),
                      y: 22,
                    })}
                  >
                    <div
                      style={{
                        background: "#f5c242",
                        color: "#3a2700",
                        padding: "3px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                        border: "1.5px solid #8a5a00",
                        whiteSpace: "nowrap",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      🚐 SCHOLPP {nl.stadt} · Sprinter-Start
                    </div>
                  </OverlayView>
                </Fragment>
              );
            })}

            {/* Heimatorte Monteure — Marker + HTML-Label-Karte */}
            {ausgewaehlteMonteure.map((m) => {
              const strat = monteurStrategieMap[m.id];
              const color = strat ? STRATEGIE_COLOR[strat] : "#e00028";
              const badge = strat ? STRATEGIE_BADGE[strat] : "";
              return (
                <Fragment key={m.id}>
                  <Marker
                    position={m.heimatKoordinaten}
                    label={{
                      text: m.kuerzel,
                      color: "white",
                      fontWeight: "700",
                      fontSize: "11px",
                    }}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 13,
                      fillColor: color,
                      fillOpacity: 0.95,
                      strokeColor: "white",
                      strokeWeight: 2.5,
                    }}
                    title={`${m.name} — ${m.heimatort}${strat ? ` · ${ANREISE_LABEL[strat]}` : ""}`}
                    zIndex={4}
                  />
                  <OverlayView
                    position={m.heimatKoordinaten}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={(w, h) => ({
                      x: -(w / 2),
                      y: 18,
                    })}
                  >
                    <div
                      style={{
                        background: "white",
                        padding: "3px 7px",
                        fontSize: 11,
                        fontWeight: 600,
                        borderLeft: `3px solid ${color}`,
                        border: "1px solid rgba(0,0,0,0.15)",
                        borderLeftWidth: 3,
                        borderLeftColor: color,
                        whiteSpace: "nowrap",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        fontFamily: "system-ui, sans-serif",
                        color: "#1a1a1a",
                        lineHeight: 1.25,
                      }}
                    >
                      <div>
                        🏠 {m.name.split(" ").slice(-1)[0]} · {m.heimatort}
                      </div>
                      {badge && (
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color,
                            marginTop: 1,
                          }}
                        >
                          {badge}
                        </div>
                      )}
                    </div>
                  </OverlayView>
                </Fragment>
              );
            })}

            {/* Baustelle */}
            <Marker
              position={baustelle}
              label={{
                text: "🎯",
                fontSize: "16px",
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 18,
                fillColor: "#e00028",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 3.5,
              }}
              title={`Baustelle — ${aktiveAnfrage.baustelleAdresse}`}
              zIndex={6}
            />
            <OverlayView
              position={baustelle}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(w, h) => ({
                x: -(w / 2),
                y: 24,
              })}
            >
              <div
                style={{
                  background: "#e00028",
                  color: "white",
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  border: "1.5px solid #800014",
                  whiteSpace: "nowrap",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                🎯 Baustelle · {baustelleStadt}
              </div>
            </OverlayView>

            {/* Echte Polylines + Mittelpunkt-Labels */}
            {decodedPolylines.map((p, i) => {
              const monteur = ausgewaehlteMonteure.find(
                (m) => m.id === p.monteurIds[0],
              );
              const monteurName = monteur
                ? monteur.name.split(" ").slice(-1)[0]
                : "";
              const durMin = p.durationSec / 60;

              if (!p.path || p.path.length === 0) {
                // Fallback: Luftlinie (gestrichelt)
                if (!monteur) return null;
                const color = p.kind === "bahn" ? COLOR_BAHN : COLOR_DIREKT;
                const path = [monteur.heimatKoordinaten, baustelle];
                const mid = midpointOfPath(path);
                const kindLabel =
                  p.kind === "bahn" ? "🚂 Bahn" : "🚗 PKW direkt";
                return (
                  <Fragment key={`p-${i}`}>
                    <Polyline
                      path={path}
                      options={{
                        strokeColor: color,
                        strokeOpacity: 0,
                        strokeWeight: 2,
                        geodesic: true,
                        icons: [
                          {
                            icon: {
                              path: "M 0,-1 0,1",
                              strokeOpacity: 1,
                              scale: 2,
                              strokeColor: color,
                            },
                            offset: "0",
                            repeat: "10px",
                          },
                        ],
                      }}
                    />
                    <OverlayView
                      position={mid}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      getPixelPositionOffset={(w, h) => ({
                        x: -(w / 2),
                        y: -(h / 2),
                      })}
                    >
                      <div
                        style={{
                          background: "white",
                          color,
                          padding: "2px 6px",
                          fontSize: 10,
                          fontWeight: 700,
                          border: `1px solid ${color}`,
                          whiteSpace: "nowrap",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {kindLabel} · {fmtMin(durMin)}
                        {monteurName ? ` · ${monteurName}` : ""}
                      </div>
                    </OverlayView>
                  </Fragment>
                );
              }

              const color =
                p.kind === "sprinter"
                  ? COLOR_SPRINTER
                  : p.kind === "bahn"
                    ? COLOR_BAHN
                    : COLOR_DIREKT;
              const kindLabel =
                p.kind === "sprinter"
                  ? "🚐 Sprinter"
                  : p.kind === "bahn"
                    ? "🚂 Bahn"
                    : "🚗 PKW direkt";
              const mid = midpointOfPath(p.path);
              // Sprinter zeigt Gesamt-Route (kein einzelner Monteur am Label)
              const showName = p.kind !== "sprinter" && monteurName;
              return (
                <Fragment key={`p-${i}`}>
                  <Polyline
                    path={p.path}
                    options={{
                      strokeColor: color,
                      strokeOpacity: 0.9,
                      strokeWeight: p.kind === "sprinter" ? 5 : 3,
                      geodesic: false,
                    }}
                  />
                  <OverlayView
                    position={mid}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={(w, h) => ({
                      x: -(w / 2),
                      y: -(h / 2),
                    })}
                  >
                    <div
                      style={{
                        background: "white",
                        color,
                        padding: "2px 6px",
                        fontSize: 10,
                        fontWeight: 700,
                        border: `1px solid ${color}`,
                        whiteSpace: "nowrap",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {kindLabel} · {fmtMin(durMin)}
                      {showName ? ` · ${monteurName}` : ""}
                    </div>
                  </OverlayView>
                </Fragment>
              );
            })}
          </GoogleMap>
        )}

        {/* Legende rechts oben — kompakte Box */}
        {isLoaded && (
          <div
            className="absolute top-3 right-3 bg-white/96 border border-[var(--border)] px-3 py-2.5 text-[10.5px] z-10 shadow-sm"
            style={{ maxWidth: 220 }}
          >
            <div className="text-[9.5px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mb-1.5">
              Legende
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block"
                style={{
                  width: 18,
                  height: 3,
                  background: COLOR_SPRINTER,
                }}
              />
              <span>🚐 Sprinter (mit Pickups)</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block"
                style={{
                  width: 18,
                  height: 2,
                  backgroundImage: `linear-gradient(to right, ${COLOR_BAHN} 50%, transparent 50%)`,
                  backgroundSize: "6px 2px",
                }}
              />
              <span>🚂 Bahn (Luftlinie)</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-block"
                style={{
                  width: 18,
                  height: 2,
                  background: COLOR_DIREKT,
                }}
              />
              <span>🚗 PKW eigene Anreise</span>
            </div>
            <div className="border-t border-[var(--border)] pt-1.5 mt-1.5">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center justify-center text-white font-bold"
                  style={{
                    width: 14,
                    height: 14,
                    background: "#f5c242",
                    border: "1.5px solid #8a5a00",
                    borderRadius: "50%",
                    fontSize: 9,
                  }}
                >
                  ★
                </span>
                <span>Sprinter-Start-NL</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block"
                  style={{
                    width: 14,
                    height: 14,
                    background: "#e00028",
                    border: "1.5px solid white",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 1px #800014",
                  }}
                />
                <span>🎯 Baustelle</span>
              </div>
            </div>
          </div>
        )}
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

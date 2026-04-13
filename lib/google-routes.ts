// Google Routes API wrapper — server-only (uses GOOGLE_ROUTES_API_KEY).

const ROUTES_BASE = "https://routes.googleapis.com";

export type LatLng = { lat: number; lng: number };

type Waypoint = { location: { latLng: { latitude: number; longitude: number } } };

function toWaypoint(p: LatLng): Waypoint {
  return { location: { latLng: { latitude: p.lat, longitude: p.lng } } };
}

function getApiKey(): string {
  const key = process.env.GOOGLE_ROUTES_API_KEY;
  if (!key) {
    throw new Error("GOOGLE_ROUTES_API_KEY is not set (server env)");
  }
  return key;
}

function parseDurationSeconds(d: string | undefined): number {
  // API returns e.g. "1234s"
  if (!d) return Number.POSITIVE_INFINITY;
  const m = /^(\d+)s$/.exec(d);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
}

export type MatrixResult = {
  originIndex: number;
  destinationIndex: number;
  durationSec: number;
  distanceMeters: number;
};

export async function computeRouteMatrix(
  origins: LatLng[],
  destinations: LatLng[],
): Promise<MatrixResult[]> {
  const body = {
    origins: origins.map((o) => ({ waypoint: toWaypoint(o) })),
    destinations: destinations.map((d) => ({ waypoint: toWaypoint(d) })),
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
  };

  const res = await fetch(`${ROUTES_BASE}/distanceMatrix/v2:computeRouteMatrix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask":
        "originIndex,destinationIndex,duration,distanceMeters,condition",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Routes Matrix ${res.status}: ${text}`);
  }

  const json = (await res.json()) as Array<{
    originIndex: number;
    destinationIndex: number;
    duration?: string;
    distanceMeters?: number;
    condition?: string;
  }>;

  return json.map((row) => ({
    originIndex: row.originIndex ?? 0,
    destinationIndex: row.destinationIndex ?? 0,
    durationSec: parseDurationSeconds(row.duration),
    distanceMeters: row.distanceMeters ?? 0,
  }));
}

export type ComputedRoute = {
  durationSec: number;
  distanceMeters: number;
  encodedPolyline: string;
};

export async function computeRoute(
  origin: LatLng,
  destination: LatLng,
  intermediates: LatLng[] = [],
): Promise<ComputedRoute> {
  const body = {
    origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
    destination: {
      location: { latLng: { latitude: destination.lat, longitude: destination.lng } },
    },
    intermediates: intermediates.map((p) => ({
      location: { latLng: { latitude: p.lat, longitude: p.lng } },
    })),
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    polylineEncoding: "ENCODED_POLYLINE",
  };

  const res = await fetch(`${ROUTES_BASE}/directions/v2:computeRoutes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask":
        "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Routes computeRoutes ${res.status}: ${text}`);
  }

  const json = (await res.json()) as {
    routes?: Array<{
      duration?: string;
      distanceMeters?: number;
      polyline?: { encodedPolyline?: string };
    }>;
  };

  const r = json.routes?.[0];
  if (!r) throw new Error("Routes computeRoutes: no route returned");

  return {
    durationSec: parseDurationSeconds(r.duration),
    distanceMeters: r.distanceMeters ?? 0,
    encodedPolyline: r.polyline?.encodedPolyline ?? "",
  };
}

"use client";

import { useEffect, useState } from "react";
import type { AnreiseEntscheidung } from "@/lib/route-optimizer";

export type LatLng = { lat: number; lng: number };

export type PolylineOut = {
  kind: "sprinter" | "direkt" | "bahn";
  monteurIds: string[];
  encodedPolyline: string;
  durationSec: number;
  distanceMeters: number;
};

export type OptimizeResponse = {
  startNl: {
    id: string;
    name: string;
    stadt: string;
    koordinaten: LatLng;
    fahrzeitMin: number;
    begruendung: string;
  };
  kandidaten: Array<{
    id: string;
    name: string;
    stadt: string;
    fahrzeitMin: number;
    tSprinterMin: number;
    summeMonteurZugangMin: number;
    totalCostMin: number;
    gewaehlt: boolean;
    breakdown: Array<{
      monteurId: string;
      kostenMin: number;
      pfad: "direkt" | "zum_hub" | "sprinter_fahrer";
    }>;
  }>;
  strategien: AnreiseEntscheidung[];
  polylines: PolylineOut[];
  eckdaten: {
    anfrageId: string;
    baustelle: LatLng;
    werkzeugAnforderung: "standard" | "schwerlast";
  };
  generatedAt: string;
};

const CACHE_KEY_PREFIX = "scholpp-route-cache-v1:";

export function localCacheKey(anfrageId: string, monteurIds: string[]): string {
  return `${CACHE_KEY_PREFIX}${anfrageId}|${[...monteurIds].sort().join(",")}`;
}

export function readLocalCache(key: string): OptimizeResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as OptimizeResponse) : null;
  } catch {
    return null;
  }
}

function writeLocalCache(key: string, value: OptimizeResponse): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// In-memory promise dedupe — multiple components hooking on same data
// only trigger one fetch.
const inflight = new Map<string, Promise<OptimizeResponse>>();
const memoryCache = new Map<string, OptimizeResponse>();

export type UseRouteOptimizationState = {
  data: OptimizeResponse | null;
  loading: boolean;
  error: string | null;
  usedCache: boolean;
};

export function useRouteOptimization(
  anfrageId: string,
  monteurIds: string[],
): UseRouteOptimizationState {
  const key = localCacheKey(anfrageId, monteurIds);

  const [data, setData] = useState<OptimizeResponse | null>(
    () => memoryCache.get(key) ?? null,
  );
  const [loading, setLoading] = useState<boolean>(!memoryCache.has(key));
  const [error, setError] = useState<string | null>(null);
  const [usedCache, setUsedCache] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (memoryCache.has(key)) {
      setData(memoryCache.get(key)!);
      setLoading(false);
      return;
    }

    let promise = inflight.get(key);
    if (!promise) {
      promise = fetch("/api/optimize-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anfrageId, monteurIds }),
      }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API ${res.status}: ${text}`);
        }
        const json = (await res.json()) as OptimizeResponse;
        memoryCache.set(key, json);
        writeLocalCache(key, json);
        return json;
      });
      inflight.set(key, promise);
    }

    promise
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setUsedCache(false);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const cached = readLocalCache(key);
        if (cached) {
          memoryCache.set(key, cached);
          setData(cached);
          setUsedCache(true);
          setLoading(false);
        } else {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
        inflight.delete(key);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error, usedCache };
}

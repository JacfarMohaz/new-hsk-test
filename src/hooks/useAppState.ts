"use client";

import { useCallback, useSyncExternalStore } from "react";
import { loadState, saveState, type AppState } from "@/lib/storage";

let cache: AppState | null = null;
let hasLoaded = false;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!hasLoaded && typeof window !== "undefined") {
    hasLoaded = true;
    cache = loadState();
    emitChange();
  }
  return () => listeners.delete(listener);
}

function getSnapshot(): AppState | null {
  return cache;
}

function getServerSnapshot(): AppState | null {
  return null;
}

/**
 * Shared, client-only app state backed by localStorage. Uses useSyncExternalStore
 * (rather than useState+useEffect) so the initial null snapshot matches SSR exactly,
 * and every component sharing this hook stays in sync without prop drilling.
 */
export function useAppState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback((updater: (state: AppState) => AppState) => {
    const base = cache ?? loadState();
    const next = updater(base);
    saveState(next);
    cache = next;
    emitChange();
  }, []);

  const refresh = useCallback(() => {
    cache = loadState();
    emitChange();
  }, []);

  return { state, update, refresh, loaded: state !== null };
}

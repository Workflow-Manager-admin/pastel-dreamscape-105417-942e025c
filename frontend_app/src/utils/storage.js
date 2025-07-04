//
// PUBLIC_INTERFACE
// Utility functions for robust localStorage persistence with error handling and graceful fallback.
// Usage in all stateful components to persist/load profile, journal, room, moods, etc.
// If localStorage is unavailable (e.g. privacy mode, quota, non-browser), falls back to in-memory object.
//
import { useState, useEffect, useRef } from "react";

const memoryStore = {};

function isLocalStorageAvailable() {
  try {
    const testKey = "__dreamscape-test";
    window.localStorage.setItem(testKey, "t");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// PUBLIC_INTERFACE
export function getStored(key, fallback = undefined) {
  // Attempts to get from localStorage, else uses in-memory fallback
  if (isLocalStorageAvailable()) {
    try {
      const value = window.localStorage.getItem(key);
      if (value == null) return fallback;
      return JSON.parse(value);
    } catch (err) {
      // Corrupt or unserializable, return fallback
      return fallback;
    }
  } else {
    return key in memoryStore ? memoryStore[key] : fallback;
  }
}

// PUBLIC_INTERFACE
export function setStored(key, value) {
  // Attempts to write to localStorage, else to in-memory store
  try {
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      memoryStore[key] = value;
    }
  } catch (err) {
    // Out of quota, disabled, etc. — fallback to memory only
    memoryStore[key] = value;
  }
}

// PUBLIC_INTERFACE
export function removeStored(key) {
  // Remove from both localStorage and memory fallback
  try {
    if (isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore, continue to clear memory fallback
  }
  delete memoryStore[key];
}

// PUBLIC_INTERFACE
/**
 * Hook for single-object persistence synced with localStorage; handles serialization errors/fallbacks.
 * - key: storage key string
 * - defaultValue: seed value if nothing stored
 * Returns [state, setState], i.e. identical to useState
 */
export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const stored = getStored(key);
    if (stored == null) return defaultValue;
    return stored;
  });
  // Only initialize default once per session
  const didLoad = useRef(false);

  useEffect(() => {
    if (!didLoad.current) {
      didLoad.current = true;
      return;
    }
    setStored(key, state);
    // eslint-disable-next-line
  }, [key, state]);
  return [state, setState];
}

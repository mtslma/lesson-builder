import { useEffect, useMemo, useState } from 'react';

const STORAGE_PREFIX = 'english-platform-editor.preview-state';

const readStoredValue = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(`${STORAGE_PREFIX}.${key}`);
    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

export const usePersistedPreviewState = <T,>(key: string, fallback: T) => {
  const storageKey = useMemo(() => `${STORAGE_PREFIX}.${key}`, [key]);
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback));

  useEffect(() => {
    setValue(readStoredValue(key, fallback));
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Ignore preview autosave failures so exercise interaction never crashes the editor.
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
};

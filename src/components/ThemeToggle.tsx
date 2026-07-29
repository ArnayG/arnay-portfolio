"use client";

import { useSyncExternalStore } from "react";

/**
 * The theme lives on <html> as a class, set before paint by the script in
 * layout.tsx. That makes the DOM the source of truth rather than React state,
 * so it's read through useSyncExternalStore: the server snapshot keeps
 * hydration stable, then the real value swaps in.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage disabled. The toggle still works, it just won't persist.
    }
    listeners.forEach((listener) => listener());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Invert colour scheme"
      className="font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase transition-colors hover:text-ink"
    >
      [ Invert ]
    </button>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * A faint halo that follows the cursor.
 *
 * Cheap by construction: one fixed element that never changes size or colour,
 * moved with a composited transform inside a single requestAnimationFrame per
 * frame, so a burst of pointermove events collapses into one write. It sits
 * below the drawing canvas and the navbar, and never takes pointer events.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Pointless on touch, and it's cursor-tied motion, so honour the setting.
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let x = 0;
    let y = 0;
    let frame = 0;
    let shown = false;

    const paint = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      shown = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-20 h-[420px] w-[420px] opacity-0 transition-opacity duration-500"
      style={{
        background: "radial-gradient(circle, var(--glow) 0%, transparent 62%)",
      }}
    />
  );
}

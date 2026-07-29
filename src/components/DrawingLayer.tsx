"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToolPalette from "@/components/ToolPalette";
import {
  addStroke,
  clearStrokes,
  getStrokes,
  paintStroke,
  setActiveTool,
  strokeColors,
  TOOLS,
  useDoodle,
  type Point,
  type Stroke,
  type StrokeColors,
  type Tool,
} from "@/lib/doodle";

/** Points closer than this are dropped; keeps stroke data small. */
const MIN_STEP = 1.25;
/** Backstop so a very long session can't grow redraw cost without bound. */
const MAX_POINTS = 40_000;

export default function DrawingLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const current = useRef<Stroke | null>(null);
  const pointCount = useRef(0);
  const frame = useRef(0);
  const colors = useRef<StrokeColors>({ pencil: "rgb(0 0 0)", pen: "rgb(0 0 0)" });

  const [tool, setTool] = useState<Tool>("cursor");
  const [enabled, setEnabled] = useState(false);
  const { strokeCount } = useDoodle();

  /** Resolve stroke colours from the theme tokens, so drawings follow it. */
  const readColors = useCallback(() => {
    colors.current = strokeColors();
  }, []);

  /** Finished strokes live in the store, so the business card can export them. */
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dx = -window.scrollX;
    const dy = -window.scrollY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of getStrokes()) paintStroke(ctx, stroke, dx, dy, colors.current);
    if (current.current) paintStroke(ctx, current.current, dx, dy, colors.current);
  }, []);

  const scheduleRedraw = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      redraw();
    });
  }, [redraw]);

  /** Only the newest curve piece, so a move costs the same at any length. */
  const drawTip = useCallback((s: Stroke) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = s.points;
    const n = p.length;
    const sx = window.scrollX;
    const sy = window.scrollY;
    ctx.strokeStyle = colors.current[s.tool];
    ctx.lineWidth = TOOLS[s.tool].width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    if (n === 2) {
      ctx.moveTo(p[0].x - sx, p[0].y - sy);
      ctx.lineTo(p[1].x - sx, p[1].y - sy);
    } else {
      const [a, b, c] = [p[n - 3], p[n - 2], p[n - 1]];
      ctx.moveTo((a.x + b.x) / 2 - sx, (a.y + b.y) / 2 - sy);
      ctx.quadraticCurveTo(
        b.x - sx,
        b.y - sy,
        (b.x + c.x) / 2 - sx,
        (b.y + c.y) / 2 - sy,
      );
    }
    ctx.stroke();
  }, []);

  // Mouse-driven feature: on touch, a full-page canvas would swallow scrolling.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  // The card lies flat while a pen is out, so the store carries the tool.
  useEffect(() => {
    setActiveTool(enabled ? tool : "cursor");
  }, [tool, enabled]);

  // Size to the viewport, and follow theme changes and scrolling.
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      redraw();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", scheduleRedraw, { passive: true });

    const observer = new MutationObserver(() => {
      readColors();
      scheduleRedraw();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scheduleRedraw);
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled, readColors, redraw, scheduleRedraw]);

  const toDoc = (e: React.PointerEvent): Point => ({
    x: e.clientX + window.scrollX,
    y: e.clientY + window.scrollY,
  });

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === "cursor" || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    current.current = { tool, points: [toDoc(e)] };
    pointCount.current += 1;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      paintStroke(ctx, current.current, -window.scrollX, -window.scrollY, colors.current);
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const s = current.current;
    if (!s) return;

    // Coalesced events recover the samples the browser batched between frames.
    const native = e.nativeEvent as PointerEvent & {
      getCoalescedEvents?: () => PointerEvent[];
    };
    const raw = native.getCoalescedEvents?.() ?? [];
    const batch = raw.length
      ? raw.map((ev) => ({
          x: ev.clientX + window.scrollX,
          y: ev.clientY + window.scrollY,
        }))
      : [toDoc(e)];

    for (const pt of batch) {
      const prev = s.points[s.points.length - 1];
      if (Math.hypot(pt.x - prev.x, pt.y - prev.y) < MIN_STEP) continue;
      if (pointCount.current >= MAX_POINTS) return;
      s.points.push(pt);
      pointCount.current += 1;
      drawTip(s);
    }
  }

  function endStroke() {
    if (!current.current) return;
    addStroke(current.current);
    current.current = null;
  }

  function clearAll() {
    current.current = null;
    pointCount.current = 0;
    clearStrokes();
    redraw();
  }

  if (!enabled) return null;

  const drawing = tool !== "cursor";

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        className={`fixed inset-0 z-30 ${
          drawing ? "cursor-crosshair" : "pointer-events-none"
        }`}
      />

      <ToolPalette
        tool={tool}
        onSelect={setTool}
        onClear={clearAll}
        canClear={strokeCount > 0}
      />
    </>
  );
}

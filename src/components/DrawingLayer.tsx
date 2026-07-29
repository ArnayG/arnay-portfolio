"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToolPalette from "@/components/ToolPalette";

export type Tool = "cursor" | "pencil" | "pen";
type DrawTool = Exclude<Tool, "cursor">;
type Point = { x: number; y: number };
type Stroke = { tool: DrawTool; points: Point[] };

/**
 * Pencil is a lighter tone rather than a translucent one. Drawing each new
 * segment on top of the last means overlapping round caps, and with alpha < 1
 * every join would darken into a visible bead — a solid blended colour keeps
 * the stroke even.
 */
const TOOLS: Record<DrawTool, { width: number; inkMix: number }> = {
  pencil: { width: 1.5, inkMix: 0.5 },
  pen: { width: 2.5, inkMix: 1 },
};

/** Points closer than this are dropped; keeps stroke data small. */
const MIN_STEP = 1.25;
/** Backstop so a very long session can't grow redraw cost without bound. */
const MAX_POINTS = 40_000;

function parseColor(value: string): [number, number, number] {
  const hex = value.trim();
  if (hex.startsWith("#")) {
    const n = hex.slice(1);
    const full =
      n.length === 3
        ? n
            .split("")
            .map((c) => c + c)
            .join("")
        : n;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  }
  const nums = hex.match(/[\d.]+/g);
  return nums
    ? [Number(nums[0]), Number(nums[1]), Number(nums[2])]
    : [0, 0, 0];
}

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  const c = a.map((v, i) => Math.round(v * t + b[i] * (1 - t)));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

export default function DrawingLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const pointCount = useRef(0);
  const frame = useRef(0);
  const colors = useRef<Record<DrawTool, string>>({
    pencil: "rgb(0 0 0)",
    pen: "rgb(0 0 0)",
  });

  const [tool, setTool] = useState<Tool>("cursor");
  const [enabled, setEnabled] = useState(false);
  const [hasInk, setHasInk] = useState(false);

  /** Resolve stroke colours from the theme tokens, so drawings follow it. */
  const readColors = useCallback(() => {
    const cs = getComputedStyle(document.documentElement);
    const ink = parseColor(cs.getPropertyValue("--ink"));
    const paper = parseColor(cs.getPropertyValue("--paper"));
    colors.current = {
      pencil: mix(ink, paper, TOOLS.pencil.inkMix),
      pen: mix(ink, paper, TOOLS.pen.inkMix),
    };
  }, []);

  const strokeStyleFor = (ctx: CanvasRenderingContext2D, t: DrawTool) => {
    ctx.strokeStyle = colors.current[t];
    ctx.fillStyle = colors.current[t];
    ctx.lineWidth = TOOLS[t].width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  /** Points are in document space; the canvas is viewport-sized and fixed. */
  const drawWhole = useCallback((ctx: CanvasRenderingContext2D, s: Stroke) => {
    const { points: p } = s;
    const sx = window.scrollX;
    const sy = window.scrollY;
    strokeStyleFor(ctx, s.tool);

    if (p.length === 1) {
      ctx.beginPath();
      ctx.arc(p[0].x - sx, p[0].y - sy, TOOLS[s.tool].width / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(p[0].x - sx, p[0].y - sy);
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i].x + p[i + 1].x) / 2;
      const my = (p[i].y + p[i + 1].y) / 2;
      ctx.quadraticCurveTo(p[i].x - sx, p[i].y - sy, mx - sx, my - sy);
    }
    const last = p[p.length - 1];
    ctx.lineTo(last.x - sx, last.y - sy);
    ctx.stroke();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of strokes.current) drawWhole(ctx, s);
    if (current.current) drawWhole(ctx, current.current);
  }, [drawWhole]);

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
    strokeStyleFor(ctx, s.tool);
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
    setHasInk(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawWhole(ctx, current.current);
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
    strokes.current.push(current.current);
    current.current = null;
  }

  function clearAll() {
    strokes.current = [];
    current.current = null;
    pointCount.current = 0;
    setHasInk(false);
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
        canClear={hasInk}
      />
    </>
  );
}

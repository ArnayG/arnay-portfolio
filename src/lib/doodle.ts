"use client";

import { useSyncExternalStore } from "react";

export type DrawTool = "pencil" | "pen";
export type Tool = "cursor" | DrawTool;
export type Point = { x: number; y: number };
/** Document-space extent of a finished stroke, for cheap hit tests. */
export type Bounds = { left: number; top: number; right: number; bottom: number };
export type Stroke = { tool: DrawTool; points: Point[] };
export type StoredStroke = Stroke & { bounds: Bounds };

/**
 * Pencil is a lighter tone rather than a translucent one. Drawing each new
 * segment on top of the last means overlapping round caps, and with alpha < 1
 * every join would darken into a visible bead. A solid blended colour keeps
 * the stroke even.
 */
export const TOOLS: Record<DrawTool, { width: number; inkMix: number }> = {
  pencil: { width: 1.5, inkMix: 0.5 },
  pen: { width: 2.5, inkMix: 1 },
};

export type StrokeColors = Record<DrawTool, string>;

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
  return nums ? [Number(nums[0]), Number(nums[1]), Number(nums[2])] : [0, 0, 0];
}

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  const c = a.map((v, i) => Math.round(v * t + b[i] * (1 - t)));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

/** Stroke colours come from the theme tokens, so drawings follow the theme. */
export function strokeColors(): StrokeColors {
  const cs = getComputedStyle(document.documentElement);
  const ink = parseColor(cs.getPropertyValue("--ink"));
  const paper = parseColor(cs.getPropertyValue("--paper"));
  return {
    pencil: mix(ink, paper, TOOLS.pencil.inkMix),
    pen: mix(ink, paper, TOOLS.pen.inkMix),
  };
}

/**
 * Paints a whole stroke. Points are in document space; `dx`/`dy` shift them
 * into whatever space the target canvas uses — the viewport overlay passes the
 * negated scroll offset, the exporter also subtracts the card's own origin.
 * Shared so the exported ink is the same curve the visitor saw on screen.
 */
export function paintStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  dx: number,
  dy: number,
  colors: StrokeColors,
) {
  const { width } = TOOLS[stroke.tool];
  const p = stroke.points;
  if (!p.length) return;

  ctx.strokeStyle = colors[stroke.tool];
  ctx.fillStyle = colors[stroke.tool];
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (p.length === 1) {
    ctx.beginPath();
    ctx.arc(p[0].x + dx, p[0].y + dy, width / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(p[0].x + dx, p[0].y + dy);
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i].x + p[i + 1].x) / 2;
    const my = (p[i].y + p[i + 1].y) / 2;
    ctx.quadraticCurveTo(p[i].x + dx, p[i].y + dy, mx + dx, my + dy);
  }
  const last = p[p.length - 1];
  ctx.lineTo(last.x + dx, last.y + dy);
  ctx.stroke();
}

export function boundsOf(points: Point[]): Bounds {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const p of points) {
    if (p.x < left) left = p.x;
    if (p.x > right) right = p.x;
    if (p.y < top) top = p.y;
    if (p.y > bottom) bottom = p.y;
  }
  return { left, top, right, bottom };
}

export function boundsOverlap(a: Bounds, b: Bounds) {
  return a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;
}

/* ── Store ────────────────────────────────────────────────────────────────
   The canvas lives in the layout and the business card lives in the page, so
   they have no common ancestor to hang a provider off. A module store lets
   the card read the ink (and the active tool) without either component
   knowing the other exists.
   ──────────────────────────────────────────────────────────────────────── */

export type DoodleSnapshot = {
  /** Bumped on every change, so consumers can re-measure geometry. */
  version: number;
  strokeCount: number;
  tool: Tool;
};

const INITIAL: DoodleSnapshot = { version: 0, strokeCount: 0, tool: "cursor" };

let strokes: StoredStroke[] = [];
let activeTool: Tool = "cursor";
let snapshot: DoodleSnapshot = INITIAL;
const listeners = new Set<() => void>();

function emit() {
  snapshot = {
    version: snapshot.version + 1,
    strokeCount: strokes.length,
    tool: activeTool,
  };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Live array — read it on demand, keyed off `version`, never hold onto it. */
export function getStrokes(): readonly StoredStroke[] {
  return strokes;
}

export function addStroke(stroke: Stroke) {
  strokes.push({ ...stroke, bounds: boundsOf(stroke.points) });
  emit();
}

export function clearStrokes() {
  strokes = [];
  emit();
}

export function setActiveTool(tool: Tool) {
  if (tool === activeTool) return;
  activeTool = tool;
  emit();
}

export function useDoodle(): DoodleSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => INITIAL,
  );
}

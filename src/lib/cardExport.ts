"use client";

import { getStrokes, paintStroke, strokeColors } from "@/lib/doodle";

/* ── Card → PNG ───────────────────────────────────────────────────────────
   The poster is painted from the live card's own geometry and computed
   styles rather than a hand-copied layout, so it can't drift when the card
   is edited, and it picks up the visitor's current theme for free.

   Only the constructs the card actually uses are handled: backgrounds, flat
   borders, the unblurred offset shadow, text runs, inline SVG and images.
   ──────────────────────────────────────────────────────────────────────── */

/** Export resolution multiplier — 3× keeps the hairlines crisp when shared. */
const SCALE = 3;
/** Dot-grid ground around the card, in card pixels. */
const PAD = 40;
/** Strip under the card holding the caption. */
const CAPTION = 32;
/** Offset of the letterpress shadow under the card. */
const SHADOW = 8;
/** Matches the .dot-grid utility in globals.css. */
const DOT_STEP = 22;

type Ctx = CanvasRenderingContext2D;
type Box = { x: number; y: number; w: number; h: number };

/**
 * Canvas letter-spacing is typed but not universally implemented. Kept behind
 * a function so the check can't narrow the context type at the call site.
 */
function supportsLetterSpacing(ctx: Ctx) {
  return "letterSpacing" in ctx;
}

type Theme = {
  paper: string;
  ink: string;
  rule: string;
  muted: string;
  dot: string;
  mono: string;
};

function readTheme(): Theme {
  const cs = getComputedStyle(document.documentElement);
  const token = (name: string) => cs.getPropertyValue(name).trim();
  return {
    paper: token("--paper") || "#ffffff",
    ink: token("--ink") || "#0a0a0a",
    rule: token("--rule") || "#d8d6d2",
    muted: token("--ink-muted") || "#5c5c5c",
    dot: token("--dot") || "rgb(10 10 10 / 0.07)",
    mono: token("--font-geist-mono") || "monospace",
  };
}

function isPainted(color: string) {
  if (!color || color === "transparent" || color === "none") return false;
  const alpha = color.match(/^rgba?\([^)]*?,\s*([\d.]+)\s*\)$/);
  return !alpha || Number(alpha[1]) > 0;
}

function px(value: string) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Everything below `[data-export-crop]` is site furniture (the export controls
 * themselves), so the poster ends just above it, plus the card's own padding.
 */
function posterCardHeight(card: HTMLElement, origin: DOMRect) {
  const crop = card.querySelector<HTMLElement>("[data-export-crop]");
  if (!crop) return origin.height;
  const cs = getComputedStyle(card);
  const inset = px(cs.paddingBottom) + px(cs.borderBottomWidth);
  const height = crop.getBoundingClientRect().top - origin.top + inset;
  return height > 80 ? height : origin.height;
}

export async function renderCardPoster(card: HTMLElement): Promise<Blob> {
  // Canvas text needs the webfonts resolved, or it falls back to a system face.
  if (document.fonts?.ready) await document.fonts.ready;

  const theme = readTheme();
  const origin = card.getBoundingClientRect();
  const cardW = origin.width;
  const cardH = posterCardHeight(card, origin);
  const groundW = cardW + PAD * 2;
  const groundH = cardH + PAD * 2 + CAPTION;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(groundW * SCALE);
  canvas.height = Math.round(groundH * SCALE);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = theme.paper;
  ctx.fillRect(0, 0, groundW, groundH);
  paintDotGrid(ctx, groundW, groundH, theme.dot);

  ctx.save();
  ctx.translate(PAD, PAD);

  // Plate offset in --rule rather than --ink, so the crop marks that sit over
  // it stay legible.
  ctx.fillStyle = theme.rule;
  ctx.fillRect(SHADOW, SHADOW, cardW, cardH);

  await paintElement(ctx, card, origin, cardH);

  // Ink is clipped to the trim: it reads as drawn on the card, not around it.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, cardW, cardH);
  ctx.clip();
  paintInk(ctx, origin);
  ctx.restore();

  ctx.restore();

  paintCaption(ctx, groundW, PAD + cardH + (PAD + CAPTION) / 2, theme);
  return toBlob(canvas);
}

function paintDotGrid(ctx: Ctx, w: number, h: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  for (let y = DOT_STEP / 2; y < h; y += DOT_STEP) {
    for (let x = DOT_STEP / 2; x < w; x += DOT_STEP) {
      ctx.beginPath();
      ctx.arc(x, y, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function paintCaption(ctx: Ctx, groundW: number, y: number, theme: Theme) {
  const host = window.location.host.replace(/^www\./, "");
  const inked = getStrokes().length > 0;
  const text = `${host || "arnay garhyan"}${inked ? " · doodle edition" : ""}`;

  ctx.save();
  ctx.font = `500 11px ${theme.mono}`;
  ctx.fillStyle = theme.muted;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (supportsLetterSpacing(ctx)) ctx.letterSpacing = "0.18em";
  ctx.fillText(text.toUpperCase(), groundW / 2, y);
  if (supportsLetterSpacing(ctx)) ctx.letterSpacing = "0px";
  ctx.restore();
}

/** Strokes are stored in document space; the card box is the poster's origin. */
function paintInk(ctx: Ctx, origin: DOMRect) {
  const strokes = getStrokes();
  if (!strokes.length) return;
  const colors = strokeColors();
  const dx = -(window.scrollX + origin.left);
  const dy = -(window.scrollY + origin.top);
  for (const stroke of strokes) paintStroke(ctx, stroke, dx, dy, colors);
}

/**
 * `overrideH` lets the root card be painted at the cropped height, so its
 * bottom border lands on the trim rather than below the poster.
 */
async function paintElement(
  ctx: Ctx,
  el: Element,
  origin: DOMRect,
  overrideH?: number,
): Promise<void> {
  if (el instanceof HTMLElement && el.dataset.exportHide !== undefined) return;

  const cs = getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden") return;
  const alpha = Number(cs.opacity);
  if (alpha === 0) return;

  const rect = el.getBoundingClientRect();
  const box: Box = {
    x: rect.left - origin.left,
    y: rect.top - origin.top,
    w: rect.width,
    h: overrideH ?? rect.height,
  };
  if (!box.w || !box.h) return;

  ctx.save();
  if (Number.isFinite(alpha) && alpha < 1) ctx.globalAlpha *= alpha;

  paintShadow(ctx, cs.boxShadow, box);
  if (isPainted(cs.backgroundColor)) {
    ctx.fillStyle = cs.backgroundColor;
    ctx.fillRect(box.x, box.y, box.w, box.h);
  }
  paintBorders(ctx, cs, box);

  if (el instanceof SVGSVGElement) {
    await paintSvg(ctx, el, box, cs);
    ctx.restore();
    return;
  }
  if (el instanceof HTMLImageElement) {
    paintImage(ctx, el, box, cs);
    ctx.restore();
    return;
  }

  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) paintText(ctx, node as Text, cs, origin);
    else if (node.nodeType === Node.ELEMENT_NODE) {
      await paintElement(ctx, node as Element, origin);
    }
  }
  ctx.restore();
}

/** Handles the flat offset shadow the site uses; anything blurred is skipped. */
function paintShadow(ctx: Ctx, shadow: string, box: Box) {
  if (!shadow || shadow === "none" || shadow.includes("inset")) return;
  const match = shadow.match(
    /^(rgba?\([^)]*\)|#[0-9a-f]{3,8})\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?$/i,
  );
  if (!match) return;
  const [, color, ox, oy, blur, spread] = match;
  if (Number(blur) > 0 || !isPainted(color)) return;
  const grow = Number(spread ?? 0);

  // An outer shadow is never painted under its own border box — without the
  // hole it would show through anything with a transparent background.
  ctx.save();
  const region = new Path2D();
  region.rect(
    box.x + Number(ox) - grow,
    box.y + Number(oy) - grow,
    box.w + grow * 2,
    box.h + grow * 2,
  );
  region.rect(box.x, box.y, box.w, box.h);
  ctx.clip(region, "evenodd");
  ctx.fillStyle = color;
  ctx.fillRect(
    box.x + Number(ox) - grow,
    box.y + Number(oy) - grow,
    box.w + grow * 2,
    box.h + grow * 2,
  );
  ctx.restore();
}

function paintBorders(ctx: Ctx, cs: CSSStyleDeclaration, box: Box) {
  const side = (
    width: string,
    style: string,
    color: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    const t = px(width);
    if (!t || style === "none" || !isPainted(color)) return;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w || t, h || t);
  };

  const top = px(cs.borderTopWidth);
  const right = px(cs.borderRightWidth);
  const bottom = px(cs.borderBottomWidth);
  const left = px(cs.borderLeftWidth);

  side(cs.borderTopWidth, cs.borderTopStyle, cs.borderTopColor, box.x, box.y, box.w, top);
  side(
    cs.borderBottomWidth,
    cs.borderBottomStyle,
    cs.borderBottomColor,
    box.x,
    box.y + box.h - bottom,
    box.w,
    bottom,
  );
  side(cs.borderLeftWidth, cs.borderLeftStyle, cs.borderLeftColor, box.x, box.y, left, box.h);
  side(
    cs.borderRightWidth,
    cs.borderRightStyle,
    cs.borderRightColor,
    box.x + box.w - right,
    box.y,
    right,
    box.h,
  );
}

function transformText(text: string, transform: string) {
  if (transform === "uppercase") return text.toUpperCase();
  if (transform === "lowercase") return text.toLowerCase();
  return text;
}

/**
 * Text is measured a character at a time and grouped into the line boxes the
 * browser actually produced. Wrapping, alignment and letter-spacing then come
 * out right without re-implementing any of them.
 */
function paintText(ctx: Ctx, node: Text, cs: CSSStyleDeclaration, origin: DOMRect) {
  const raw = node.data;
  if (!raw.trim()) return;

  const shown = transformText(raw, cs.textTransform);
  // A transform that changes length would desync the per-character indices.
  const glyphs = shown.length === raw.length ? shown : raw;

  type Line = { top: number; bottom: number; parts: { x: number; glyph: string }[] };
  const lines: Line[] = [];
  const range = document.createRange();

  for (let i = 0; i < raw.length; i++) {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const r = range.getBoundingClientRect();
    if (!r.width && !r.height) continue; // collapsed whitespace

    let line = lines[lines.length - 1];
    if (!line || Math.abs(r.top - line.top) > 1) {
      line = { top: r.top, bottom: r.bottom, parts: [] };
      lines.push(line);
    }
    if (r.bottom > line.bottom) line.bottom = r.bottom;
    line.parts.push({ x: r.left, glyph: glyphs[i] });
  }
  if (!lines.length) return;

  const spacing = cs.letterSpacing;
  const spaced = Boolean(spacing) && spacing !== "normal" && px(spacing) !== 0;
  const canSpace = supportsLetterSpacing(ctx);

  ctx.save();
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.fillStyle = cs.color;
  ctx.textAlign = "left";
  // The line box is centred on the em box, so "middle" lands on the baseline
  // the browser used without having to dig out font metrics.
  ctx.textBaseline = "middle";
  if (canSpace) ctx.letterSpacing = spaced ? spacing : "0px";

  for (const line of lines) {
    const y = (line.top + line.bottom) / 2 - origin.top;
    if (spaced && !canSpace) {
      // Fall back to placing each glyph where the browser put it.
      for (const part of line.parts) ctx.fillText(part.glyph, part.x - origin.left, y);
    } else {
      const text = line.parts.map((part) => part.glyph).join("");
      ctx.fillText(text, line.parts[0].x - origin.left, y);
    }
  }

  if (canSpace) ctx.letterSpacing = "0px";
  ctx.restore();
}

/**
 * Inline SVG is serialised and drawn as an image: one path for any shape the
 * card uses. CSS variables and currentColor are resolved first, since the
 * standalone document has no stylesheet to inherit from.
 */
async function paintSvg(ctx: Ctx, svg: SVGSVGElement, box: Box, cs: CSSStyleDeclaration) {
  try {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(box.w));
    clone.setAttribute("height", String(box.h));

    const root = getComputedStyle(document.documentElement);
    const markup = new XMLSerializer()
      .serializeToString(clone)
      .replace(
        /var\(\s*(--[\w-]+)\s*\)/g,
        (_, name: string) => root.getPropertyValue(name).trim() || "currentColor",
      )
      .replace(/currentColor/g, cs.color);

    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
    await img.decode();
    ctx.drawImage(img, box.x, box.y, box.w, box.h);
  } catch {
    // A missing flourish beats a failed export.
  }
}

function paintImage(ctx: Ctx, img: HTMLImageElement, box: Box, cs: CSSStyleDeclaration) {
  if (!img.complete || !img.naturalWidth) return;
  ctx.save();
  if (cs.filter && cs.filter !== "none" && "filter" in ctx) ctx.filter = cs.filter;
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.w, box.h);
  ctx.clip();

  const fit = cs.objectFit;
  if (fit === "cover" || fit === "contain") {
    const ratios = [box.w / img.naturalWidth, box.h / img.naturalHeight];
    const scale = fit === "cover" ? Math.max(...ratios) : Math.min(...ratios);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
  } else {
    ctx.drawImage(img, box.x, box.y, box.w, box.h);
  }
  ctx.restore();
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the image"))),
      "image/png",
    );
  });
}

/* ── Sharing ──────────────────────────────────────────────────────────── */

export type ShareResult = "shared" | "saved" | "cancelled";

/**
 * Prefers the native share sheet — that's the route to Messages, Instagram or
 * WhatsApp — and falls back to a download where files can't be shared.
 */
export async function shareOrDownload(
  blob: Blob,
  filename: string,
  text: string,
): Promise<ShareResult> {
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Anything else (a share target that rejects files) falls through.
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Revoking in the same task can cancel the download before it starts.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "saved";
}

export function canCopyImage() {
  return (
    typeof window !== "undefined" &&
    typeof ClipboardItem !== "undefined" &&
    typeof navigator.clipboard?.write === "function"
  );
}

/** The practical route into a desktop iMessage or Slack thread: paste it. */
export async function copyImage(blob: Blob) {
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

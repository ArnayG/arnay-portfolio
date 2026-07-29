"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  canCopyImage,
  copyImage,
  renderCardPoster,
  shareOrDownload,
} from "@/lib/cardExport";
import { boundsOverlap, getStrokes, useDoodle, type Bounds } from "@/lib/doodle";
import { site } from "@/data/site";

/** Degrees of rotation at the far edge of the card. Small: it's a card, not a toy. */
const MAX_TILT = 7;
/** Travel of the letterpress shadow at full tilt, in px. */
const LIFT = 9;
const FOLLOW = "transform 90ms linear, box-shadow 90ms linear";
const SETTLE = "transform 340ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 340ms ease-out";

type Status = { tone: "ok" | "bad"; text: string } | null;

const slug = `${site.firstName}-${site.lastName}`.toLowerCase();

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}

export default function CardStage({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const aim = useRef({ nx: 0, ny: 0 });

  const { version, tool } = useDoodle();
  const [inked, setInked] = useState(0);
  const [busy, setBusy] = useState<null | "export" | "copy">(null);
  const [status, setStatus] = useState<Status>(null);
  /** Probed after mount, so the server and the first client render agree. */
  const [env, setEnv] = useState({ tiltable: false, canDraw: false, copyable: false });
  const { tiltable, canDraw, copyable } = env;

  // Tilt is a pointer affordance, and it has to stand down for reduced motion.
  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnv({
        canDraw: hover.matches,
        tiltable: hover.matches && !still.matches,
        copyable: canCopyImage(),
      });
    };
    sync();
    hover.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      hover.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  const flatten = useCallback((instant: boolean) => {
    const card = cardRef.current;
    if (!card) return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    card.style.transition = instant ? "none" : SETTLE;
    card.style.transform = "";
    card.style.boxShadow = "";
    card.style.willChange = "";
    if (instant) {
      void card.offsetWidth; // commit the flat state before anything is measured
      card.style.transition = "";
    }
  }, []);

  /**
   * A tilted card and the flat overlay the visitor draws on don't share a
   * plane, so ink would land away from the pixel under the cursor — and the
   * export would inherit that offset. The card lies flat while a pen is out.
   */
  useEffect(() => {
    if (tool !== "cursor") flatten(true);
  }, [tool, flatten]);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 4500);
    return () => clearTimeout(timer);
  }, [status]);

  // How much ink actually landed on the card, for the button's own labelling.
  // The stage is measured rather than the card: it never carries the tilt, so
  // its box is the card's true, unprojected one.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const box: Bounds = {
      left: r.left + window.scrollX,
      top: r.top + window.scrollY,
      right: r.right + window.scrollX,
      bottom: r.bottom + window.scrollY,
    };
    setInked(getStrokes().filter((stroke) => boundsOverlap(stroke.bounds, box)).length);
  }, [version]);

  const write = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const { nx, ny } = aim.current;
    card.style.transform = `perspective(1100px) rotateX(${(-ny * MAX_TILT).toFixed(2)}deg) rotateY(${(nx * MAX_TILT).toFixed(2)}deg) translateZ(6px)`;
    // The light stays put while the card turns, so the plate offset slides the
    // other way — the same trick as the printed shadow elsewhere on the site.
    card.style.boxShadow = `${(-nx * LIFT).toFixed(1)}px ${(-ny * LIFT).toFixed(1)}px 0 0 var(--rule)`;
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tiltable || tool !== "cursor" || busy) return;
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    aim.current = {
      nx: clamp(((event.clientX - r.left) / r.width) * 2 - 1),
      ny: clamp(((event.clientY - r.top) / r.height) * 2 - 1),
    };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      write();
    });
  }

  function onPointerEnter() {
    if (!tiltable || tool !== "cursor" || busy) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = FOLLOW;
    card.style.willChange = "transform";
  }

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  /** Flat and settled before a pixel is measured, tilt or no tilt. */
  const poster = useCallback(async () => {
    const card = cardRef.current;
    if (!card) throw new Error("The card is not on screen");
    flatten(true);
    // A backgrounded tab never paints, so the frame is raced against a timer
    // rather than waited on — otherwise the export would hang there.
    await new Promise((resolve) => {
      const frameId = requestAnimationFrame(() => resolve(null));
      setTimeout(() => {
        cancelAnimationFrame(frameId);
        resolve(null);
      }, 120);
    });
    return renderCardPoster(card);
  }, [flatten]);

  const filename = `${slug}-card${inked ? "-doodle" : ""}.png`;

  async function onExport() {
    if (busy) return;
    setBusy("export");
    setStatus(null);
    try {
      const blob = await poster();
      const result = await shareOrDownload(
        blob,
        filename,
        inked
          ? `${site.firstName} ${site.lastName}'s card, doodled on.`
          : `${site.firstName} ${site.lastName} — ${site.role}`,
      );
      if (result === "shared") setStatus({ tone: "ok", text: "Shared." });
      if (result === "saved") setStatus({ tone: "ok", text: `Saved ${filename}` });
    } catch (error) {
      console.error(error);
      setStatus({ tone: "bad", text: "That didn't print. Try again?" });
    } finally {
      setBusy(null);
    }
  }

  async function onCopy() {
    if (busy) return;
    setBusy("copy");
    setStatus(null);
    try {
      await copyImage(await poster());
      setStatus({ tone: "ok", text: "Copied — paste it anywhere." });
    } catch (error) {
      console.error(error);
      setStatus({ tone: "bad", text: "Couldn't copy. Export instead?" });
    } finally {
      setBusy(null);
    }
  }

  // While a pen is out the drawing canvas covers the whole page, this button
  // included, so the hint says what to do rather than leaving a dead control.
  const hint =
    tool !== "cursor"
      ? inked
        ? "Take the cursor back to export what you've drawn."
        : "Draw anywhere on the card, then take the cursor back."
      : inked
        ? `${inked} stroke${inked === 1 ? "" : "s"} on the card — take it with you.`
        : canDraw
          ? "Pick up a pen from the palette and doodle right on the card."
          : "Save the card as an image.";

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => flatten(false)}
      className="relative [perspective:1100px]"
    >
      <div ref={cardRef} className="relative border border-ink bg-paper p-4">
        {children}

        <div data-export-hide data-export-crop className="mt-4 border-t border-rule pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onExport}
              disabled={busy !== null}
              className="shadow-hard-sm inline-flex items-center gap-2 border border-ink px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-transform hover:translate-x-px hover:translate-y-px active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {busy === "export" ? "Printing" : inked ? "Export card + doodle" : "Export card"}
              <span
                aria-hidden="true"
                className={`text-mark ${busy === "export" ? "animate-pulse" : ""}`}
              >
                {busy === "export" ? "[•]" : "[↗]"}
              </span>
            </button>

            {copyable && (
              <button
                type="button"
                onClick={onCopy}
                disabled={busy !== null}
                aria-label="Copy card image"
                title="Copy image"
                className="inline-flex items-center border border-rule px-2.5 py-2 font-mono text-[10px] tracking-[0.15em] text-ink-muted uppercase transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
              >
                <span aria-hidden="true">{busy === "copy" ? "[•]" : "[⧉]"}</span>
              </button>
            )}
          </div>

          <p
            aria-live="polite"
            className={`mt-2 font-mono text-[10px] leading-relaxed tracking-[0.08em] ${
              status?.tone === "bad" ? "text-mark" : "text-ink-muted"
            }`}
          >
            {status?.text ?? hint}
          </p>
        </div>
      </div>
    </div>
  );
}

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
const TURN = "transform 560ms cubic-bezier(0.2, 0.75, 0.2, 1)";
const FLIPPED = "rotateY(180deg)";

type Status = { tone: "ok" | "bad"; text: string } | null;
type Face = "front" | "back";

const slug = `${site.firstName}-${site.lastName}`.toLowerCase();

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}

/** A backgrounded tab never paints, so the frame is raced against a timer. */
function nextFrame() {
  return new Promise<void>((resolve) => {
    const id = requestAnimationFrame(() => resolve());
    setTimeout(() => {
      cancelAnimationFrame(id);
      resolve();
    }, 120);
  });
}

type CardStageProps = {
  /** The front of the card. */
  children: React.ReactNode;
  /** The reverse, laid over the front and turned away until it's called for. */
  back: React.ReactNode;
};

/**
 * The interactive shell around a card that is otherwise static markup: the
 * cursor-driven tilt, the turn to the reverse, and the export controls.
 *
 * Tilt and flip live on separate layers on purpose. Composed into one
 * transform they would fight, since a flipped card is mirrored and every tilt
 * would read backwards; stacked, the tilt stays in screen space and behaves
 * the same whichever face is showing.
 */
export default function CardStage({ children, back }: CardStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const aim = useRef({ nx: 0, ny: 0 });

  const { version, tool } = useDoodle();
  const [flipped, setFlipped] = useState(false);
  const [inked, setInked] = useState(0);
  const [busy, setBusy] = useState<null | "export" | "copy">(null);
  const [status, setStatus] = useState<Status>(null);
  /** Probed after mount, so the server and the first client render agree. */
  const [env, setEnv] = useState({
    tiltable: false,
    canDraw: false,
    copyable: false,
    motion: false,
  });
  const { tiltable, canDraw, copyable, motion } = env;

  // Tilt is a pointer affordance, and it has to stand down for reduced motion.
  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnv({
        canDraw: hover.matches,
        tiltable: hover.matches && !still.matches,
        copyable: canCopyImage(),
        motion: !still.matches,
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

  // The turn is driven imperatively so the export can neutralise it without
  // React putting it straight back mid-measurement.
  useEffect(() => {
    const flip = flipRef.current;
    if (!flip) return;
    flip.style.transition = motion ? TURN : "none";
    flip.style.transform = flipped ? FLIPPED : "";
  }, [flipped, motion]);

  const flatten = useCallback((instant: boolean) => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    tilt.style.transition = instant ? "none" : SETTLE;
    tilt.style.transform = "";
    tilt.style.boxShadow = "";
    tilt.style.willChange = "";
    if (instant) {
      void tilt.offsetWidth; // commit the flat state before anything is measured
      tilt.style.transition = "";
    }
  }, []);

  /**
   * A tilted card and the flat overlay the visitor draws on don't share a
   * plane, so ink would land away from the pixel under the cursor, and the
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
    const tilt = tiltRef.current;
    if (!tilt) return;
    const { nx, ny } = aim.current;
    tilt.style.transform = `rotateX(${(-ny * MAX_TILT).toFixed(2)}deg) rotateY(${(nx * MAX_TILT).toFixed(2)}deg) translateZ(6px)`;
    // The light stays put while the card turns, so the plate offset slides the
    // other way, the same trick as the printed shadow elsewhere on the site.
    tilt.style.boxShadow = `${(-nx * LIFT).toFixed(1)}px ${(-ny * LIFT).toFixed(1)}px 0 0 var(--rule)`;
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
    const tilt = tiltRef.current;
    if (!tilt) return;
    tilt.style.transition = FOLLOW;
    tilt.style.willChange = "transform";
  }

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  /** Clicking the card turns it, the way you'd turn one over in your hand. */
  function onCardClick(event: React.MouseEvent<HTMLDivElement>) {
    if (busy) return;
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    if (window.getSelection()?.toString()) return; // a click that ended a selection
    setFlipped((was) => !was);
  }

  const face: Face = flipped ? "back" : "front";

  /**
   * Renders whichever face is showing. Every 3D transform comes off first: a
   * rotated element's box is its flat projection, so measuring one mid-turn
   * would put every glyph in the wrong place.
   */
  const poster = useCallback(async () => {
    const tilt = tiltRef.current;
    const flip = flipRef.current;
    const target = flip?.querySelector<HTMLElement>(`[data-face="${face}"]`);
    if (!tilt || !flip || !target) throw new Error("The card is not on screen");

    const saved = {
      tilt: tilt.style.transform,
      tiltEase: tilt.style.transition,
      flip: flip.style.transform,
      flipEase: flip.style.transition,
      target: target.style.transform,
    };

    flatten(true);
    tilt.style.transition = "none";
    tilt.style.transform = "none";
    flip.style.transition = "none";
    flip.style.transform = "none";
    target.style.transform = "none";
    await nextFrame();

    try {
      return await renderCardPoster(target);
    } finally {
      target.style.transform = saved.target;
      flip.style.transform = saved.flip;
      flip.style.transition = saved.flipEase;
      tilt.style.transform = saved.tilt;
      tilt.style.transition = saved.tiltEase;
    }
  }, [face, flatten]);

  const filename = `${slug}-card${flipped ? "-back" : inked ? "-doodle" : ""}.png`;

  async function onExport() {
    if (busy) return;
    setBusy("export");
    setStatus(null);
    try {
      const blob = await poster();
      const result = await shareOrDownload(
        blob,
        filename,
        inked && !flipped
          ? `${site.firstName} ${site.lastName}'s card, doodled on.`
          : `${site.firstName} ${site.lastName}, ${site.role}`,
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
      setStatus({ tone: "ok", text: "Copied. Paste it anywhere." });
    } catch (error) {
      console.error(error);
      setStatus({ tone: "bad", text: "Couldn't copy. Export instead?" });
    } finally {
      setBusy(null);
    }
  }

  // While a pen is out the drawing canvas covers the whole page, these buttons
  // included, so the hint says what to do rather than leaving a dead control.
  const hint =
    tool !== "cursor"
      ? inked
        ? "Take the cursor back to export what you've drawn."
        : "Draw anywhere on the card, then take the cursor back."
      : flipped
        ? "The reverse. Click the card to turn it back."
        : inked
          ? `${inked} stroke${inked === 1 ? "" : "s"} on the card. Take it with you.`
          : canDraw
            ? "Pick up a pen from the palette and doodle right on the card."
            : "Save the card as an image, or turn it over.";

  const faceClass =
    "border border-ink bg-paper p-4 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => flatten(false)}
      className="relative [perspective:900px]"
    >
      <div ref={tiltRef} className="relative [transform-style:preserve-3d]">
        <div
          ref={flipRef}
          onClick={onCardClick}
          className="relative [transform-style:preserve-3d]"
        >
          <div data-face="front" inert={flipped} aria-hidden={flipped} className={`relative ${faceClass}`}>
            {children}
          </div>

          <div
            data-face="back"
            inert={!flipped}
            aria-hidden={!flipped}
            className={`absolute inset-0 [transform:rotateY(180deg)] ${faceClass}`}
          >
            {back}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            disabled={busy !== null}
            className="shadow-hard-sm inline-flex items-center gap-2 border border-ink px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-transform hover:translate-x-px hover:translate-y-px active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          >
            {busy === "export"
              ? "Printing"
              : flipped
                ? "Export the back"
                : inked
                  ? "Export card + doodle"
                  : "Export card"}
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

          <button
            type="button"
            onClick={() => setFlipped((was) => !was)}
            disabled={busy !== null}
            aria-pressed={flipped}
            aria-label="Turn the card over"
            title="Turn the card over"
            className="inline-flex items-center border border-rule px-2.5 py-2 font-mono text-[10px] tracking-[0.15em] text-ink-muted uppercase transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
          >
            <span aria-hidden="true">[↻]</span>
          </button>
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
  );
}

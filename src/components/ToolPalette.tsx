import type { Tool } from "@/components/DrawingLayer";

type ToolPaletteProps = {
  tool: Tool;
  onSelect: (tool: Tool) => void;
  onClear: () => void;
  canClear: boolean;
};

const ICON = {
  className: "h-3.5 w-3.5",
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function CursorIcon() {
  return (
    <svg {...ICON} strokeWidth={1.2}>
      <path
        fill="currentColor"
        d="M4 2.2l7.6 5.9-3.5.5 1.9 4.1-1.8.8-1.9-4.1L4 11.9z"
      />
    </svg>
  );
}

/** Ring weight stands in for stroke weight: hairline for pencil, bold for pen. */
function ThinRingIcon() {
  return (
    <svg {...ICON} strokeWidth={1}>
      <circle cx="8" cy="8" r="5" />
    </svg>
  );
}

function ThickRingIcon() {
  return (
    <svg {...ICON} strokeWidth={3}>
      <circle cx="8" cy="8" r="4.4" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg {...ICON} strokeWidth={1.5}>
      <path d="M4.6 4.6l6.8 6.8" />
      <path d="M11.4 4.6l-6.8 6.8" />
    </svg>
  );
}

/**
 * Paint-well positions as percentages of the palette's viewBox, kept well
 * inside the outline and clear of the thumb hole at (75%, 50%).
 */
const WELLS: {
  value: Tool;
  label: string;
  icon: () => React.ReactElement;
  left: string;
  top: string;
}[] = [
  { value: "pencil", label: "Pencil", icon: ThinRingIcon, left: "30%", top: "33%" },
  { value: "pen", label: "Pen", icon: ThickRingIcon, left: "52%", top: "26%" },
  { value: "cursor", label: "Cursor", icon: CursorIcon, left: "27%", top: "63%" },
];

const WELL_BASE =
  "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-colors";

export default function ToolPalette({
  tool,
  onSelect,
  onClear,
  canClear,
}: ToolPaletteProps) {
  return (
    <div className="fixed right-8 bottom-8 z-50 h-40 w-52">
      {/* Outline only, so it reads as drawn rather than rendered. evenodd
          punches a real thumb hole. */}
      <svg
        viewBox="0 0 160 120"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <path
          fillRule="evenodd"
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="1.5"
          d="M74 8C112 8 152 26 152 56c0 22-16 32-35 37-10 3-14 8-14 14 0 6-7 11-18 11C45 118 8 94 8 58 8 27 40 8 74 8Z
             M130 60a10 10 0 1 1-20 0 10 10 0 1 1 20 0Z"
        />
      </svg>

      {WELLS.map((well) => {
        const Icon = well.icon;
        const active = tool === well.value;
        return (
          <button
            key={well.value}
            type="button"
            onClick={() => onSelect(well.value)}
            aria-pressed={active}
            aria-label={well.label}
            title={well.label}
            style={{ left: well.left, top: well.top }}
            className={`${WELL_BASE} ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-rule bg-paper text-ink-muted hover:border-ink hover:text-ink"
            }`}
          >
            <Icon />
          </button>
        );
      })}

      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        aria-label="Erase all"
        title="Erase all"
        style={{ left: "50%", top: "62%" }}
        className={`${WELL_BASE} border-rule bg-paper text-ink-muted hover:border-mark hover:text-mark disabled:opacity-30 disabled:hover:border-rule disabled:hover:text-ink-muted`}
      >
        <ClearIcon />
      </button>
    </div>
  );
}

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
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function CursorIcon() {
  return (
    <svg {...ICON} strokeWidth={1.2}>
      <path fill="currentColor" d="M4 2.2l7.6 5.9-3.5.5 1.9 4.1-1.8.8-1.9-4.1L4 11.9z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg {...ICON}>
      <path d="M11.1 2.7l2.2 2.2-7.5 7.5-3 .8.8-3z" />
      <path d="M9.9 3.9l2.2 2.2" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg {...ICON}>
      <path d="M13.3 2.7l-8 8L3.6 14l3.3-1.7 8-8z" />
      <path d="M5.3 10.7l1.6 1.6" />
      <path d="M10.7 5.3l1.6 1.6" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg {...ICON}>
      <path d="M4.6 4.6l6.8 6.8" />
      <path d="M11.4 4.6l-6.8 6.8" />
    </svg>
  );
}

/** Paint-well positions, as percentages of the palette's viewBox. */
const WELLS: { value: Tool; label: string; icon: () => React.ReactElement; left: string; top: string }[] = [
  { value: "cursor", label: "Cursor", icon: CursorIcon, left: "22%", top: "62%" },
  { value: "pencil", label: "Pencil", icon: PencilIcon, left: "26%", top: "31%" },
  { value: "pen", label: "Pen", icon: PenIcon, left: "51%", top: "22%" },
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
    <div className="fixed right-6 bottom-6 z-50 h-32 w-44">
      {/* The palette itself: outline only, so it reads as drawn rather than
          rendered. evenodd punches a real thumb hole. */}
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
        style={{ left: "54%", top: "66%" }}
        className={`${WELL_BASE} border-rule bg-paper text-ink-muted hover:border-mark hover:text-mark disabled:opacity-30 disabled:hover:border-rule disabled:hover:text-ink-muted`}
      >
        <ClearIcon />
      </button>
    </div>
  );
}

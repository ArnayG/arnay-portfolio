import type { Tool } from "@/components/DrawingLayer";

type ToolPaletteListProps = {
  tool: Tool;
  onSelect: (tool: Tool) => void;
  onClear: () => void;
  canClear: boolean;
};

/**
 * Touch labels the modes by what your finger does, not by an implement:
 * "Touch" scrolls and taps as normal, the two draw modes take the gesture.
 */
const ITEMS: { value: Tool; label: string }[] = [
  { value: "cursor", label: "Touch" },
  { value: "pencil", label: "Draw" },
  { value: "pen", label: "Draw bold" },
];

/**
 * The touch counterpart to the painter's palette: a plain list, because paint
 * wells are a mouse-sized target and a thumb needs a full row to hit.
 */
export default function ToolPaletteList({
  tool,
  onSelect,
  onClear,
  canClear,
}: ToolPaletteListProps) {
  return (
    <div className="shadow-hard-sm fixed right-4 bottom-4 z-50 hidden flex-col overflow-hidden rounded-md border border-ink bg-paper pointer-coarse:flex">
      {ITEMS.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onSelect(item.value)}
          aria-pressed={tool === item.value}
          className={`px-4 py-2.5 text-left font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
            tool === item.value
              ? "bg-ink text-paper"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          {item.label}
        </button>
      ))}

      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className="border-t border-rule px-4 py-2.5 text-left font-mono text-[10px] tracking-[0.18em] text-ink-muted uppercase transition-colors hover:text-ink disabled:opacity-35 disabled:hover:text-ink-muted"
      >
        Erase all
      </button>
    </div>
  );
}

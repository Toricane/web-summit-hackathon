import { X } from "lucide-react";
import { useEffect } from "react";

export function FilterSheet({
  open,
  onClose,
  formats,
  selected,
  onToggle,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  formats: string[];
  selected: Set<string>;
  onToggle: (f: string) => void;
  onClear: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-end" role="dialog">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full bg-card border-t border-line rounded-t-3xl p-4 pb-6 max-h-[70%] overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Filter by format</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-ink-muted tap"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[11px] text-ink-muted mt-1">
          Select one or more summit formats to narrow the list.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {formats.map((f) => {
            const on = selected.has(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => onToggle(f)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs border tap",
                  on
                    ? "bg-brand/20 border-brand text-brand-light"
                    : "border-line text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-ink-muted tap"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand text-white px-5 py-2 text-sm font-semibold tap"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useMemo, useRef } from "react";
import { GripHorizontal } from "lucide-react";
import {
  formatPillClasses,
  getEvent,
  type WebSummitEvent,
} from "../../utils/events";
import {
  isoToMinutes,
  minutesToShortClock,
  snapTo10,
} from "../../utils/calendar";
import { usePackState } from "../../hooks/usePackState";

export const DAY_START_MIN = 8 * 60; // 8:00 AM
export const DAY_END_MIN = 22 * 60; // 10:00 PM
export const PX_PER_MIN = 1;
const TOTAL_HEIGHT = (DAY_END_MIN - DAY_START_MIN) * PX_PER_MIN;
const MIN_SELECTION_MIN = 10;
const DEFAULT_SELECTION_MIN = 30;

export type Selection = { startMin: number; endMin: number };

export type TimelineBlock = {
  event: WebSummitEvent;
  startMin: number;
  endMin: number;
  goingCount: number; // other members going (0..4)
  totalOthers: number;
};

type TimelineCanvasProps = {
  selectedDate: string;
  selection: Selection | null;
  onSelectionChange: (sel: Selection | null) => void;
  lateNightCount: number;
};

export function TimelineCanvas({
  selectedDate,
  selection,
  onSelectionChange,
  lateNightCount,
}: TimelineCanvasProps) {
  const { state, otherMemberIds } = usePackState();
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const blocks = useMemo<TimelineBlock[]>(() => {
    const rows: TimelineBlock[] = [];
    for (const [eventId, goers] of Object.entries(state.wishlist)) {
      const event = getEvent(eventId);
      if (!event || event.date !== selectedDate) continue;
      const startMin = isoToMinutes(event.start);
      const endMin = isoToMinutes(event.end);
      if (endMin <= DAY_START_MIN || startMin >= DAY_END_MIN) continue;
      const goingCount = goers.filter((id) => id !== "you").length;
      rows.push({
        event,
        startMin,
        endMin,
        goingCount,
        totalOthers: otherMemberIds.length,
      });
    }
    return rows.sort((a, b) => a.startMin - b.startMin);
  }, [state.wishlist, selectedDate, otherMemberIds.length]);

  const yToMinutes = useCallback((yPx: number): number => {
    const raw = DAY_START_MIN + yPx / PX_PER_MIN;
    return clamp(snapTo10(raw), DAY_START_MIN, DAY_END_MIN);
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Ignore taps that bubbled up from a block or from the selection handle.
      const target = event.target as HTMLElement;
      if (target.closest("[data-block]") || target.closest("[data-handle]")) {
        return;
      }
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const y = event.clientY - rect.top;
      const startMin = yToMinutes(y);
      const endMin = clamp(
        startMin + DEFAULT_SELECTION_MIN,
        startMin + MIN_SELECTION_MIN,
        DAY_END_MIN,
      );
      onSelectionChange({ startMin, endMin });
    },
    [onSelectionChange, yToMinutes],
  );

  return (
    <div
      ref={canvasRef}
      className="relative bg-card-muted select-none"
      style={{ height: TOTAL_HEIGHT, touchAction: "pan-y" }}
      onPointerDown={handleCanvasPointerDown}
    >
      <HourGrid />

      {blocks.map((b) => (
        <Block key={b.event.id} block={b} />
      ))}

      {selection && (
        <SelectionOverlay
          selection={selection}
          onChange={onSelectionChange}
          yToMinutes={yToMinutes}
          canvasRef={canvasRef}
        />
      )}

      {lateNightCount > 0 && (
        <div className="absolute left-12 right-2 bottom-1 text-[10px] text-ink-subtle text-center pointer-events-none">
          + {lateNightCount} late-night session
          {lateNightCount === 1 ? "" : "s"} after 10 PM
        </div>
      )}
    </div>
  );
}

function HourGrid() {
  const hours: number[] = [];
  for (let m = DAY_START_MIN; m <= DAY_END_MIN; m += 60) hours.push(m);
  return (
    <>
      {hours.map((m, idx) => {
        const top = (m - DAY_START_MIN) * PX_PER_MIN;
        return (
          <div
            key={m}
            className="absolute left-0 right-0 flex items-start"
            style={{ top }}
          >
            <div className="w-10 pr-1 text-right text-[10px] text-ink-subtle leading-none -translate-y-1.5">
              {idx === 0 ? "" : minutesToShortClock(m)}
            </div>
            <div className="flex-1 border-t border-line/70" />
          </div>
        );
      })}
      {hours.slice(0, -1).map((m) => {
        const top = (m + 30 - DAY_START_MIN) * PX_PER_MIN;
        return (
          <div
            key={`half-${m}`}
            className="absolute left-10 right-0 border-t border-line/30 pointer-events-none"
            style={{ top }}
          />
        );
      })}
    </>
  );
}

function Block({ block }: { block: TimelineBlock }) {
  const { event, startMin, endMin, goingCount, totalOthers } = block;
  const top = (Math.max(startMin, DAY_START_MIN) - DAY_START_MIN) * PX_PER_MIN;
  const visibleEnd = Math.min(endMin, DAY_END_MIN);
  const height = Math.max(22, (visibleEnd - startMin) * PX_PER_MIN);
  const pill = formatPillClasses(event.format);

  const blockClass = (() => {
    if (goingCount >= totalOthers) {
      return "bg-brand text-white border-brand-light";
    }
    if (goingCount >= 3) {
      return "bg-brand/60 text-white border-brand-light/60";
    }
    if (goingCount >= 2) {
      return "bg-brand/30 text-ink border-brand/50";
    }
    return "bg-card-elevated text-ink border-brand/40";
  })();

  const isTiny = height < 36;
  const isShort = height < 56;

  return (
    <div
      data-block="1"
      className={[
        "absolute left-12 right-2 rounded-lg border overflow-hidden px-2 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
        blockClass,
      ].join(" ")}
      style={{ top, height }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-1 text-[10px] leading-tight">
        <span className="font-semibold whitespace-nowrap">
          {goingCount}/{totalOthers}
        </span>
        {!isTiny && (
          <span
            className={[
              "px-1.5 py-[1px] rounded-full text-[9px] font-medium uppercase tracking-wide truncate max-w-[60%]",
              pill.bg,
              pill.text,
            ].join(" ")}
          >
            {event.format}
          </span>
        )}
      </div>
      {!isShort && (
        <div className="mt-0.5 text-[11px] font-semibold leading-tight line-clamp-2">
          {event.title}
        </div>
      )}
      {isShort && !isTiny && (
        <div className="text-[10px] font-semibold leading-tight line-clamp-1">
          {event.title}
        </div>
      )}
    </div>
  );
}

function SelectionOverlay({
  selection,
  onChange,
  yToMinutes,
  canvasRef,
}: {
  selection: Selection;
  onChange: (sel: Selection) => void;
  yToMinutes: (y: number) => number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const top = (selection.startMin - DAY_START_MIN) * PX_PER_MIN;
  const height = (selection.endMin - selection.startMin) * PX_PER_MIN;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.clientY - rect.top;
    const endMin = yToMinutes(y);
    const clampedEnd = Math.max(
      selection.startMin + MIN_SELECTION_MIN,
      Math.min(DAY_END_MIN, endMin),
    );
    if (clampedEnd !== selection.endMin) {
      onChange({ startMin: selection.startMin, endMin: clampedEnd });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="absolute left-12 right-2 rounded-lg border-2 border-dashed border-brand-light bg-brand/15 pointer-events-none"
      style={{ top, height }}
    >
      <div className="absolute top-1 left-2 text-[10px] font-semibold uppercase tracking-wider text-brand-light">
        {minutesToShortClock(selection.startMin)} –{" "}
        {minutesToShortClock(selection.endMin)}
      </div>
      <div
        data-handle="1"
        role="slider"
        aria-label="Extend slot end time"
        aria-valuemin={selection.startMin + MIN_SELECTION_MIN}
        aria-valuemax={DAY_END_MIN}
        aria-valuenow={selection.endMin}
        className="pointer-events-auto absolute left-1/2 -bottom-2 -translate-x-1/2 w-10 h-5 rounded-full bg-brand-light text-brand-dark grid place-items-center cursor-ns-resize shadow-md"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <GripHorizontal className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

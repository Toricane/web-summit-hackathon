import { useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { EventCard } from "./EventCard";
import {
  ALL_EVENTS,
  getEvent,
  type WebSummitEvent,
} from "../../utils/events";
import {
  isoToMinutes,
  keywordScore,
  minuteOverlap,
  minutesToShortClock,
} from "../../utils/calendar";
import { usePackState } from "../../hooks/usePackState";
import type { Selection } from "./TimelineCanvas";

type CandidateSheetProps = {
  selectedDate: string;
  selection: Selection;
  onClear: () => void;
};

type Candidate = {
  event: WebSummitEvent;
  startMin: number;
  endMin: number;
  score: number;
};

const TOP_N = 3;

export function CandidateSheet({
  selectedDate,
  selection,
  onClear,
}: CandidateSheetProps) {
  const { state } = usePackState();
  const [expanded, setExpanded] = useState(false);

  const candidates = useMemo<Candidate[]>(() => {
    const wishlistEventsToday = Object.keys(state.wishlist)
      .map((id) => getEvent(id))
      .filter((e): e is WebSummitEvent => !!e && e.date === selectedDate);
    const wishlistIds = new Set(Object.keys(state.wishlist));

    const rows: Candidate[] = [];
    for (const event of ALL_EVENTS) {
      if (event.date !== selectedDate) continue;
      if (wishlistIds.has(event.id)) continue;
      const startMin = isoToMinutes(event.start);
      const endMin = isoToMinutes(event.end);
      if (
        !minuteOverlap(
          startMin,
          endMin,
          selection.startMin,
          selection.endMin,
        )
      ) {
        continue;
      }
      const startsInside =
        startMin >= selection.startMin && startMin < selection.endMin;
      const fitsFully =
        startMin >= selection.startMin && endMin <= selection.endMin;
      let score = startsInside ? 3 : 1;
      if (fitsFully) score += 1;
      score += keywordScore(event, wishlistEventsToday);
      rows.push({ event, startMin, endMin, score });
    }
    return rows.sort(
      (a, b) => b.score - a.score || a.startMin - b.startMin,
    );
  }, [state.wishlist, selectedDate, selection]);

  const shown = expanded ? candidates : candidates.slice(0, TOP_N);
  const remaining = Math.max(0, candidates.length - shown.length);

  return (
    <div className="card mt-3 overflow-hidden">
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-line">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-brand-light font-semibold">
            Slot picker
          </div>
          <div className="text-[13px] font-semibold mt-0.5">
            {minutesToShortClock(selection.startMin)} –{" "}
            {minutesToShortClock(selection.endMin)}
            <span className="text-ink-muted font-normal">
              {" "}
              · {candidates.length} fit{candidates.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full bg-card-elevated border border-line px-2.5 py-1 text-[11px] flex items-center gap-1 tap text-ink-muted"
          aria-label="Clear selection"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>

      {candidates.length === 0 ? (
        <div className="p-4 text-center text-[12px] text-ink-muted">
          No events fit this window. Try extending the slot.
        </div>
      ) : (
        <div className="p-3 space-y-2.5">
          {shown.map((c) => (
            <EventCard
              key={c.event.id}
              eventId={c.event.id}
              totalOthers={4}
              matchLabel="Going"
            />
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="w-full text-[12px] text-ink-muted flex items-center justify-center gap-1 py-1 tap"
            >
              Show {remaining} more
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

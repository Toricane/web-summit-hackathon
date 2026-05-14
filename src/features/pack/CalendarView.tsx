import { useMemo, useState } from "react";
import {
  ALL_EVENTS,
  CONFERENCE_DATES,
  getEvent,
} from "../../utils/events";
import { dayLabel, formatDateLong } from "../../utils/time";
import { isoToMinutes } from "../../utils/calendar";
import { usePackState } from "../../hooks/usePackState";
import {
  DAY_END_MIN,
  TimelineCanvas,
  type Selection,
} from "./TimelineCanvas";
import { CandidateSheet } from "./CandidateSheet";

function pickDefaultDate(): string {
  const today = new Date().toISOString().slice(0, 10);
  if (CONFERENCE_DATES.includes(today)) return today;
  return CONFERENCE_DATES[CONFERENCE_DATES.length - 1];
}

export function CalendarView() {
  const { state } = usePackState();
  const [selectedDate, setSelectedDate] = useState<string>(pickDefaultDate);
  const [selection, setSelection] = useState<Selection | null>(null);

  const lateNightCount = useMemo(() => {
    let count = 0;
    for (const eventId of Object.keys(state.wishlist)) {
      const event = getEvent(eventId);
      if (!event || event.date !== selectedDate) continue;
      const startMin = isoToMinutes(event.start);
      if (startMin >= DAY_END_MIN) count++;
    }
    return count;
  }, [state.wishlist, selectedDate]);

  const eventsTodayCount = useMemo(
    () => ALL_EVENTS.filter((e) => e.date === selectedDate).length,
    [selectedDate],
  );

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelection(null);
  };

  return (
    <div className="mt-1">
      <h2 className="text-lg font-semibold">Day Timeline</h2>
      <p className="text-[12px] text-ink-muted">
        {selection
          ? "Drag the handle to extend the slot. Pick from the list below."
          : "Tap any time to find events you can fit in. Drag the handle to extend."}
      </p>

      <div className="mt-3 -mx-4 px-4 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {CONFERENCE_DATES.map((d) => {
          const isActive = d === selectedDate;
          return (
            <button
              key={d}
              type="button"
              onClick={() => handleDateChange(d)}
              className={[
                "shrink-0 rounded-full px-3 py-1.5 text-xs border tap flex flex-col items-center leading-tight",
                isActive
                  ? "bg-brand/20 border-brand text-brand-light"
                  : "border-line text-ink-muted",
              ].join(" ")}
            >
              <span className="font-semibold">{dayLabel(d)}</span>
              <span className="text-[9px] opacity-80">
                {formatDateLong(d).replace(/^[A-Za-z]+,\s*/, "")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 card overflow-hidden">
        <div className="px-3 py-2 border-b border-line flex items-center justify-between text-[11px] text-ink-muted">
          <span>{formatDateLong(selectedDate)}</span>
          <span>{eventsTodayCount} sessions today</span>
        </div>
        <TimelineCanvas
          selectedDate={selectedDate}
          selection={selection}
          onSelectionChange={setSelection}
          lateNightCount={lateNightCount}
        />
      </div>

      {selection && (
        <CandidateSheet
          selectedDate={selectedDate}
          selection={selection}
          onClear={() => setSelection(null)}
        />
      )}

      {!selection && (
        <div className="mt-3 card p-3 text-[11px] text-ink-muted flex items-start gap-2">
          <span className="mt-0.5 w-2 h-2 rounded-full bg-brand shrink-0" />
          <span>
            Pack picks for{" "}
            <span className="text-ink font-medium">{dayLabel(selectedDate)}</span>{" "}
            are filled in purple — solid for unanimous, lighter for partial
            overlap. Tap an empty slot to slot in something new.
          </span>
        </div>
      )}
    </div>
  );
}

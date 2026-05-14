import { useMemo, useRef, useState } from "react";
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
  TIMELINE_MIN_ATTENDANCE,
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
  const candidateSheetRef = useRef<HTMLDivElement | null>(null);

  const jumpToResults = () => {
    candidateSheetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const { lateNightCount, lowAttendanceCount } = useMemo(() => {
    let late = 0;
    let low = 0;
    for (const [eventId, goers] of Object.entries(state.wishlist)) {
      const event = getEvent(eventId);
      if (!event || event.date !== selectedDate) continue;
      const startMin = isoToMinutes(event.start);
      if (startMin >= DAY_END_MIN) {
        late++;
        continue;
      }
      const goingCount = goers.filter((id) => id !== "you").length;
      if (goingCount < TIMELINE_MIN_ATTENDANCE) low++;
    }
    return { lateNightCount: late, lowAttendanceCount: low };
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
          onJumpToResults={jumpToResults}
          lateNightCount={lateNightCount}
        />
      </div>

      {selection && (
        <div ref={candidateSheetRef} className="scroll-mt-3">
          <CandidateSheet
            selectedDate={selectedDate}
            selection={selection}
            onClear={() => setSelection(null)}
          />
        </div>
      )}

      {!selection && (
        <div className="mt-3 card p-3 text-[11px] text-ink-muted flex items-start gap-2">
          <span className="mt-0.5 w-2 h-2 rounded-full bg-brand shrink-0" />
          <span>
            Only events with{" "}
            <span className="text-ink font-medium">
              {TIMELINE_MIN_ATTENDANCE}/4
            </span>{" "}
            or more pack overlap are pre-slotted (solid = unanimous, lighter =
            majority). Tap an empty slot to fit something new in.
            {lowAttendanceCount > 0 && (
              <>
                {" "}
                <span className="text-ink-subtle">
                  {lowAttendanceCount} lower-attendance{" "}
                  {lowAttendanceCount === 1 ? "pick is" : "picks are"} hidden —
                  see them under Event Overlap.
                </span>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

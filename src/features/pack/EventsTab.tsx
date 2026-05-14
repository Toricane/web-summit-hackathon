import { useMemo, useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  ArrowLeft,
  Search,
  CalendarRange,
} from "lucide-react";
import { EventCard } from "./EventCard";
import { FilterSheet } from "./FilterSheet";
import { CalendarView } from "./CalendarView";
import { usePackState } from "../../hooks/usePackState";
import {
  ALL_EVENTS,
  CONFERENCE_DATES,
  getEvent,
} from "../../utils/events";
import { dayLabel, formatDateLong } from "../../utils/time";
import type { TabId } from "./TabBar";

type EventsTabProps = {
  onSwitchTab?: (id: TabId) => void;
};

export function EventsTab({ onSwitchTab: _onSwitchTab }: EventsTabProps) {
  void _onSwitchTab;
  const { state } = usePackState();
  const [activeDate, setActiveDate] = useState<string | "all">("all");
  const [dayMenuOpen, setDayMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(
    new Set(),
  );
  const [view, setView] = useState<"overlap" | "calendar" | "all">("overlap");
  const [search, setSearch] = useState("");

  const allFormats = useMemo(
    () => Array.from(new Set(ALL_EVENTS.map((e) => e.format))).sort(),
    [],
  );

  const overlapEvents = useMemo(() => {
    const ids = Object.keys(state.wishlist);
    const rows = ids
      .map((id) => ({
        event: getEvent(id)!,
        going: state.wishlist[id].filter((m) => m !== "you").length,
      }))
      .filter((r) => r.event);
    return rows
      .filter((r) => activeDate === "all" || r.event.date === activeDate)
      .filter(
        (r) => selectedFormats.size === 0 || selectedFormats.has(r.event.format),
      )
      .sort(
        (a, b) =>
          b.going - a.going ||
          a.event.start.localeCompare(b.event.start) ||
          a.event.title.localeCompare(b.event.title),
      );
  }, [state.wishlist, activeDate, selectedFormats]);

  const allFiltered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ALL_EVENTS.filter((e) => activeDate === "all" || e.date === activeDate)
      .filter(
        (e) => selectedFormats.size === 0 || selectedFormats.has(e.format),
      )
      .filter((e) => {
        if (!term) return true;
        return (
          e.title.toLowerCase().includes(term) ||
          e.where.toLowerCase().includes(term) ||
          e.format.toLowerCase().includes(term) ||
          e.speakers.some((s) => s.name.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 80);
  }, [activeDate, selectedFormats, search]);

  const dayOptions: { label: string; value: string | "all" }[] = useMemo(
    () => [
      { label: "All Days", value: "all" as const },
      ...CONFERENCE_DATES.map((d) => ({
        label: `${dayLabel(d)} · ${formatDateLong(d)}`,
        value: d,
      })),
    ],
    [],
  );

  return (
    <div className="relative flex flex-col min-h-full">
      <div className="px-4 pt-3 pb-2">
        {view === "overlap" ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Event Overlap</h2>
                <p className="text-[12px] text-ink-muted">
                  Events your pack wants to attend
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDayMenuOpen((v) => !v)}
                    className="rounded-full bg-card border border-line px-3 py-1.5 text-xs flex items-center gap-1 tap"
                  >
                    {activeDate === "all" ? "All Days" : dayLabel(activeDate)}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {dayMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 z-10 w-56 card p-1 shadow-lg">
                      {dayOptions.map((o) => (
                        <button
                          key={String(o.value)}
                          onClick={() => {
                            setActiveDate(o.value);
                            setDayMenuOpen(false);
                          }}
                          className={[
                            "w-full text-left px-3 py-2 rounded-lg text-xs tap",
                            o.value === activeDate
                              ? "bg-brand/20 text-brand-light"
                              : "hover:bg-card-elevated text-ink",
                          ].join(" ")}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setFilterOpen(true)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs flex items-center gap-1 tap",
                    selectedFormats.size > 0
                      ? "border-brand bg-brand/20 text-brand-light"
                      : "border-line bg-card text-ink",
                  ].join(" ")}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  Filters
                  {selectedFormats.size > 0 && (
                    <span>· {selectedFormats.size}</span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {overlapEvents.map(({ event }) => (
                <EventCard key={event.id} eventId={event.id} />
              ))}
              {overlapEvents.length === 0 && (
                <div className="card p-6 text-center text-sm text-ink-muted">
                  No overlap found for these filters yet.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setView("calendar")}
              className="mt-4 w-full card p-4 flex items-center justify-between text-sm font-medium tap"
            >
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand/20 grid place-items-center">
                  <CalendarRange className="w-4 h-4 text-brand-light" />
                </span>
                Open day timeline
              </span>
              <span className="text-ink-muted">→</span>
            </button>

            <button
              type="button"
              onClick={() => setView("all")}
              className="mt-3 w-full card p-4 flex items-center justify-between text-sm font-medium tap"
            >
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-card-elevated grid place-items-center">
                  <Search className="w-4 h-4 text-ink-muted" />
                </span>
                Browse all events
              </span>
              <span className="text-ink-muted">{ALL_EVENTS.length} →</span>
            </button>
          </>
        ) : view === "calendar" ? (
          <>
            <button
              type="button"
              onClick={() => setView("overlap")}
              className="flex items-center gap-1 text-xs text-ink-muted tap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to overlap
            </button>
            <CalendarView />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setView("overlap")}
              className="flex items-center gap-1 text-xs text-ink-muted tap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to overlap
            </button>
            <h2 className="mt-2 text-lg font-semibold">All events</h2>
            <p className="text-[12px] text-ink-muted">
              {ALL_EVENTS.length} sessions · tap the bookmark to add to your
              list.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-full bg-card border border-line px-3 py-2">
                <Search className="w-4 h-4 text-ink-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, speaker, location"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-subtle"
                />
              </div>
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className={[
                  "rounded-full border px-3 py-2 text-xs flex items-center gap-1 tap",
                  selectedFormats.size > 0
                    ? "border-brand bg-brand/20 text-brand-light"
                    : "border-line bg-card text-ink",
                ].join(" ")}
              >
                <SlidersHorizontal className="w-3 h-3" />
                Filters
              </button>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
              {dayOptions.map((o) => (
                <button
                  key={String(o.value)}
                  onClick={() => setActiveDate(o.value)}
                  className={[
                    "shrink-0 rounded-full px-3 py-1.5 text-xs border tap",
                    o.value === activeDate
                      ? "bg-brand/20 border-brand text-brand-light"
                      : "border-line text-ink-muted",
                  ].join(" ")}
                >
                  {o.value === "all" ? "All Days" : dayLabel(o.value)}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-3 pb-2">
              {allFiltered.map((e) => (
                <EventCard
                  key={e.id}
                  eventId={e.id}
                  totalOthers={4}
                  matchLabel="Going"
                />
              ))}
              {allFiltered.length === 0 && (
                <div className="card p-6 text-center text-sm text-ink-muted">
                  No events match those filters.
                </div>
              )}
              {ALL_EVENTS.length > allFiltered.length && search === "" && (
                <p className="text-center text-[11px] text-ink-subtle py-2">
                  Showing first {allFiltered.length} of {ALL_EVENTS.length}.
                  Try a search or pick a day.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        formats={allFormats}
        selected={selectedFormats}
        onToggle={(f) => {
          setSelectedFormats((prev) => {
            const next = new Set(prev);
            if (next.has(f)) next.delete(f);
            else next.add(f);
            return next;
          });
        }}
        onClear={() => setSelectedFormats(new Set())}
      />
    </div>
  );
}

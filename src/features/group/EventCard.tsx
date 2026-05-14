import { Bookmark, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  describeLocation,
  formatPillClasses,
  getEvent,
  type WebSummitEvent,
} from "../../utils/events";
import { dayLabel, formatClock } from "../../utils/time";
import { useGroupState, memberById } from "../../hooks/useGroupState";
import type { MemberId } from "../../data/mockGroup";

type EventCardProps = {
  eventId: string;
  goers?: MemberId[];
  totalOthers?: number;
  rankBadge?: number;
  reason?: string;
  reasonLabel?: string;
  matchLabel?: string;
};

export function EventCard({
  eventId,
  goers,
  totalOthers = 4,
  rankBadge,
  reason,
  reasonLabel = "Why this match?",
  matchLabel = "Going",
}: EventCardProps) {
  const event = getEvent(eventId);
  const { toggleWishlist, isUserGoing, goersFor } = useGroupState();
  const [expanded, setExpanded] = useState(false);

  if (!event) return null;

  const allGoers = goers ?? goersFor(eventId);
  const otherGoers = allGoers.filter((id) => id !== "you");
  const goingCount = otherGoers.length;
  const userGoing = isUserGoing(eventId);
  const loc = describeLocation(event.where);
  const pill = formatPillClasses(event.format);

  return (
    <article
      className="card overflow-hidden tap"
      aria-expanded={expanded}
    >
      <div className="w-full text-left p-3 flex items-stretch gap-3">
        {rankBadge !== undefined && (
          <div className="shrink-0 w-7 h-7 rounded-md bg-brand/25 text-brand-light grid place-items-center font-bold text-sm">
            {rankBadge}
          </div>
        )}
        <TimeColumn event={event} />
        <div className="flex-1 min-w-0">
          <span className={["pill", pill.bg, pill.text].join(" ")}>
            {event.format}
          </span>
          <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-ink">
            {event.title}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-ink-muted">
            <MapPin className="w-3 h-3" />
            <span className="truncate">
              {loc.primary}
              {loc.secondary && <span> · {loc.secondary}</span>}
            </span>
          </div>
          {otherGoers.length > 0 && (
            <div className="mt-2 flex -space-x-1.5">
              {otherGoers.map((id) => {
                const m = memberById(id);
                return (
                  <img
                    key={id}
                    src={m.avatar}
                    alt={m.shortName}
                    className="w-5 h-5 rounded-full border-2 border-card object-cover"
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end justify-between min-w-[64px]">
          <div className="text-right">
            <div
              className={[
                "text-sm font-bold",
                goingCount === totalOthers
                  ? "text-emerald-400"
                  : goingCount >= Math.ceil(totalOthers / 2)
                    ? "text-amber-300"
                    : "text-ink-muted",
              ].join(" ")}
            >
              {goingCount} / {totalOthers}
            </div>
            <div className="text-[10px] text-ink-subtle leading-tight">
              {matchLabel}
            </div>
            <div className="mt-1 flex justify-end gap-1">
              {Array.from({ length: totalOthers }).map((_, i) => (
                <span
                  key={i}
                  className={[
                    "w-1.5 h-1.5 rounded-full",
                    i < goingCount ? "bg-emerald-400" : "bg-line",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(eventId)}
            aria-pressed={userGoing}
            aria-label={userGoing ? "Remove from your list" : "Add to your list"}
            className="mt-2 p-1 tap"
          >
            <Bookmark
              className={[
                "w-5 h-5",
                userGoing
                  ? "text-brand-light fill-brand-light"
                  : "text-ink-muted",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      {reason && (
        <div className="px-3 pb-3 -mt-1">
          <div className="rounded-xl bg-brand-tint/60 border border-brand/30 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-brand-light font-semibold">
              {reasonLabel}
            </div>
            <p className="mt-1 text-[12px] leading-snug text-ink/90">{reason}</p>
          </div>
        </div>
      )}

      {expanded && <ExpandedDetail event={event} />}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-[11px] text-ink-subtle py-1 flex items-center justify-center gap-1 border-t border-line tap"
        aria-label="Toggle details"
      >
        <ChevronDown
          className={[
            "w-3 h-3 transition-transform",
            expanded ? "rotate-180" : "",
          ].join(" ")}
        />
        {expanded ? "Hide details" : "Show details"}
      </button>
    </article>
  );
}

function TimeColumn({ event }: { event: WebSummitEvent }) {
  return (
    <div className="shrink-0 w-14 text-center">
      <div className="text-[10px] font-bold tracking-widest text-ink-muted">
        {dayLabel(event.date)}
      </div>
      <div className="mt-1 text-[12px] font-semibold text-ink leading-tight">
        {formatClock(event.start)}
      </div>
      <div className="mx-auto my-1 w-px h-2 bg-line" />
      <div className="text-[11px] text-ink-muted leading-tight">
        {formatClock(event.end)}
      </div>
    </div>
  );
}

function ExpandedDetail({ event }: { event: WebSummitEvent }) {
  return (
    <div className="px-3 pb-3 pt-1 space-y-3 border-t border-line/60">
      {event.description && (
        <p className="text-[12px] leading-relaxed text-ink-muted whitespace-pre-line line-clamp-6">
          {event.description}
        </p>
      )}
      {event.speakers.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ink-subtle font-semibold mb-1.5">
            Speakers
          </div>
          <ul className="space-y-2">
            {event.speakers.slice(0, 4).map((s) => (
              <li key={s.name + s.company} className="flex items-center gap-2">
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  loading="lazy"
                  className="w-8 h-8 rounded-full object-cover border border-line"
                />
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-ink truncate">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-ink-muted truncate">
                    {s.position} · {s.company}
                  </div>
                </div>
              </li>
            ))}
            {event.speakers.length > 4 && (
              <li className="text-[10px] text-ink-subtle">
                +{event.speakers.length - 4} more speakers
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

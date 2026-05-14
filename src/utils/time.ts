const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function dayLabel(date: string): string {
  const d = new Date(date + "T12:00:00");
  return DAY_LABELS[d.getDay()];
}

/**
 * The event ISO strings encode local Vancouver time
 * (e.g. "2026-05-14T10:45:00.000-07:00") so we read HH:MM directly
 * from the string instead of going through Date and risking UTC drift.
 */
export function formatClock(iso: string): string {
  const match = iso.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDateLong(date: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function relativeTime(minutesAgo: number): string {
  if (minutesAgo < 1) return "Just now";
  if (minutesAgo === 1) return "1 min ago";
  if (minutesAgo < 60) return `${minutesAgo} min ago`;
  const h = Math.floor(minutesAgo / 60);
  if (h === 1) return "1 hr ago";
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

import type { WebSummitEvent } from "./events";

/**
 * Convert an event ISO string (e.g. "2026-05-14T10:45:00.000-07:00")
 * into minutes-from-midnight local Vancouver time.
 *
 * We read HH:MM directly from the string rather than going through Date —
 * same pattern as formatClock() in time.ts, for the same reason
 * (avoid UTC drift on the user's local machine).
 */
export function isoToMinutes(iso: string): number {
  const match = iso.match(/T(\d{2}):(\d{2})/);
  if (!match) return 0;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

/**
 * Snap a minute value to the nearest 10-minute increment.
 */
export function snapTo10(minutes: number): number {
  return Math.round(minutes / 10) * 10;
}

/**
 * Format a minutes-from-midnight value as "10:30 AM" / "1:05 PM".
 */
export function minutesToShortClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Returns true if [aStart, aEnd) overlaps with [bStart, bEnd).
 * Touching intervals (a.end === b.start) do NOT count as overlap.
 */
export function minuteOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "of",
  "and",
  "or",
  "but",
  "to",
  "in",
  "on",
  "at",
  "for",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "as",
  "it",
  "this",
  "that",
  "these",
  "those",
  "your",
  "you",
  "we",
  "our",
  "their",
  "they",
  "how",
  "what",
  "when",
  "where",
  "why",
  "who",
  "vs",
  "via",
  "into",
  "out",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 3 && !STOPWORDS.has(t)),
  );
}

/**
 * Light-weight keyword similarity score between a candidate event and the
 * pack's existing wishlist. Returns a number in [0, 2] — capped so it doesn't
 * dominate the time-fit signal.
 *
 * This is a deliberate stand-in for the side-project's keyword similarity layer:
 * deterministic, offline, no LLM. Enough to surface "kind of like what the pack
 * already picked" candidates without spinning up an API.
 */
export function keywordScore(
  candidate: WebSummitEvent,
  wishlist: WebSummitEvent[],
): number {
  if (wishlist.length === 0) return 0;
  const candidateTokens = tokenize(
    `${candidate.title} ${candidate.format}`,
  );
  if (candidateTokens.size === 0) return 0;
  const wishlistTokens = new Set<string>();
  for (const e of wishlist) {
    for (const t of tokenize(`${e.title} ${e.format}`)) wishlistTokens.add(t);
  }
  let shared = 0;
  for (const t of candidateTokens) if (wishlistTokens.has(t)) shared++;
  if (shared === 0) return 0;
  const jaccard =
    shared / (candidateTokens.size + wishlistTokens.size - shared);
  return Math.min(2, jaccard * 6);
}

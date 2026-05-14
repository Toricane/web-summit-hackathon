import eventsJson from "../data/events.json";

export type Speaker = {
  name: string;
  position: string;
  company: string;
  imageUrl: string;
  profileUrl: string;
};

export type WebSummitEvent = {
  id: string;
  url: string;
  title: string;
  date: string;
  start: string;
  end: string;
  where: string;
  format: string;
  description: string;
  speakers: Speaker[];
  speakersMoreCount: number;
  timezone: string;
};

export const ALL_EVENTS = eventsJson as WebSummitEvent[];

const EVENT_BY_ID = new Map<string, WebSummitEvent>(
  ALL_EVENTS.map((e) => [e.id, e]),
);

export function getEvent(id: string): WebSummitEvent | undefined {
  return EVENT_BY_ID.get(id);
}

export function getEventOrThrow(id: string): WebSummitEvent {
  const e = EVENT_BY_ID.get(id);
  if (!e) throw new Error(`Unknown event id: ${id}`);
  return e;
}

export const CONFERENCE_DATES = Array.from(
  new Set(ALL_EVENTS.map((e) => e.date)),
).sort();

export function eventsForDate(date: string): WebSummitEvent[] {
  return ALL_EVENTS.filter((e) => e.date === date).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
}

const FORMAT_COLORS: Record<string, { bg: string; text: string }> = {
  "Government Summit": { bg: "bg-rose-500/15", text: "text-rose-300" },
  Meetup: { bg: "bg-brand/20", text: "text-brand-light" },
  "New Media Summit": { bg: "bg-orange-500/15", text: "text-orange-300" },
  "AI Summit": { bg: "bg-cyan-500/15", text: "text-cyan-300" },
  "Centre Stage": { bg: "bg-fuchsia-500/15", text: "text-fuchsia-300" },
  "Creative Summit": { bg: "bg-pink-500/15", text: "text-pink-300" },
  "Film Summit": { bg: "bg-amber-500/15", text: "text-amber-300" },
  "Fintech Summit": { bg: "bg-emerald-500/15", text: "text-emerald-300" },
  "Gaming Summit": { bg: "bg-violet-500/15", text: "text-violet-300" },
  "Growth Summit": { bg: "bg-lime-500/15", text: "text-lime-300" },
  "Marketing Summit": { bg: "bg-yellow-500/15", text: "text-yellow-300" },
  "New Energy Summit": { bg: "bg-teal-500/15", text: "text-teal-300" },
  "New Venture Summit": { bg: "bg-sky-500/15", text: "text-sky-300" },
  "Night Summit": { bg: "bg-indigo-500/15", text: "text-indigo-300" },
  "Startup Showcase": { bg: "bg-emerald-500/15", text: "text-emerald-300" },
  "Startup University": { bg: "bg-sky-500/15", text: "text-sky-300" },
  "Startup Masterclass": { bg: "bg-blue-500/15", text: "text-blue-300" },
  "Corporate Innovation Summit": {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
  },
  Masterclasses: { bg: "bg-slate-500/20", text: "text-slate-200" },
  "Planet Summit": { bg: "bg-green-500/15", text: "text-green-300" },
  "Investor Masterclass": { bg: "bg-blue-500/15", text: "text-blue-300" },
  "Podcast Booths": { bg: "bg-zinc-500/20", text: "text-zinc-200" },
  "Press Conference": { bg: "bg-neutral-500/20", text: "text-neutral-200" },
  PITCH: { bg: "bg-fuchsia-500/15", text: "text-fuchsia-300" },
  "Away from the stage": { bg: "bg-stone-500/20", text: "text-stone-200" },
};

export function formatPillClasses(format: string): { bg: string; text: string } {
  return FORMAT_COLORS[format] ?? { bg: "bg-zinc-500/20", text: "text-zinc-200" };
}

export function describeLocation(where: string): {
  primary: string;
  secondary: string;
} {
  if (/centre stage/i.test(where)) {
    return { primary: "Centre Stage", secondary: "Main Stage" };
  }
  if (/^stage \d/i.test(where)) {
    return { primary: where, secondary: "Main Stage" };
  }
  if (/meetup/i.test(where)) {
    return { primary: where, secondary: "Meetups Area" };
  }
  if (/masterclass/i.test(where)) {
    return { primary: where, secondary: "Masterclass Hall" };
  }
  if (/podcast/i.test(where)) {
    return { primary: where, secondary: "Podcast Area" };
  }
  if (/bentall/i.test(where)) {
    return { primary: "Bentall Centre", secondary: "Night Summit" };
  }
  if (/^E\d/i.test(where)) {
    return { primary: where, secondary: "Exhibition Floor" };
  }
  return { primary: where, secondary: "" };
}

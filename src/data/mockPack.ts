export const PACK_CODE = "WSV7XK";
export const PACK_NAME = "My Pack";
export const CONFERENCE_LABEL = "Web Summit Vancouver";
export const CONFERENCE_DATE_RANGE = "May 11–14";
export const MEMBER_LIMIT = 6;

export type MemberId = "you" | "daniel" | "jessica" | "ramesh" | "zohaib";

export type Member = {
  id: MemberId;
  name: string;
  shortName: string;
  avatar: string;
  ringColor: string;
  tags: string[];
};

export type StatusPresetId =
  | "food"
  | "mainstage"
  | "hallb"
  | "findme"
  | "coffee";

export type StatusEntry = {
  memberId: MemberId;
  preset: StatusPresetId;
  minutesAgo: number;
};

export type AIMatch = {
  eventId: string;
  going: number;
  total: number;
  reason: string;
};

export const MEMBERS: Member[] = [
  {
    id: "you",
    name: "You",
    shortName: "You",
    avatar: "https://i.pravatar.cc/150?img=68",
    ringColor: "ring-brand",
    tags: ["AI", "Developer Tools", "Startups"],
  },
  {
    id: "daniel",
    name: "Daniel Kim",
    shortName: "Daniel",
    avatar: "https://i.pravatar.cc/150?img=12",
    ringColor: "ring-cyan-400",
    tags: ["Investors", "Fintech", "Series A"],
  },
  {
    id: "jessica",
    name: "Jessica Park",
    shortName: "Jessica",
    avatar: "https://i.pravatar.cc/150?img=5",
    ringColor: "ring-pink-400",
    tags: ["New Media", "Creators", "AI"],
  },
  {
    id: "ramesh",
    name: "Ramesh Patel",
    shortName: "Ramesh",
    avatar: "https://i.pravatar.cc/150?img=15",
    ringColor: "ring-emerald-400",
    tags: ["Hardware", "Robotics", "AI Summit"],
  },
  {
    id: "zohaib",
    name: "Zohaib Khan",
    shortName: "Zohaib",
    avatar: "https://i.pravatar.cc/150?img=33",
    ringColor: "ring-amber-400",
    tags: ["Founders", "Growth", "Marketing"],
  },
];

export const OTHER_MEMBER_IDS: MemberId[] = MEMBERS.filter(
  (m) => m.id !== "you",
).map((m) => m.id);

/**
 * Pre-curated wishlist tuned so every conference day has at least two
 * majority-pack picks (≥ 3 other members going) — those slot onto the
 * Day Timeline. Lower-attendance picks still surface in the Event Overlap
 * list and as candidates inside the Slot Picker. Going-count notation
 * follows the rest of the app: N/4 = # of *other* members going (you excluded).
 *
 * Event IDs are real entries pulled from events.json.
 */
type WishlistRow = { eventId: string; goers: MemberId[] };

export const WISHLIST: WishlistRow[] = [
  // MON May 11 18:20 — 3/4: Centre Stage "Can copyright survive tokenmaxxing?" (Sigrid Jin)
  {
    eventId: "fc113bff-81e4-4b66-9e1a-96d4e8d74223",
    goers: ["you", "daniel", "jessica", "ramesh"],
  },
  // MON May 11 18:50 — 3/4: Sovereign AI blueprint
  {
    eventId: "4523eed7-1d00-4115-bfbb-c599a40eaa09",
    goers: ["daniel", "jessica", "ramesh"],
  },
  // TUE May 12 14:15 — 3/4: Centre Stage "Open source in the agentic era"
  {
    eventId: "1d7ff5db-cbb4-48bf-9352-23c2c010b3f2",
    goers: ["you", "daniel", "jessica", "ramesh"],
  },
  // TUE May 12 12:00 — 3/4: "Brand building in the age of AI"
  // (bumped from 2/4 to 3/4 so TUE has two timeline picks)
  {
    eventId: "65c84aef-01f7-4a46-8d1e-36ee40a096f3",
    goers: ["you", "jessica", "ramesh", "daniel"],
  },
  // TUE May 12 14:00 — 1/4: Seed-stage funding (Daniel's solo pick; stays off the timeline)
  {
    eventId: "9afdae16-ee1a-4c02-b1e9-f0480d6144f7",
    goers: ["daniel"],
  },
  // WED May 13 10:15 — 3/4: "Why open source will win the agent era"
  // (bumped from 2/4 to 3/4 so WED opens with a majority pick)
  {
    eventId: "45e55370-6218-4b4d-9d62-a5d84a4ae8d6",
    goers: ["you", "ramesh", "daniel", "jessica"],
  },
  // WED May 13 11:30 — 1/4: Creator-era platforms (Jessica + you, low-attendance pick)
  {
    eventId: "1b0459b1-c02e-4b38-83a0-3e21d11d4e83",
    goers: ["jessica", "you"],
  },
  // WED May 13 13:00 — 3/4: Seed & series A founders meetup
  {
    eventId: "2784c1e1-51e8-4e50-a518-28961ed5239b",
    goers: ["you", "daniel", "jessica", "ramesh"],
  },
  // THU May 14 10:30 — 1/4: "What shapes Gen Z's worldview?" (low-attendance)
  {
    eventId: "97881af7-087c-4d7e-ac50-64241a9250f3",
    goers: ["you", "jessica"],
  },
  // THU May 14 10:45 — 3/4: Government Summit "Shifting gears or staying in neutral?"
  // (bumped from 2/4 to 3/4 so today has multiple timeline picks)
  {
    eventId: "78a25e47-acaa-4e90-892c-5b681d02d3e5",
    goers: ["you", "daniel", "ramesh", "jessica"],
  },
  // THU May 14 14:55 — 0/4: Planet Summit pitch deck (your solo pick)
  {
    eventId: "e3a9bb78-8334-4846-988f-14398033d920",
    goers: ["you"],
  },
  // THU May 14 15:00 — 3/4: Centre Stage "AI reads the fine print"
  // (bumped from 2/4 to 3/4 — daniel added)
  {
    eventId: "2a1f778f-c51a-4235-8a43-16368fff456c",
    goers: ["you", "ramesh", "jessica", "daniel"],
  },
];

export type StatusPreset = {
  id: StatusPresetId;
  label: string;
  shortLabel: string;
  emoji: string;
};

export const STATUS_PRESETS: StatusPreset[] = [
  { id: "food", label: "On food break", shortLabel: "On food\nbreak", emoji: "🍕" },
  {
    id: "mainstage",
    label: "At Main Stage",
    shortLabel: "At Main\nStage",
    emoji: "🎤",
  },
  {
    id: "hallb",
    label: "Heading to Hall B",
    shortLabel: "Heading to\nHall B",
    emoji: "🚶",
  },
  {
    id: "findme",
    label: "Come find me",
    shortLabel: "Come\nfind me",
    emoji: "📍",
  },
  {
    id: "coffee",
    label: "Coffee break",
    shortLabel: "Coffee\nbreak",
    emoji: "☕",
  },
];

export const INITIAL_STATUS_FEED: StatusEntry[] = [
  { memberId: "you", preset: "food", minutesAgo: 0 },
  { memberId: "daniel", preset: "mainstage", minutesAgo: 2 },
  { memberId: "jessica", preset: "hallb", minutesAgo: 5 },
  { memberId: "ramesh", preset: "findme", minutesAgo: 12 },
  { memberId: "zohaib", preset: "coffee", minutesAgo: 18 },
];

/**
 * Stylised SVG floor plan uses a 100x100 viewBox.
 * Coordinates are tuned by hand to land each member in a sensible zone.
 */
export const INITIAL_MAP_POSITIONS: Record<MemberId, { x: number; y: number }> =
  {
    you: { x: 14, y: 56 },
    daniel: { x: 50, y: 64 },
    jessica: { x: 50, y: 26 },
    ramesh: { x: 80, y: 50 },
    zohaib: { x: 14, y: 56 },
  };

export const MAP_ZONES = [
  { id: "centre-stage", label: "Centre Stage", x: 50, y: 40 },
  { id: "main-entrance", label: "Main Entrance", x: 22, y: 92 },
  { id: "registration", label: "Registration", x: 42, y: 78 },
  { id: "startup-hall", label: "Startup Hall", x: 80, y: 18 },
  { id: "meetups", label: "Meetups Area", x: 80, y: 75 },
  { id: "food-summit", label: "Food Summit", x: 12, y: 32 },
  { id: "water-front", label: "Waterfront", x: 8, y: 8 },
  { id: "canada-place", label: "Canada Place Entrance", x: 70, y: 92 },
];

export const AI_MATCH_SETS: AIMatch[][] = [
  [
    {
      eventId: "1d7ff5db-cbb4-48bf-9352-23c2c010b3f2",
      going: 4,
      total: 4,
      reason:
        "All 4 members showed strong interest in AI & developer tools. Open-source agents is a thread the entire pack is following.",
    },
    {
      eventId: "1b0459b1-c02e-4b38-83a0-3e21d11d4e83",
      going: 3,
      total: 4,
      reason:
        "3 members are tracking the creator economy. Jessica's media background and the pack's marketing interest make this a strong fit.",
    },
    {
      eventId: "2784c1e1-51e8-4e50-a518-28961ed5239b",
      going: 3,
      total: 4,
      reason:
        "Highly relevant for the founders and operators in your pack. Daniel's Series A focus and the meetup format mean lots of in-person value.",
    },
  ],
  [
    {
      eventId: "4523eed7-1d00-4115-bfbb-c599a40eaa09",
      going: 4,
      total: 4,
      reason:
        "Centre Stage talk with Canada's AI minister — overlaps every member's interest in policy, sovereignty and applied AI.",
    },
    {
      eventId: "fc113bff-81e4-4b66-9e1a-96d4e8d74223",
      going: 3,
      total: 4,
      reason:
        "Sigrid Jin on AI + copyright. Hits Jessica's media angle, Ramesh's open-source interest, and your developer-tools focus.",
    },
    {
      eventId: "78a25e47-acaa-4e90-892c-5b681d02d3e5",
      going: 3,
      total: 4,
      reason:
        "Government Summit headline panel. Strong match for Daniel and Ramesh's policy + hardware regulation interests.",
    },
  ],
];

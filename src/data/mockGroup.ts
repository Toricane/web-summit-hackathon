export const GROUP_CODE = "WSV7XK";
export const GROUP_NAME = "My Group";
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
 * Pre-curated wishlist with deliberate overlap shapes:
 *   4/4 unanimous: hardware founders meetup
 *   3/4: government summit + a couple of AI talks
 *   2/4: New Media Gen-Z talk + Centre Stage Sigrid Jin opener
 *   1/4: niche solo picks
 *
 * Event IDs are real entries pulled from events.json.
 */
type WishlistRow = { eventId: string; goers: MemberId[] };

export const WISHLIST: WishlistRow[] = [
  // THU May 14 — 4/4 unanimous (everyone wants the hardware founders meetup)
  // (Real event 9445ed44... is on May 12 in the dataset. Using the May-13 founders meetup instead to match the "THU" mockup feel.)
  {
    eventId: "2784c1e1-51e8-4e50-a518-28961ed5239b",
    goers: ["you", "daniel", "jessica", "ramesh"],
  },
  // THU May 14 10:45 — 3/4: Government Summit "Shifting gears or staying in neutral?"
  {
    eventId: "78a25e47-acaa-4e90-892c-5b681d02d3e5",
    goers: ["you", "daniel", "ramesh"],
  },
  // THU May 14 10:30 — 2/4: New Media "What shapes Gen Z's worldview?"
  {
    eventId: "97881af7-087c-4d7e-ac50-64241a9250f3",
    goers: ["you", "jessica"],
  },
  // MON May 11 18:20 — 4/4: Centre Stage Sigrid Jin
  {
    eventId: "fc113bff-81e4-4b66-9e1a-96d4e8d74223",
    goers: ["you", "daniel", "jessica", "ramesh"],
  },
  // MON May 11 18:50 — 3/4: Sovereign AI blueprint
  {
    eventId: "4523eed7-1d00-4115-bfbb-c599a40eaa09",
    goers: ["daniel", "jessica", "ramesh"],
  },
  // WED May 13 — AI Summit opener (3/4)
  {
    eventId: "45e55370-6218-4b4d-9d62-a5d84a4ae8d6",
    goers: ["you", "ramesh", "daniel"],
  },
  // WED May 13 — Creator era platforms (2/4)
  {
    eventId: "1b0459b1-c02e-4b38-83a0-3e21d11d4e83",
    goers: ["jessica", "you"],
  },
  // TUE May 12 — Centre Stage Open source in the agentic era (4/4)
  {
    eventId: "1d7ff5db-cbb4-48bf-9352-23c2c010b3f2",
    goers: ["you", "daniel", "jessica", "ramesh"],
  },
  // TUE May 12 — Seed stage VC (1/4: only Daniel)
  {
    eventId: "9afdae16-ee1a-4c02-b1e9-f0480d6144f7",
    goers: ["daniel"],
  },
  // TUE May 12 — Brand building age of AI (2/4)
  {
    eventId: "65c84aef-01f7-4a46-8d1e-36ee40a096f3",
    goers: ["jessica", "you"],
  },
  // THU May 14 14:55 — Planet Summit pitch deck (1/4)
  {
    eventId: "e3a9bb78-8334-4846-988f-14398033d920",
    goers: ["you"],
  },
  // THU May 14 — Centre Stage AI reads the fine print (3/4)
  {
    eventId: "2a1f778f-c51a-4235-8a43-16368fff456c",
    goers: ["you", "ramesh", "jessica"],
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
        "All 4 members showed strong interest in AI & developer tools. Open-source agents is a thread the entire group is following.",
    },
    {
      eventId: "1b0459b1-c02e-4b38-83a0-3e21d11d4e83",
      going: 3,
      total: 4,
      reason:
        "3 members are tracking the creator economy. Jessica's media background and the group's marketing interest make this a strong fit.",
    },
    {
      eventId: "2784c1e1-51e8-4e50-a518-28961ed5239b",
      going: 3,
      total: 4,
      reason:
        "Highly relevant for the founders and operators in your group. Daniel's Series A focus and the meetup format mean lots of in-person value.",
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

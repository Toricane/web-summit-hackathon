# Web Summit Group Coordinator

A lightweight group-coordination layer for live event attendees, built as a focused companion to the official Web Summit app. Form a group with a join code, curate a shared event wishlist, broadcast quick status pings, see your friends on a live floor plan, and let AI surface the talks your whole group should attend together.

Built as a hackathon MVP for **Web Summit Vancouver 2026**.

## What's in this repo

A mobile-first, mockup-driven web app:

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** for the dark + purple visual language
- **No backend** — all group state is mock data + localStorage, so the demo runs offline and deploys as static files anywhere
- **Real data**: all 515 sessions from `events.json` (scraped from the Web Summit Vancouver site) drive the wishlist, AI match recommendations, search, and event detail expansions

On desktop, the app renders inside a centered mobile-shaped viewport with black gutters on either side (it's meant to demo a phone feature). On real mobile, it fills the screen.

## Features (mockup-first)

The bottom navigation has 5 tabs; **only the Group tab is active** in this MVP — the others (Home, Schedule, Scan, Profile) are rendered disabled to keep the demo focused on the new feature.

Inside the Group tab there are four sub-tabs:

| Tab        | What it shows                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Events     | "Event Overlap" — events the group wants to attend, sorted by going-count. Filter by day & format. Browse-all mode searches across 515 events.    |
| Status     | Live group activity feed with relative timestamps and online dots, plus a 5-preset Quick Status grid for one-tap broadcasts.                      |
| Map        | Stylised top-down floor plan of the venue with member pins, status captions, a tap-to-pin mode, and a "Pick zone" sheet for named-zone shortcuts. |
| AI Match   | Pre-computed top-3 recommendations with "Why this match?" reasoning. "Refresh Matches" rotates between two pre-baked candidate sets.              |

A demo join code (`WSV7XK`) is pre-filled on the landing screen — tap **Join Group** to enter. **Leave Group** resets state.

## Running locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173/>.

## Production build

```bash
npm run build
npm run preview   # quick smoke-test of the built bundle
```

The build emits to `dist/`. It's a fully static SPA — no runtime backend required.

## Deploying

### Vercel (recommended, ~30 seconds)

1. Push this repo to GitHub.
2. Import the project on Vercel.
3. Defaults are correct (framework: Vite, build command: `npm run build`, output: `dist`).
4. `vercel.json` already declares an SPA fallback so any path resolves to `index.html`.

### GitHub Pages

The app also works on GitHub Pages because `vite.config.ts` sets `base: "./"` and there's no client-side router that depends on path-based URLs.

```bash
npm run build
# publish the dist/ folder to your gh-pages branch (e.g. via gh-pages package or an Action)
```

## Project structure

```
src/
  data/
    events.json         all 515 scraped sessions
    mockGroup.ts        members, statuses, wishlist, AI matches, map positions
  hooks/
    useGroupState.ts    central reducer with localStorage persistence
  utils/
    events.ts           typed event helpers, format/colour lookups
    time.ts             clock formatting, day labels, relative times
  layout/
    MobileFrame.tsx     mobile-aspect frame for desktop
    BottomNav.tsx       5-tab nav, only "Group" enabled
  screens/
    JoinScreen.tsx      landing with pre-filled join code
    GroupScreen.tsx     header + tab content + bottom nav
  features/group/
    GroupHeader.tsx     join code card, members row
    TabBar.tsx          Events | Status | Map | AI Match
    EventsTab.tsx       overlap list + browse-all-events mode
    StatusTab.tsx       live status panel + activity feed
    MapTab.tsx          floor plan + pins + zone picker
    AIMatchTab.tsx      ranked picks with "Why this match?"
    EventCard.tsx       shared card with overlap pill + bookmark
    FilterSheet.tsx     format filter bottom sheet
    QuickStatusBar.tsx  5 preset pills
    FloorPlan.tsx       stylised SVG of the venue
```

## What's not in v1

These are explicit non-goals for the hackathon MVP (the design leaves room for them to slot in later):

- **Real-time sync.** `useGroupState` is a single hook backed by localStorage. Replacing the reducer with a Supabase channel would make this multiplayer without changing any UI.
- **Claude API for AI Match.** Reasoning text is pre-computed. The shape is set up so `currentAiMatches` could be replaced with a live API call.
- **Vision-based location.** The map supports tap-to-pin and named-zone selection. Auto-detection from a photo (Claude Vision on the venue's signage) is the natural next layer.
- **Other bottom-nav tabs.** Home, Schedule, Scan and Profile are disabled in the nav so the demo focus stays on the new group feature.

## Credits

- Event data scraped from <https://vancouver.websummit.com/sessions/van26/>
- Avatar placeholders served by <https://pravatar.cc/>
- Icons by [Lucide](https://lucide.dev/)

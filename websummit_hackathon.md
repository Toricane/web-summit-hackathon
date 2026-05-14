# Web Summit Vancouver Micro Hackathon — Project Brief

## The Problem

The Web Summit app works well for solo attendees. It handles event discovery, scheduling, maps, and badge scanning competently. But the moment you're navigating the conference with even one other person, it falls apart.

There's no way to coordinate schedules, no way to see where your pack is inside the venue, and no way to quickly signal your status to others. The result: attendees resort to taking screenshots of event pages and coordinating over WhatsApp or iMessage — completely outside the app. The official Web Summit "Meet" function exists but is barebones and focused on 1:1 meeting requests, not pack coordination.

This is a real problem. I encountered it personally at this conference.

---

## The Idea

A lightweight pack coordination layer for live event attendees — built as a standalone web app.

Rather than adding complexity to the existing Web Summit app, this is a focused companion tool for small packs (2–6 people) attending the same event. The core thesis: **packs need shared context, not more features**.

The app lets attendees form a pack with a join code, collectively curate which events they want to attend, see where interests overlap, and broadcast quick status signals to each other without opening a chat.

---

## Features (scoped for 3 hours)

### 1. Pack creation & join
- One attendee creates a pack and gets a short join code
- Others enter the code to join the shared session
- All pack state is live and synced in real time

### 2. Shared Event Wishlist with Overlap View
- All Web Summit Vancouver events are loaded from a pre-scraped JSON dataset (real data, all fields)
- Each member independently marks events they want to attend
- The pack view surfaces overlap: e.g. "3/4 members want this talk"
- This is the core feature — it replaces the screenshot-and-message workflow entirely

### 3. Quick Status Broadcasts
- One-tap preset statuses pushed to the whole pack instantly
- Examples: 🍕 "On food break", 🎤 "At Main Stage", 🚶 "Heading to Hall B", 📍 "Come find me"
- No free-text input, no chat — just fast, low-friction signals
- Removes the need to open a separate messaging app for the most common coordination moments

### 4. AI Pack Match *(after core features are stable)*
- Given each member's selected interests or industry tags, an AI model (Claude API) analyzes the real event data and recommends the top 3 talks the whole pack should attend together
- Surfaces events that have broad appeal across the pack's mix of backgrounds
- Adds a genuinely useful layer on top of the raw overlap data

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + Vite | Fast to scaffold, component model suits the UI |
| Hosting | Vercel | Instant live URL, free tier, deploys in under a minute |
| Real-time state | Supabase | Pack sync, status broadcasts, easy free-tier setup |
| Event data | Pre-scraped JSON | All Web Summit Vancouver events, loaded locally — no API dependency |
| AI feature | Claude API (Sonnet) | Pack match recommendation against real event data |

The event JSON is loaded and cached client-side since it's static. Only pack state and status pings require live network calls — this matters because conference WiFi is notoriously unreliable.

---

## Build Order

| Time | Task |
|---|---|
| 0:00 – 0:20 | Scaffold React app, deploy to Vercel, set up Supabase project |
| 0:20 – 0:50 | Pack create/join flow + load and display events from JSON |
| 0:50 – 1:30 | Event wishlist with per-member selection + overlap view |
| 1:30 – 2:00 | Status ping broadcasts (Supabase real-time) |
| 2:00 – 2:20 | AI Pack Match feature (Claude API + event JSON) |
| 2:20 – 2:45 | Mobile polish, end-to-end pack flow testing |
| 2:45 – 3:00 | Record 1–2 min demo video, submit on Devpost |

---

## Map & Location (Time Permitting)

Real-time indoor location is the natural next layer of the product. GPS doesn't work reliably inside large venues, so the approach is tiered by available time.

**~30 minutes left: Named zone selector**
A button grid of real venue zones (Centre Stage, Exhibition Floor, Startup Hall, etc.). One tap updates your location, synced via Supabase, and shown as a labeled pin on a static floor plan image of the Vancouver Convention Centre. Simple, honest, and fully functional.

**~45 minutes left: Tap-to-pin on a floor plan**
Same concept but interactive — tap anywhere on the venue image to drop your pin. More intuitive and looks better in a demo.

**If feeling bold: Camera → Claude Vision → auto-pin**
The most original approach and worth attempting if the core features are solid with buffer time remaining. The flow:
- User taps "Where am I?"
- Takes a photo of their surroundings
- Image is sent to the Claude Vision API: *"Based on the signage and surroundings visible, which area of Web Summit Vancouver is this?"*
- The returned zone name auto-sets their location on the pack map

Web Summit's signage-heavy environment makes this surprisingly tractable. The risk is reliability — lighting and angles affect it — so this only gets built if there's comfortable time remaining.

**If not implemented — what to say in the demo video:**
> "Location is the missing piece. The full vision uses the camera to identify where you are from venue signage, feeding into the same pack map. Indoor GPS doesn't work reliably at scale, but Web Summit's signage-dense environment makes vision-based positioning a tractable problem — and one that fits naturally into the same AI-powered stack."

A well-articulated future feature can score better than a half-baked implementation. Judges penalize broken demos harder than they reward overscoped ones.

---

## Judging Alignment

- **Originality** — No pack coordination layer exists for Web Summit or comparable events. The overlap view is a novel UI concept in this space.
- **Impact** — Solves a real, friction-heavy problem that every attendee in a pack faces. The use case is immediately relatable to any judge who has attended a conference with colleagues.
- **Technical execution** — Real event data, live real-time sync, AI-powered recommendation, deployed live URL.
- **Wildcard** — The story is authentic: built at Web Summit, for Web Summit, because of a problem experienced at Web Summit the day before.

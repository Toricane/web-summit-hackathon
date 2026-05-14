import { Zap, ChevronRight, Coffee, Footprints, Mic, Pizza, MapPin } from "lucide-react";
import { usePackState, memberById } from "../../hooks/usePackState";
import { QuickStatusBar } from "./QuickStatusBar";
import { relativeTime } from "../../utils/time";
import type { StatusPresetId } from "../../data/mockPack";

const ICON_MAP: Record<StatusPresetId, typeof Pizza> = {
  food: Pizza,
  mainstage: Mic,
  hallb: Footprints,
  findme: MapPin,
  coffee: Coffee,
};

const TINT_MAP: Record<StatusPresetId, { bg: string; ring: string; text: string }> = {
  food: { bg: "bg-orange-500/15", ring: "border-orange-400/40", text: "text-orange-300" },
  mainstage: { bg: "bg-brand/15", ring: "border-brand/40", text: "text-brand-light" },
  hallb: { bg: "bg-emerald-500/15", ring: "border-emerald-400/40", text: "text-emerald-300" },
  findme: { bg: "bg-rose-500/15", ring: "border-rose-400/40", text: "text-rose-300" },
  coffee: { bg: "bg-amber-500/15", ring: "border-amber-400/40", text: "text-amber-300" },
};

export function StatusTab() {
  const { state, members, presetById, broadcast } = usePackState();
  const you = state.statusFeed.find((s) => s.memberId === "you");
  const others = state.statusFeed.filter((s) => s.memberId !== "you");
  const youMember = members.find((m) => m.id === "you")!;

  const overlappingOnFood = members
    .filter((m) => m.id !== "you")
    .filter((m) => {
      const entry = state.statusFeed.find((s) => s.memberId === m.id);
      return entry && entry.preset === (you?.preset ?? "food");
    });

  return (
    <div className="flex flex-col">
      <div className="border-b border-line">
        <QuickStatusBar
          title="Quick Status"
          subtitle="Tap to broadcast to the pack"
        />
      </div>
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Live Status</h2>
            <p className="text-[12px] text-ink-muted">
              See what your pack is up to right now
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              broadcast(
                you ? (cycleNext(you.preset) as StatusPresetId) : "mainstage",
              )
            }
            className="rounded-full bg-brand text-white text-xs font-semibold px-3 py-1.5 flex items-center gap-1 tap"
          >
            <Zap className="w-3.5 h-3.5" />
            Broadcast Status
          </button>
        </div>

        {you && (
          <div className="mt-3 card p-3 flex items-center gap-3">
            <StatusBubble preset={you.preset} large />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">
                {presetById(you.preset).label}
              </div>
              <div className="text-[11px] text-brand-light">
                You · {relativeTime(you.minutesAgo)}
              </div>
            </div>
            <div className="flex -space-x-1.5 items-center">
              {overlappingOnFood.slice(0, 3).map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.shortName}
                  className="w-6 h-6 rounded-full border-2 border-card object-cover"
                />
              ))}
              <span className="ml-1.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Pack Activity</h3>
          <button className="text-[11px] text-brand-light flex items-center gap-0.5 tap">
            History
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <ul className="mt-2 space-y-2">
          {others.map((entry) => {
            const m = memberById(entry.memberId);
            const preset = presetById(entry.preset);
            return (
              <li
                key={entry.memberId + entry.preset + entry.minutesAgo}
                className="card p-3 flex items-center gap-3"
              >
                <StatusBubble preset={entry.preset} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {preset.label}
                  </div>
                  <div className="text-[11px]">
                    <span className="text-brand-light font-medium">
                      {m.shortName}
                    </span>
                    <span className="text-ink-muted">
                      {" "}
                      · {relativeTime(entry.minutesAgo)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={m.avatar}
                    alt={m.shortName}
                    className="w-7 h-7 rounded-full object-cover border border-line"
                  />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </li>
            );
          })}
        </ul>

        <button className="mt-3 w-full text-center text-[12px] text-brand-light py-2 flex items-center justify-center gap-1 tap">
          View full activity history
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-subtle">
          <img
            src={youMember.avatar}
            alt="You"
            className="w-5 h-5 rounded-full"
          />
          <span>
            Signed in as <span className="text-ink">You</span> · status visible
            only to your pack
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBubble({
  preset,
  large = false,
}: {
  preset: StatusPresetId;
  large?: boolean;
}) {
  const Icon = ICON_MAP[preset];
  const tint = TINT_MAP[preset];
  const size = large ? "w-10 h-10" : "w-9 h-9";
  return (
    <span
      className={[
        "rounded-full grid place-items-center border shrink-0",
        size,
        tint.bg,
        tint.ring,
      ].join(" ")}
    >
      <Icon className={["w-4 h-4", tint.text].join(" ")} />
    </span>
  );
}

function cycleNext(preset: StatusPresetId): StatusPresetId {
  const order: StatusPresetId[] = [
    "food",
    "mainstage",
    "hallb",
    "findme",
    "coffee",
  ];
  const i = order.indexOf(preset);
  return order[(i + 1) % order.length];
}

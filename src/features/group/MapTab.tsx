import { useState } from "react";
import { ChevronDown, MapPin, List, Crosshair, X } from "lucide-react";
import { useGroupState } from "../../hooks/useGroupState";
import { MAP_ZONES, type MemberId } from "../../data/mockGroup";
import { FloorPlan } from "./FloorPlan";

export function MapTab() {
  const { state, members, presetById, moveUser } = useGroupState();
  const [legendOpen, setLegendOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [tapMode, setTapMode] = useState(false);

  const positions = state.mapPositions;
  const livingMembers = members.filter((m) => m.id !== "you");

  const labelFor = (id: MemberId) => {
    const s = state.statusFeed.find((x) => x.memberId === id);
    return s ? presetById(s.preset).label : "";
  };

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Live Group Map</h2>
            <p className="text-[12px] text-ink-muted">
              See where your group is in the venue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-card border border-line px-3 py-1.5 text-xs flex items-center gap-1 tap"
            >
              Level 01
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setLegendOpen((v) => !v)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs flex items-center gap-1 tap",
                legendOpen
                  ? "border-brand bg-brand/20 text-brand-light"
                  : "border-line bg-card",
              ].join(" ")}
            >
              <List className="w-3 h-3" />
              Legend
            </button>
          </div>
        </div>

        <div className="mt-3 card overflow-hidden">
          <div className="relative aspect-[4/5] bg-card-muted">
            <FloorPlan
              onTapZone={
                tapMode
                  ? (x, y) => {
                      moveUser(x, y);
                      setTapMode(false);
                    }
                  : undefined
              }
            />

            {tapMode && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-brand text-white text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Crosshair className="w-3.5 h-3.5" />
                Tap anywhere on the map
                <button
                  className="ml-1 opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTapMode(false);
                  }}
                  aria-label="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {members.map((m) => {
              const pos = positions[m.id];
              if (!pos) return null;
              return (
                <Pin
                  key={m.id}
                  x={pos.x}
                  y={pos.y}
                  avatar={m.avatar}
                  name={m.shortName}
                  isYou={m.id === "you"}
                  label={
                    m.id === "you"
                      ? presetById(
                          state.statusFeed.find((s) => s.memberId === "you")
                            ?.preset ?? "food",
                        ).label
                      : labelFor(m.id)
                  }
                />
              );
            })}

            {legendOpen && (
              <div className="absolute top-2 right-2 card p-3 w-44 text-[11px] z-10">
                <div className="text-ink-muted mb-2 font-semibold">Legend</div>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full ring-2 ring-brand bg-card" />
                    <span>You</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full ring-2 ring-emerald-400 bg-card" />
                    <span>Group member</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Live now</span>
                  </li>
                </ul>
                <button
                  onClick={() => setLegendOpen(false)}
                  className="absolute top-1 right-1 p-1 text-ink-subtle"
                  aria-label="Close legend"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-line flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {livingMembers.length} members live · Last updated just now
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoneOpen(true)}
                className="rounded-full bg-card-elevated border border-line px-3 py-1.5 text-xs tap"
              >
                Pick zone
              </button>
              <button
                type="button"
                onClick={() => setTapMode((v) => !v)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1 tap",
                  tapMode
                    ? "bg-brand-light text-brand-dark"
                    : "bg-brand text-white",
                ].join(" ")}
              >
                <MapPin className="w-3.5 h-3.5" />
                {tapMode ? "Tap on map…" : "Update My Location"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {livingMembers.map((m) => {
            const s = state.statusFeed.find((x) => x.memberId === m.id);
            const label = s ? presetById(s.preset).label : "Offline";
            return (
              <div key={m.id} className="card p-2.5 flex items-center gap-2">
                <img
                  src={m.avatar}
                  alt={m.shortName}
                  className="w-8 h-8 rounded-full object-cover border border-line"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold truncate">
                    {m.shortName}
                  </div>
                  <div className="text-[10px] text-brand-light truncate">
                    {label}
                  </div>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            );
          })}
        </div>
      </div>

      {zoneOpen && (
        <div className="absolute inset-0 z-40 flex items-end">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/60"
            onClick={() => setZoneOpen(false)}
          />
          <div className="relative w-full bg-card border-t border-line rounded-t-3xl p-4 pb-6 max-h-[70%] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Quick-set your zone</h3>
              <button
                onClick={() => setZoneOpen(false)}
                className="p-1 text-ink-muted"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] text-ink-muted mt-1">
              Tap a named zone to drop your pin instantly.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {MAP_ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    moveUser(z.x, z.y);
                    setZoneOpen(false);
                  }}
                  className="card p-3 text-left tap"
                >
                  <div className="text-[12px] font-semibold">{z.label}</div>
                  <div className="text-[10px] text-ink-muted mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Drop pin here
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pin({
  x,
  y,
  avatar,
  name,
  label,
  isYou,
}: {
  x: number;
  y: number;
  avatar: string;
  name: string;
  label: string;
  isYou: boolean;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div
        className={[
          "rounded-full p-0.5 ring-2",
          isYou ? "ring-brand" : "ring-emerald-400",
        ].join(" ")}
      >
        <img
          src={avatar}
          alt={name}
          className="w-7 h-7 rounded-full object-cover"
        />
      </div>
      <div className="mt-1 rounded-md bg-card-elevated/95 backdrop-blur px-1.5 py-0.5 text-[9px] leading-tight max-w-[80px] text-center border border-line">
        <div className="font-semibold text-ink truncate">
          {isYou ? "You" : name}
        </div>
        <div className="text-ink-muted truncate">{label}</div>
      </div>
    </div>
  );
}

import { Coffee, Footprints, Mic, Pizza, MapPin } from "lucide-react";
import { usePackState } from "../../hooks/usePackState";
import { STATUS_PRESETS, type StatusPresetId } from "../../data/mockPack";

const ICONS: Record<
  StatusPresetId,
  { Icon: typeof Coffee; ringTint: string; iconTint: string; bg: string }
> = {
  food: {
    Icon: Pizza,
    ringTint: "border-orange-400/40",
    iconTint: "text-orange-300",
    bg: "bg-orange-500/15",
  },
  mainstage: {
    Icon: Mic,
    ringTint: "border-brand/40",
    iconTint: "text-brand-light",
    bg: "bg-brand/15",
  },
  hallb: {
    Icon: Footprints,
    ringTint: "border-emerald-400/40",
    iconTint: "text-emerald-300",
    bg: "bg-emerald-500/15",
  },
  findme: {
    Icon: MapPin,
    ringTint: "border-rose-400/40",
    iconTint: "text-rose-300",
    bg: "bg-rose-500/15",
  },
  coffee: {
    Icon: Coffee,
    ringTint: "border-amber-400/40",
    iconTint: "text-amber-300",
    bg: "bg-amber-500/15",
  },
};

export function QuickStatusBar({
  title = "Quick Status",
  subtitle = "Broadcast your status to the pack",
  variant = "default",
}: {
  title?: string;
  subtitle?: string;
  variant?: "default" | "compact";
}) {
  const { broadcast, state, presetById } = usePackState();
  const current = state.statusFeed.find((s) => s.memberId === "you");

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-[11px] text-ink-muted">{subtitle}</div>
        </div>
        {current && variant === "default" && (
          <div className="text-[10px] text-ink-subtle">
            You: {presetById(current.preset).label}
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {STATUS_PRESETS.map((p) => {
          const { Icon, ringTint, iconTint, bg } = ICONS[p.id];
          const active = current?.preset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => broadcast(p.id)}
              aria-pressed={active}
              className={[
                "rounded-2xl border tap p-2 flex flex-col items-center justify-start gap-1",
                "bg-card",
                active
                  ? "border-brand ring-1 ring-brand"
                  : "border-line",
              ].join(" ")}
            >
              <span
                className={[
                  "w-9 h-9 rounded-full grid place-items-center border",
                  bg,
                  ringTint,
                ].join(" ")}
              >
                <Icon className={["w-4 h-4", iconTint].join(" ")} />
              </span>
              <span className="text-[10px] leading-tight text-center text-ink whitespace-pre-line">
                {p.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

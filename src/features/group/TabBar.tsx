import { CalendarDays, Zap, MapPin, Sparkles } from "lucide-react";

export type TabId = "events" | "status" | "map" | "ai";

const TABS: { id: TabId; label: string; Icon: typeof Zap }[] = [
  { id: "events", label: "Events", Icon: CalendarDays },
  { id: "status", label: "Status", Icon: Zap },
  { id: "map", label: "Map", Icon: MapPin },
  { id: "ai", label: "AI Match", Icon: Sparkles },
];

export function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <div className="shrink-0 px-2 border-b border-line bg-app">
      <div className="grid grid-cols-4">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={[
                "flex flex-col items-center justify-center py-3 gap-1 tap relative",
                isActive ? "text-ink" : "text-ink-muted",
              ].join(" ")}
            >
              <Icon className="w-4 h-4" strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-brand-light" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

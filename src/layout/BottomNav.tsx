import { Home, Calendar, Users, ScanLine, User } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  Icon: typeof Home;
  enabled: boolean;
};

const ITEMS: NavItem[] = [
  { id: "home", label: "Home", Icon: Home, enabled: false },
  { id: "schedule", label: "Schedule", Icon: Calendar, enabled: false },
  { id: "pack", label: "Pack", Icon: Users, enabled: true },
  { id: "scan", label: "Scan", Icon: ScanLine, enabled: false },
  { id: "profile", label: "Profile", Icon: User, enabled: false },
];

export function BottomNav() {
  return (
    <nav className="shrink-0 border-t border-line bg-app/95 backdrop-blur safe-bottom">
      <ul className="grid grid-cols-5 h-16">
        {ITEMS.map((item) => {
          const active = item.id === "pack";
          return (
            <li key={item.id} className="flex items-center justify-center">
              <button
                disabled={!item.enabled}
                aria-disabled={!item.enabled}
                aria-current={active ? "page" : undefined}
                className={[
                  "w-full h-full flex flex-col items-center justify-center gap-1 text-[10px] tap",
                  active
                    ? "text-brand-light"
                    : "text-ink-subtle",
                  !item.enabled ? "opacity-40 cursor-not-allowed" : "",
                ].join(" ")}
              >
                {active ? (
                  <span className="w-9 h-9 rounded-full bg-brand/25 grid place-items-center">
                    <item.Icon className="w-5 h-5" strokeWidth={2.25} />
                  </span>
                ) : (
                  <item.Icon className="w-5 h-5" strokeWidth={2} />
                )}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

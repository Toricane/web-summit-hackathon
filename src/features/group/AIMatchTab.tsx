import { useState } from "react";
import { Sparkles, RefreshCw, ArrowRight, Info } from "lucide-react";
import { useGroupState } from "../../hooks/useGroupState";
import { EventCard } from "./EventCard";
import { OTHER_MEMBER_IDS } from "../../data/mockGroup";
import type { TabId } from "./TabBar";

type AIMatchTabProps = {
  onSwitchTab?: (id: TabId) => void;
};

export function AIMatchTab({ onSwitchTab }: AIMatchTabProps) {
  const { currentAiMatches, refreshAiMatches } = useGroupState();
  const [refreshedAt, setRefreshedAt] = useState("just now");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshedAt("just now");
    window.setTimeout(() => {
      refreshAiMatches();
      setRefreshing(false);
    }, 650);
  };

  return (
    <div className="flex flex-col px-4 pt-3 pb-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">AI Group Match</h2>
            <span className="pill bg-brand/20 text-brand-light">BETA</span>
          </div>
          <p className="text-[12px] text-ink-muted">
            AI-powered recommendations tailored to your group's interests and
            backgrounds.
          </p>
        </div>
        <div className="text-right shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-full bg-brand text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1 tap disabled:opacity-60"
          >
            <RefreshCw
              className={[
                "w-3.5 h-3.5",
                refreshing ? "animate-spin" : "",
              ].join(" ")}
            />
            {refreshing ? "Thinking…" : "Refresh Matches"}
          </button>
          <div className="text-[10px] text-ink-subtle mt-1">
            Last updated {refreshedAt}
          </div>
        </div>
      </div>

      <div className="card p-3 flex items-start gap-3">
        <span className="w-8 h-8 rounded-lg bg-brand/20 grid place-items-center shrink-0">
          <Info className="w-4 h-4 text-brand-light" />
        </span>
        <div className="flex-1 text-[12px] text-ink-muted leading-relaxed">
          <span className="text-ink font-semibold">How it works.</span>{" "}
          We analyse every event your group has shown interest in, along with
          your profiles, to find the talks with the highest group appeal.
        </div>
        <button className="text-[11px] text-brand-light tap shrink-0">
          Learn more
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Top 3 picks for your group</h3>
        <p className="text-[11px] text-ink-muted">
          Based on interests, industries and schedule overlap
        </p>

        <div className="mt-3 space-y-3">
          {currentAiMatches.map((match, idx) => (
            <EventCard
              key={match.eventId}
              eventId={match.eventId}
              rankBadge={idx + 1}
              goers={OTHER_MEMBER_IDS.slice(0, match.going)}
              totalOthers={match.total}
              matchLabel="Group match"
              reason={match.reason}
            />
          ))}
        </div>
      </div>

      <div className="card p-3 flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-brand/20 grid place-items-center shrink-0">
          <Sparkles className="w-4 h-4 text-brand-light" />
        </span>
        <div className="flex-1">
          <div className="text-[12px] font-semibold">
            Help AI improve your matches
          </div>
          <div className="text-[11px] text-ink-muted">
            Keep adding events to your wishlist so we can learn what matters to
            your group.
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSwitchTab?.("events")}
          className="rounded-full bg-card-elevated border border-line px-3 py-1.5 text-xs flex items-center gap-1 tap"
        >
          Add More
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

import { ArrowLeft, Copy, Plus, Users, Check } from "lucide-react";
import { useState } from "react";
import { useGroupState } from "../../hooks/useGroupState";
import {
  CONFERENCE_DATE_RANGE,
  CONFERENCE_LABEL,
  GROUP_CODE,
  GROUP_NAME,
  MEMBER_LIMIT,
} from "../../data/mockGroup";

export function GroupHeader() {
  const { members, leave } = useGroupState();
  const [copied, setCopied] = useState(false);

  const visibleMembers = members.filter((m) => m.id !== "you");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(GROUP_CODE);
    } catch {
      // ignore — feature is cosmetic in demo
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="px-4 pt-12 pb-4 bg-app">
      <div className="flex items-center gap-3">
        <button
          onClick={leave}
          aria-label="Back"
          className="p-1 -ml-1 text-ink-muted hover:text-ink tap"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="w-8 h-8 rounded-full bg-brand/25 grid place-items-center shrink-0">
            <Users className="w-4 h-4 text-brand-light" />
          </span>
          <div className="min-w-0">
            <div className="text-base font-semibold truncate">{GROUP_NAME}</div>
            <div className="text-[11px] text-ink-muted truncate">
              {CONFERENCE_LABEL} · {CONFERENCE_DATE_RANGE}
            </div>
          </div>
        </div>
        <button
          onClick={leave}
          className="rounded-full border border-rose-400/60 text-rose-300 px-3 py-1 text-xs font-medium hover:bg-rose-400/10 tap"
        >
          Leave Group
        </button>
      </div>

      <div className="mt-4 card p-4 flex items-stretch gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
            Join Code
          </div>
          <button
            onClick={onCopy}
            className="mt-1 flex items-center gap-2 text-2xl font-extrabold tracking-[0.18em] text-brand-light tap"
            aria-label="Copy join code"
          >
            {GROUP_CODE}
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-ink-muted" />
            )}
          </button>
          <div className="text-[11px] text-ink-subtle mt-1">
            Share this code with your friends
          </div>
        </div>
        <div className="w-px bg-line" />
        <div className="shrink-0 flex flex-col justify-between min-w-[120px]">
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-subtle text-right">
            {visibleMembers.length} / {MEMBER_LIMIT} MEMBERS
          </div>
          <div className="mt-2 flex -space-x-2 items-center justify-end">
            {visibleMembers.map((m) => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.shortName}
                className="w-8 h-8 rounded-full border-2 border-card object-cover"
              />
            ))}
            <button
              className="w-8 h-8 rounded-full border-2 border-card bg-card-muted grid place-items-center text-ink-muted hover:text-ink tap"
              aria-label="Invite more"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

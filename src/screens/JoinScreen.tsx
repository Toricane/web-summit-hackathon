import { useState } from "react";
import { Sparkles, Users, ArrowRight, Lock } from "lucide-react";
import { useGroupState } from "../hooks/useGroupState";
import {
  CONFERENCE_DATE_RANGE,
  CONFERENCE_LABEL,
  GROUP_CODE,
} from "../data/mockGroup";

export function JoinScreen() {
  const { join } = useGroupState();
  const [code, setCode] = useState(GROUP_CODE);
  const [touched, setTouched] = useState(false);
  const valid = code.trim().toUpperCase() === GROUP_CODE;
  const invalid = touched && !valid;

  return (
    <div className="flex-1 flex flex-col bg-app text-ink relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl"
      />

      <div className="relative flex-1 flex flex-col p-6 pt-14">
        <div className="flex items-center gap-2 text-ink-muted text-xs uppercase tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5 text-brand-light" />
          <span>Group Coordinator</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold leading-tight">
          Navigate <span className="text-brand-light">Web&nbsp;Summit</span>
          <br />
          with your group.
        </h1>
        <p className="mt-3 text-ink-muted text-sm leading-relaxed">
          Share an event wishlist, see where your group is on the venue map,
          and broadcast quick statuses — without leaving the floor.
        </p>

        <div className="mt-10 flex-1 flex flex-col justify-center">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
                Join Code
              </div>
              <div className="text-[11px] text-ink-subtle flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {CONFERENCE_LABEL} · {CONFERENCE_DATE_RANGE}
              </div>
            </div>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase().slice(0, 6));
                setTouched(true);
              }}
              onBlur={() => setTouched(true)}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              className={[
                "mt-3 w-full bg-transparent text-center text-3xl tracking-[0.45em] font-bold",
                "text-brand-light placeholder:text-ink-subtle outline-none",
                "border-b-2 transition-colors py-2",
                invalid ? "border-rose-500" : "border-line focus:border-brand",
              ].join(" ")}
              placeholder="WSV___"
            />
            <div className="mt-2 h-4 text-xs">
              {invalid ? (
                <span className="text-rose-400">
                  Demo code is{" "}
                  <button
                    type="button"
                    className="underline underline-offset-2"
                    onClick={() => {
                      setCode(GROUP_CODE);
                      setTouched(false);
                    }}
                  >
                    {GROUP_CODE}
                  </button>
                </span>
              ) : (
                <span className="text-ink-subtle">
                  Tip: code is pre-filled for the demo.
                </span>
              )}
            </div>
          </div>

          <button
            disabled={!valid}
            onClick={join}
            className="mt-6 w-full rounded-2xl bg-brand text-white py-4 font-semibold
                       flex items-center justify-center gap-2 tap
                       disabled:bg-brand/40 disabled:cursor-not-allowed"
          >
            <Users className="w-5 h-5" />
            Join Group
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            disabled
            className="mt-3 w-full rounded-2xl border border-line py-4 font-semibold
                       text-ink-subtle bg-card-muted cursor-not-allowed"
            title="Disabled in the demo"
          >
            Create New Group
          </button>

          <p className="mt-4 text-center text-[11px] text-ink-subtle">
            By joining you'll see four pre-loaded teammates' wishlists,
            statuses, and pins.
          </p>
        </div>

        <div className="mt-auto text-center text-[11px] text-ink-subtle pt-4">
          A companion to the official Web Summit app · MVP demo
        </div>
      </div>
    </div>
  );
}

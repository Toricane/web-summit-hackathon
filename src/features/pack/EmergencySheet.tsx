import {
  ChevronRight,
  Loader2,
  Phone,
  Check,
  ShieldAlert,
  Siren,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  usePackState,
  type EmergencyTarget,
} from "../../hooks/usePackState";

type Phase = "idle" | "confirm" | "calling" | "done";

type TargetMeta = {
  id: EmergencyTarget;
  title: string;
  subtitle: string;
  callingLabel: string;
  doneLabel: string;
  confirmTitle: string;
  confirmBody: string;
  Icon: typeof Users;
  bg: string;
  border: string;
  text: string;
  confirmBtn: string;
};

const TARGETS: TargetMeta[] = [
  {
    id: "pack",
    title: "Notify your pack",
    subtitle: "Share your live location with 4 packmates",
    callingLabel: "Notifying your pack",
    doneLabel: "Pack alerted",
    confirmTitle: "Alert your pack?",
    confirmBody:
      "Daniel, Jessica, Ramesh and Zohaib will get a push notification with your last-known location and an SOS prompt.",
    Icon: Users,
    bg: "bg-brand/15",
    border: "border-brand/40",
    text: "text-brand-light",
    confirmBtn: "bg-brand",
  },
  {
    id: "organizers",
    title: "Contact event organizers",
    subtitle: "Web Summit on-site response team",
    callingLabel: "Connecting to organizers",
    doneLabel: "Organizers notified",
    confirmTitle: "Alert event organizers?",
    confirmBody:
      "The Web Summit Vancouver on-site team will be paged and dispatched to your location at the convention centre.",
    Icon: ShieldAlert,
    bg: "bg-amber-500/15",
    border: "border-amber-400/40",
    text: "text-amber-300",
    confirmBtn: "bg-amber-500",
  },
  {
    id: "911",
    title: "Call 911",
    subtitle: "Vancouver emergency services",
    callingLabel: "Calling 911",
    doneLabel: "911 dispatched",
    confirmTitle: "Call 911?",
    confirmBody:
      "This places a real-world emergency call. Only use for medical, fire, or safety emergencies that need immediate response.",
    Icon: Phone,
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    text: "text-red-300",
    confirmBtn: "bg-red-500",
  },
];

function getTarget(id: EmergencyTarget): TargetMeta {
  return TARGETS.find((t) => t.id === id)!;
}

export function EmergencySheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { notifyEmergency } = usePackState();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<EmergencyTarget | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  };

  useEffect(() => {
    if (open) return;
    clearTimers();
    setPhase("idle");
    setTarget(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (phase === "idle" || phase === "confirm")) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, phase, onClose]);

  useEffect(() => clearTimers, []);

  if (!open) return null;

  const t = target ? getTarget(target) : null;

  const pick = (id: EmergencyTarget) => {
    setTarget(id);
    setPhase("confirm");
  };

  const confirm = () => {
    if (!target) return;
    setPhase("calling");
    const t1 = window.setTimeout(() => {
      setPhase("done");
      notifyEmergency(target);
      const t2 = window.setTimeout(() => {
        onClose();
      }, 1200);
      timersRef.current.push(t2);
    }, 1600);
    timersRef.current.push(t1);
  };

  const cancelConfirm = () => {
    setPhase("idle");
    setTarget(null);
  };

  const canDismissBackdrop = phase === "idle" || phase === "confirm";

  return (
    <div
      className="absolute inset-0 z-50 flex items-end"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close emergency menu"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={canDismissBackdrop ? onClose : undefined}
        tabIndex={canDismissBackdrop ? 0 : -1}
      />
      <div className="relative w-full bg-card border-t border-line rounded-t-3xl p-4 pb-6 max-h-[80%] overflow-y-auto hide-scrollbar">
        {phase === "idle" && (
          <IdleView onPick={pick} onClose={onClose} />
        )}
        {phase === "confirm" && t && (
          <ConfirmView
            target={t}
            onConfirm={confirm}
            onCancel={cancelConfirm}
          />
        )}
        {phase === "calling" && t && <CallingView target={t} />}
        {phase === "done" && t && <DoneView target={t} />}
      </div>
    </div>
  );
}

function IdleView({
  onPick,
  onClose,
}: {
  onPick: (id: EmergencyTarget) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/40 grid place-items-center">
            <Siren className="w-5 h-5 text-red-400" />
          </span>
          <div>
            <h3 className="text-base font-semibold">Emergency</h3>
            <p className="text-[11px] text-ink-muted">
              Choose who to alert. This is a hackathon mockup — no real call
              is placed.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-ink-muted tap"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {TARGETS.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onPick(t.id)}
              className={[
                "w-full card p-3 flex items-center gap-3 tap text-left",
                "hover:border-ink-subtle",
              ].join(" ")}
            >
              <span
                className={[
                  "w-10 h-10 rounded-full grid place-items-center border shrink-0",
                  t.bg,
                  t.border,
                ].join(" ")}
              >
                <t.Icon className={["w-5 h-5", t.text].join(" ")} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{t.title}</div>
                <div className="text-[11px] text-ink-muted truncate">
                  {t.subtitle}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-subtle shrink-0" />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full rounded-full border border-line py-2.5 text-sm text-ink-muted tap"
      >
        Cancel
      </button>
    </>
  );
}

function ConfirmView({
  target,
  onConfirm,
  onCancel,
}: {
  target: TargetMeta;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] text-ink-muted tap"
        >
          ← Back
        </button>
        <span className="pill bg-red-500/15 text-red-300 border border-red-500/30">
          Confirm
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center text-center px-2">
        <span
          className={[
            "w-14 h-14 rounded-full grid place-items-center border",
            target.bg,
            target.border,
          ].join(" ")}
        >
          <target.Icon className={["w-7 h-7", target.text].join(" ")} />
        </span>
        <h3 className="mt-3 text-lg font-semibold">{target.confirmTitle}</h3>
        <p className="mt-1.5 text-[12px] text-ink-muted leading-snug">
          {target.confirmBody}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line py-2.5 text-sm font-medium text-ink tap"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={[
            "rounded-full py-2.5 text-sm font-semibold text-white tap",
            target.confirmBtn,
          ].join(" ")}
        >
          {target.id === "911" ? "Call now" : "Send alert"}
        </button>
      </div>
    </>
  );
}

function CallingView({ target }: { target: TargetMeta }) {
  return (
    <div className="py-6 flex flex-col items-center text-center">
      <span
        className={[
          "w-16 h-16 rounded-full grid place-items-center border",
          target.bg,
          target.border,
        ].join(" ")}
      >
        <Loader2 className={["w-7 h-7 animate-spin", target.text].join(" ")} />
      </span>
      <div className="mt-4 text-base font-semibold flex items-center gap-1">
        {target.callingLabel}
        <DotPulse />
      </div>
      <p className="mt-1.5 text-[12px] text-ink-muted">
        Hang tight — keep the app open.
      </p>
    </div>
  );
}

function DoneView({ target }: { target: TargetMeta }) {
  return (
    <div className="py-6 flex flex-col items-center text-center">
      <span className="w-16 h-16 rounded-full grid place-items-center border bg-emerald-500/15 border-emerald-400/40">
        <Check className="w-8 h-8 text-emerald-300" />
      </span>
      <div className="mt-4 text-base font-semibold">{target.doneLabel}</div>
      <p className="mt-1.5 text-[12px] text-ink-muted">
        Help is on the way. Stay where you are if it's safe.
      </p>
    </div>
  );
}

function DotPulse() {
  return (
    <span className="inline-flex gap-0.5 ml-0.5" aria-hidden>
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 rounded-full bg-current animate-bounce" />
    </span>
  );
}

export function EmergencyBanner() {
  const { state, dismissEmergency } = usePackState();
  const alert = state.lastEmergency;

  useEffect(() => {
    if (!alert) return;
    const id = window.setTimeout(() => dismissEmergency(), 5000);
    return () => window.clearTimeout(id);
  }, [alert, dismissEmergency]);

  if (!alert) return null;
  const t = getTarget(alert.target);

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-3 mt-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 flex items-center gap-2"
    >
      <span className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 grid place-items-center shrink-0">
        <Siren className="w-3.5 h-3.5 text-red-300" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-red-200 truncate">
          {t.doneLabel}
        </div>
        <div className="text-[10px] text-red-200/70">
          Just now · mock alert
        </div>
      </div>
      <button
        type="button"
        onClick={dismissEmergency}
        className="p-1 text-red-200/70 tap"
        aria-label="Dismiss emergency banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

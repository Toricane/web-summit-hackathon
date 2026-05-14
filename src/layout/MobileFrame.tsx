import type { ReactNode } from "react";

/**
 * Wraps the whole app in a phone-shaped viewport on desktop
 * (black gutters on the sides), edge-to-edge on real mobile.
 */
export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black flex items-stretch justify-center">
      <div
        className="relative w-full bg-app text-ink overflow-hidden
                   sm:my-4 sm:w-[420px] sm:h-[880px] sm:rounded-[44px]
                   sm:border sm:border-line sm:shadow-phone
                   sm:flex sm:flex-col"
      >
        <div className="hidden sm:flex absolute top-0 left-0 right-0 h-7 items-center justify-center pointer-events-none z-30">
          <div className="w-32 h-6 bg-black rounded-b-2xl" />
        </div>
        <div className="flex-1 min-h-screen sm:min-h-0 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

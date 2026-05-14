/**
 * Stylised top-down floor plan of the Vancouver Convention Centre West
 * (illustrative — not to scale). Uses a 100x100 viewBox so member pin
 * coordinates in mockPack.ts can be expressed as percentages.
 */
export function FloorPlan({
  onTapZone,
}: {
  onTapZone?: (x: number, y: number) => void;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
      onClick={
        onTapZone
          ? (e) => {
              const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              onTapZone(
                Math.max(2, Math.min(98, x)),
                Math.max(2, Math.min(98, y)),
              );
            }
          : undefined
      }
    >
      <defs>
        <pattern
          id="grid"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#1f1f2e" strokeWidth="0.2" />
        </pattern>
        <pattern
          id="water"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 3 Q1.5 1 3 3 T6 3"
            fill="none"
            stroke="#7C5CFF"
            strokeOpacity="0.4"
            strokeWidth="0.3"
          />
        </pattern>
      </defs>

      <rect x="0" y="0" width="100" height="100" fill="#0a0a14" />
      <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />

      <rect x="0" y="0" width="100" height="14" fill="url(#water)" opacity="0.5" />

      <g fill="#15151f" stroke="#26263a" strokeWidth="0.4">
        <rect x="6" y="22" width="22" height="16" rx="1.5" />
        <rect x="36" y="20" width="30" height="36" rx="2" />
        <rect x="36" y="60" width="30" height="14" rx="1.5" />
        <rect x="70" y="14" width="24" height="22" rx="2" />
        <rect x="70" y="40" width="24" height="14" rx="1.5" />
        <rect x="70" y="60" width="24" height="20" rx="2" />
        <rect x="6" y="42" width="22" height="14" rx="1.5" />
        <rect x="6" y="60" width="22" height="20" rx="1.5" />
      </g>

      <g fill="#7C5CFF" opacity="0.18">
        <circle cx="50" cy="38" r="9" />
        <rect x="74" y="18" width="16" height="14" rx="2" />
        <rect x="74" y="62" width="16" height="14" rx="2" />
      </g>

      <g
        fill="none"
        stroke="#26263a"
        strokeWidth="0.4"
        strokeDasharray="1 1.5"
      >
        <path d="M30 38 L36 38" />
        <path d="M66 38 L70 38" />
        <path d="M50 56 L50 60" />
        <path d="M50 74 L50 80" />
        <path d="M28 50 L36 50" />
        <path d="M28 66 L36 66" />
        <path d="M28 80 L36 80" />
      </g>

      <g
        fontFamily="-apple-system, sans-serif"
        fontSize="2.4"
        fontWeight="600"
        fill="#a1a1aa"
        textAnchor="middle"
      >
        <text x="50" y="39.5">CENTRE STAGE</text>
        <text x="82" y="26">STARTUP HALL</text>
        <text x="82" y="49">REGISTRATION</text>
        <text x="82" y="71">MEETUPS AREA</text>
        <text x="17" y="32">FOOD SUMMIT</text>
        <text x="17" y="51">PITCH STAGE</text>
        <text x="17" y="71">PRESS HALL</text>
        <text x="51" y="69">EXHIBITION FLOOR</text>
      </g>

      <text
        x="6"
        y="9"
        fontFamily="-apple-system, sans-serif"
        fontSize="2.2"
        fill="#7C5CFF"
        opacity="0.7"
      >
        WATER FRONT
      </text>

      <g fontFamily="-apple-system, sans-serif" fontSize="2" fill="#71717a">
        <text x="22" y="96" textAnchor="middle">
          ↑ MAIN ENTRANCE
        </text>
        <text x="74" y="96" textAnchor="middle">
          ↑ CANADA PLACE ENTRANCE
        </text>
      </g>

      <g fill="#a1a1aa" fontFamily="-apple-system, sans-serif" fontSize="1.6">
        <circle cx="33" cy="40" r="0.6" fill="#a790ff" opacity="0.6" />
        <circle cx="33" cy="50" r="0.6" fill="#a790ff" opacity="0.6" />
        <circle cx="33" cy="60" r="0.6" fill="#a790ff" opacity="0.6" />
        <circle cx="33" cy="70" r="0.6" fill="#a790ff" opacity="0.6" />
        <circle cx="67" cy="40" r="0.6" fill="#a790ff" opacity="0.6" />
        <circle cx="67" cy="50" r="0.6" fill="#a790ff" opacity="0.6" />
        <circle cx="67" cy="60" r="0.6" fill="#a790ff" opacity="0.6" />
        <circle cx="67" cy="70" r="0.6" fill="#a790ff" opacity="0.6" />
      </g>
    </svg>
  );
}

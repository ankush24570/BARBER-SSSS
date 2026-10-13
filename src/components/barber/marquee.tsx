"use client";

const ITEMS = [
  "HAIRCUTS",
  "SKIN FADES",
  "BEARD SCULPT",
  "HOT TOWEL SHAVE",
  "KIDS CUTS",
  "GREY BLENDING",
  "WALK-INS WELCOME",
  "EXPRESS PRIORITY",
];

/** Infinite signage marquee strip. */
export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className="marquee-mask relative overflow-hidden border-y border-primary/20 bg-primary/[0.06] py-3.5"
      aria-hidden
    >
      <div className="animate-marquee flex w-max items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-display text-lg tracking-[0.25em] text-primary/80"
          >
            {item}
            <ScissorIcon />
          </span>
        ))}
      </div>
    </div>
  );
}

function ScissorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-primary/50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

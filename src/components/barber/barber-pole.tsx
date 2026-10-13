/** Classic spinning barber pole, pure CSS animation. */
export function BarberPole({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col items-center ${className}`}
      role="img"
      aria-label="Spinning barber pole"
    >
      {/* cap top */}
      <div className="z-10 h-3 w-10 rounded-t-full bg-gradient-to-b from-[oklch(0.45_0.02_70)] to-[oklch(0.3_0.02_70)] shadow-md" />
      {/* glass tube */}
      <div className="relative h-36 w-8 overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-[inset_0_0_12px_rgba(0,0,0,0.55)] sm:h-44">
        <div className="barber-pole-stripe absolute -inset-y-4 inset-x-0" />
        {/* glass highlight */}
        <div className="absolute inset-y-0 left-1 w-1.5 rounded-full bg-white/25 blur-[1px]" />
      </div>
      {/* cap bottom */}
      <div className="z-10 h-3 w-10 rounded-b-full bg-gradient-to-t from-[oklch(0.3_0.02_70)] to-[oklch(0.45_0.02_70)] shadow-md" />
    </div>
  );
}
